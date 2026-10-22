import { describe, expect, it } from "bun:test";
import { join } from "node:path";
import {
	exportProblems,
	importMapProblems,
	type Manifest,
} from "./structure/export-rules.ts";
import {
	importViolations,
	type ModuleDependency,
	undeclaredPackages,
	unusedDependencies,
} from "./structure/import-rules.ts";
import { listSourceFiles } from "./structure/source-files.ts";

// A dependency between two modules is a deliberate edit here. Modules refer to
// each other's aggregates by id only, so no adapter needs another module's.
const MODULE_DEPENDENCIES: ReadonlyArray<ModuleDependency> = [
	["link-tracking/click", "link-tracking/link"],
	["link-tracking/link", "rate-limiting"],
	["link-tracking/link", "search"],
	["location", "rate-limiting"],
	["search", "rate-limiting"],
];

const packageRoot = join(import.meta.dir, "..");
const files = listSourceFiles(join(packageRoot, "src"));
const manifest: Manifest & {
	peerDependencies?: Record<string, string>;
	peerDependenciesMeta?: Record<string, { optional?: boolean }>;
} = await Bun.file(join(packageRoot, "package.json")).json();

// An optional peer dependency is a library only some adapter needs.
const adapterPackages = Object.entries(manifest.peerDependenciesMeta ?? {})
	.filter(([, meta]) => meta.optional === true)
	.map(([name]) => name);

describe("package structure", () => {
	it("keeps every import within the rules", () => {
		expect(
			importViolations(files, MODULE_DEPENDENCIES, adapterPackages),
		).toStrictEqual([]);
	});

	it("declares every package it imports as a peer dependency", () => {
		expect(
			undeclaredPackages(files, Object.keys(manifest.peerDependencies ?? {})),
			"add it to peerDependencies, and to peerDependenciesMeta as optional when only an adapter needs it",
		).toStrictEqual([]);
	});

	it("keeps the declared dependencies free of ones the code no longer has", () => {
		expect(unusedDependencies(files, MODULE_DEPENDENCIES)).toStrictEqual([]);
	});

	it("exports exactly the entry points the folders define", () => {
		expect(
			exportProblems(
				files.map((file) => file.path),
				manifest,
			),
		).toStrictEqual([]);
	});

	it("maps # to the source in the repository and to the built files once published", () => {
		expect(importMapProblems(manifest)).toStrictEqual([]);
	});
});
