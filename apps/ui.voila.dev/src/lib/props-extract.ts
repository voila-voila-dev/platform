/**
 * Reads every component's props out of `packages/ui` and hands the docs a table
 * per part. Node-only: reached from `remark-prop-table.ts` during the MDX
 * transform and from `scripts/check-docs.mjs`, never from client code.
 *
 * Why the type checker and not a scan: `Props` is a non-exported interface that
 * always `extends` something (CONVENTIONS.md §2), and that something is a Base
 * UI part, a `VariantProps<typeof xVariants>`, an `Omit`/`Pick` of another
 * component's props, or a generic — 58 are `Omit`/`Pick` alone, and 492 of the
 * 1,471 members span more than one line. A regex resolves none of that. The
 * TypeScript API resolves all of it, and gives the one thing the table really
 * needs: for each prop, *the file it was declared in*.
 *
 * That declaration path is the whole filtering rule. `Badge` has 283 props, 280
 * of them React's DOM attributes — those drop out and become the table's "plus
 * every `<span>` prop" footer, leaving what someone actually passes: the cva
 * variants and Base UI's own props.
 *
 * The async API, not the sync one: the sync channel reads Node's internal
 * `stdout._handle.fd`, which does not exist under Bun, and this repo runs Vite
 * under Bun. Each call is a ~0.08ms round trip to `tsgo`, so the whole walk is
 * ~2s: once per build, and again per invalidation in dev, which is the deal the
 * search index already makes. The project is opened and closed per run rather
 * than kept warm through `fileChanges`, because a stale props table is worse
 * than a slow one.
 */
import { readdirSync } from "node:fs";
import path from "node:path";
import {
	isBindingElement,
	isObjectBindingPattern,
	isPropertyAssignment,
	isStringLiteral,
	type Node,
} from "typescript/unstable/ast";
import {
	API,
	type Checker,
	type Program,
	type Project,
	SymbolFlags,
	type Symbol as TsSymbol,
} from "typescript/unstable/async";
import type {
	DocsPropEntry,
	DocsPropMember,
	DocsPropOrigin,
	DocsPropsManifest,
} from "./docs-props.types";

const repoRoot = path.join(import.meta.dirname, "../../../..");
const packageRoot = path.join(repoRoot, "packages/ui");
const packageSrc = path.join(packageRoot, "src");
const configFile = path.join(packageRoot, "tsconfig.json");

/** The API lowercases declaration paths, so every comparison does too. */
const OWN = "/packages/ui/src/";
const PRIMITIVE = ["@base-ui", "userender"];
const DOM = ["@types/react", "lib.dom", "lib.es", "typescript/lib"];

function isPascalCase(name: string): boolean {
	return /^[A-Z]/.test(name);
}

/**
 * Classifies one prop by where it was declared; `undefined` means "drop it".
 *
 * Every declaration is considered, not just the first: `color` on `Badge` and
 * `Chip.Root` is both a cva variant *and* React's deprecated `color` attribute,
 * and the merged symbol lists React's first. Taking `declarations[0]` alone
 * silently drops the variant someone came to the page to read about.
 */
function originOf(symbol: TsSymbol): DocsPropOrigin | undefined {
	const paths = symbol.declarations.map((d) => d.path.toLowerCase());
	if (!paths.length) return undefined;
	if (paths.some((p) => p.includes(OWN))) return "own";
	if (paths.some((p) => PRIMITIVE.some((m) => p.includes(m))))
		return "primitive";
	if (paths.every((p) => DOM.some((m) => p.includes(m)))) return undefined;
	return "dep";
}

/**
 * A part, or not. Components are PascalCase and live in `components/`; the
 * barrels also export hooks, cva recipes and pure helpers, which have call
 * signatures too and would otherwise render a table of their first argument.
 */
function isComponent(name: string, symbol: TsSymbol): boolean {
	if (!isPascalCase(name)) return false;
	return symbol.declarations.some((d) =>
		d.path.toLowerCase().includes("/components/"),
	);
}

/** Depth-first walk; the AST exposes `forEachChild` and nothing shorter. */
function findNode(
	node: Node,
	match: (candidate: Node) => boolean,
): Node | undefined {
	if (match(node)) return node;
	return node.forEachChild((child) => findNode(child, match));
}

/**
 * The defaults, from the destructure that declares them:
 * `{ variant = "default", size = "default", ...props }`. Reading the cva's
 * `defaultVariants` instead would cover the variants and miss every other prop,
 * and the two can disagree — the destructure is what actually runs.
 */
function readDefaults(component: Node): Map<string, string> {
	const out = new Map<string, string>();
	const pattern = findNode(component, isObjectBindingPattern);
	if (!pattern) return out;
	pattern.forEachChild((child) => {
		if (!isBindingElement(child) || !child.initializer) return;
		const name = (child.propertyName ?? child.name)?.getText();
		if (name) out.set(name, child.initializer.getText());
	});
	return out;
}

/**
 * The element the part renders, for the footer line. `useRender` parts declare
 * it outright as `defaultTagName`; the rest carry it in the `Props` base.
 */
