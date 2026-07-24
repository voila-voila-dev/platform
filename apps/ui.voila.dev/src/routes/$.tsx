import { createFileRoute, notFound } from "@tanstack/react-router";
import type { MDXComponents } from "mdx/types";
import { type ComponentType, use } from "react";
import { DocsLayout } from "@/components/docs/docs-layout";
import type { TocEntry } from "@/lib/remark-toc-export";

interface MdxModule {
	default: ComponentType<{ components?: MDXComponents }>;
	frontmatter: { title: string; description: string };
	toc: TocEntry[];
}

/** Lazy glob: every page stays its own chunk. */
const pages = import.meta.glob<MdxModule>("../content/docs/**/*.mdx");

const bySlug = new Map(
	Object.entries(pages).map(([file, load]) => [
		file.replace("../content/docs", "").replace(/\.mdx$/, ""),
		load,
	]),
);

/**
 * One promise per slug, annotated with the resolved value so React's `use()`
 * can unwrap it synchronously once settled. The loader awaits it on the
 * server; on the client the component suspends on the same promise during
 * hydration (loaders do not re-run there), which keeps SSR and client output
 * identical.
 */
type ModuleThenable = Promise<MdxModule> & {
	status?: "pending" | "fulfilled" | "rejected";
	value?: MdxModule;
	reason?: unknown;
};

const moduleCache = new Map<string, ModuleThenable>();

function loadModule(slug: string): ModuleThenable {
	let thenable = moduleCache.get(slug);
	if (!thenable) {
		const load = bySlug.get(slug);
		if (!load) throw notFound();
		const pending: ModuleThenable = load().then((mod) => {
			pending.status = "fulfilled";
			pending.value = mod;
			return mod;
		});
		pending.status = "pending";
		moduleCache.set(slug, pending);
		thenable = pending;
	}
	return thenable;
}

export const Route = createFileRoute("/$")({
	loader: async ({ params }) => {
		const slug = `/${params._splat?.replace(/\/+$/, "") ?? ""}`;
		if (!bySlug.has(slug)) throw notFound();
		await loadModule(slug);
		return { slug };
	},
	head: ({ loaderData }) => {
		const mod = loaderData
			? moduleCache.get(loaderData.slug)?.value
			: undefined;
		if (!mod) return {};
		return {
			meta: [
				{ title: `${mod.frontmatter.title} · ui.voila.dev` },
				{ name: "description", content: mod.frontmatter.description },
			],
		};
	},
	component: DocPage,
});

function DocPage() {
	const { slug } = Route.useLoaderData();
	// The status/value annotations confuse React's `Usable` union; the plain
	// promise type is what `use()` actually needs.
	const mod = use(loadModule(slug) as Promise<MdxModule>);
	const Content = mod.default;
	return (
		<DocsLayout slug={slug} frontmatter={mod.frontmatter} toc={mod.toc}>
			<Content />
		</DocsLayout>
	);
}
