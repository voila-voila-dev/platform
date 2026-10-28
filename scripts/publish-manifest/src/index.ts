import { join } from "node:path";
import { publishManifest, type Workspace } from "./publish-manifest.ts";

// `apply` runs as prepack: it keeps the package's package.json aside and
// writes the published one. `restore` runs as postpack and puts it back.
// Both run from the package being packed.

const root = process.cwd();
const workspaceRoot = join(import.meta.dir, "../../..");
const manifestFile = Bun.file(join(root, "package.json"));
const backupFile = Bun.file(
	join(root, "node_modules/.cache/publish-manifest/package.json"),
);

const command = Bun.argv[2];
if (command === "apply") await apply();
else if (command === "restore") await restore();
else {
	console.error(
		"usage: bun ../../scripts/publish-manifest/src/index.ts apply|restore",
	);
	process.exitCode = 1;
}

async function apply() {
	if (await backupFile.exists())
		throw new Error(
			"package.json was not restored after the last pack: run `bun run postpack` first",
		);
	const source = await manifestFile.text();
	await Bun.write(backupFile, source);
	const published = publishManifest(JSON.parse(source), await readWorkspace());
	await Bun.write(manifestFile, `${JSON.stringify(published, null, "\t")}\n`);
}

async function restore() {
	if (!(await backupFile.exists())) return;
	await Bun.write(manifestFile, await backupFile.text());
	await backupFile.delete();
}

async function readWorkspace(): Promise<Workspace> {
	const { workspaces } = await Bun.file(
		join(workspaceRoot, "package.json"),
	).json();
	const versions: Record<string, string> = {};
	for (const pattern of workspaces.packages) {
		const glob = new Bun.Glob(`${pattern}/package.json`);
		for await (const file of glob.scan(workspaceRoot)) {
			const { name, version } = await Bun.file(
				join(workspaceRoot, file),
			).json();
			if (version !== undefined) versions[name] = version;
		}
	}
	return {
		versions,
		catalogs: { "": workspaces.catalog ?? {}, ...workspaces.catalogs },
	};
}