function readElement(
	component: Node,
	propsDeclaration: Node | undefined,
): string | undefined {
	const tag = findNode(
		component,
		(n) =>
			isPropertyAssignment(n) &&
			n.name?.getText() === "defaultTagName" &&
			!!n.initializer &&
			isStringLiteral(n.initializer),
	);
	if (tag && isPropertyAssignment(tag) && tag.initializer) {
		return tag.initializer.getText().replace(/["']/g, "");
	}
	return propsDeclaration?.getText().match(/ComponentProps<\s*"(\w+)"/)?.[1];
}

/** Own props first, required before optional, then alphabetical. */
function compareMembers(a: DocsPropMember, b: DocsPropMember): number {
	const rank = (m: DocsPropMember) =>
		m.origin === "own" ? 0 : m.origin === "dep" ? 1 : 2;
	return (
		rank(a) - rank(b) ||
		Number(a.optional) - Number(b.optional) ||
		a.name.localeCompare(b.name)
	);
}

interface Context {
	checker: Checker;
	program: Program;
	project: Project;
}

/** One entry, or `undefined` when the export turns out not to be a part. */
async function extractEntry(
	ctx: Context,
	id: string,
	folder: string,
	symbol: TsSymbol,
): Promise<DocsPropEntry | undefined> {
	const { checker } = ctx;
	const type = await checker.getTypeOfSymbol(symbol);
	if (!type) return undefined;
	const [signature] = await checker.getSignaturesOfType(type, 0);
	if (!signature) return undefined;

	// Resolve to the function itself, not to the `Title: EmptyTitle` property
	// assignment inside the namespace object: the defaults, the `defaultTagName`
	// and the source path all live in the part's own file.
	const componentSymbol = await type.getSymbol();
	const handle = componentSymbol?.declarations[0] ?? symbol.declarations[0];
	const declaration = await handle?.resolve(ctx.project);
	const source = handle
		? path
				.relative(packageSrc.toLowerCase(), handle.path.toLowerCase())
				.replaceAll(path.sep, "/")
		: "";

	const members: DocsPropMember[] = [];
	let propsDeclaration: Node | undefined;
	const [parameter] = await signature.getParameters();
	if (parameter) {
		const propsType = await checker.getTypeOfSymbol(parameter);
		if (propsType) {
			const propsSymbol = await propsType.getSymbol();
			propsDeclaration = await propsSymbol?.declarations[0]?.resolve(
				ctx.project,
			);
			const defaults = declaration
				? readDefaults(declaration)
				: new Map<string, string>();
			for (const prop of await checker.getPropertiesOfType(propsType)) {
				const origin = originOf(prop);
				if (!origin) continue;
				const propType = await checker.getTypeOfSymbol(prop);
				members.push({
					name: prop.name,
					type: propType ? await checker.typeToString(propType) : "unknown",
					optional: !!(prop.flags & SymbolFlags.Optional),
					origin,
					doc: (await prop.getDocumentationComment(checker)).trim(),
					default: defaults.get(prop.name),
				});
			}
		}
	}
	members.sort(compareMembers);

	return {
		id,
		folder,
		source,
		element: declaration
			? readElement(declaration, propsDeclaration)
			: undefined,
		members,
	};
}

/** Every documentable part in the package, keyed by its addressable name. */
export async function readPropsManifest(): Promise<DocsPropsManifest> {
	const api = new API({ cwd: repoRoot });
	try {
		const snapshot = await api.updateSnapshot({ openProjects: [configFile] });
		const project = await snapshot.getProject(configFile);
		if (!project) return {};
		const ctx: Context = {
			checker: project.checker,
			program: project.program,
			project,
		};
		const manifest: DocsPropsManifest = {};

		const folders = readdirSync(packageSrc, { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name)
			.sort();

		for (const folder of folders) {
			const barrel = await ctx.program.getSourceFile(
				path.join(packageSrc, folder, "index.ts"),
			);
			if (!barrel) continue;
			const moduleSymbol = await ctx.checker.getSymbolAtLocation(barrel);
			if (!moduleSymbol) continue;

			for (const exported of await ctx.checker.getExportsOfModule(
				moduleSymbol,
			)) {
				const symbol =
					exported.flags & SymbolFlags.Alias
						? await ctx.checker.getAliasedSymbol(exported)
						: exported;
				if (!symbol || (await ctx.checker.isUnknownSymbol(symbol))) continue;
				if (!isComponent(exported.name, symbol)) continue;

				// A single component, e.g. `Switch`.
				const direct = await extractEntry(ctx, exported.name, folder, symbol);
				if (direct) {
					manifest[direct.id] = direct;
					continue;
				}
				// A namespace object, e.g. `Empty` holding `Empty.Title`.
				const namespaceType = await ctx.checker.getTypeOfSymbol(symbol);
				if (!namespaceType) continue;
				for (const part of await ctx.checker.getPropertiesOfType(
					namespaceType,
				)) {
					if (!isPascalCase(part.name)) continue;
					const entry = await extractEntry(
						ctx,
						`${exported.name}.${part.name}`,
						folder,
						part,
					);
					if (entry) manifest[entry.id] = entry;
				}
			}
		}
		return manifest;
	} finally {
		await api.close();
	}
}
