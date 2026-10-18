import { describe, expect, it } from "bun:test";
import { join } from "node:path";
import {
	type BrickDependency,
	brokenExports,
	listSourceFiles,
	serverImportsInBrowserCode,
	undeclaredBrickImports,
} from "./structure.ts";

// A dependency between two bricks is a deliberate edit here.
const ALLOWED_BRICK_DEPENDENCIES: ReadonlyArray<BrickDependency> = [];

const packageRoot = join(import.meta.dir, "..");
const files = listSourceFiles(join(packageRoot, "src"));
const manifest = await Bun.file(join(packageRoot, "package.json")).json();

describe("package structure", () => {
	it("keeps the core free of bricks, and bricks on the written list", () => {
		expect(
			undeclaredBrickImports(files, ALLOWED_BRICK_DEPENDENCIES),
			"invert the dependency, or add it to ALLOWED_BRICK_DEPENDENCIES if it is deliberate",
		).toStrictEqual([]);
	});

	it("keeps server code out of what a browser can import", () => {
		expect(
			serverImportsInBrowserCode(files),
			"move the file under a drizzle/ or server/ folder, or drop the import",
		).toStrictEqual([]);
	});

	it("points every export at an existing source and its built files", () => {
		expect(brokenExports(packageRoot, manifest.exports)).toStrictEqual([]);
	});
});

describe("the rules themselves", () => {
	it("refuse the core importing a brick", () => {
		const offending = [
			{ path: "core/id.ts", imports: ["../link-tracking/index.ts"] },
			{ path: "index.ts", imports: ["./link-tracking/index.ts"] },
		];
		expect(undeclaredBrickImports(offending, [])).toHaveLength(2);
	});

	it("refuse an undeclared brick dependency and accept a declared one", () => {
		const email = [
			{ path: "email/send.ts", imports: ["../link-tracking/shorten.ts"] },
		];
		expect(undeclaredBrickImports(email, [])).toHaveLength(1);
		expect(
			undeclaredBrickImports(email, [["email", "link-tracking"]]),
		).toStrictEqual([]);
	});

	it("accept a brick importing the core and its own files", () => {
		const linkTracking = [
			{
				path: "link-tracking/tracked-link.ts",
				imports: ["../core/id.ts", "./link-code.ts", "effect"],
			},
		];
		expect(undeclaredBrickImports(linkTracking, [])).toStrictEqual([]);
	});

	it("refuse server imports in browser code and allow them in drizzle/ and server/", () => {
		const browser = [
			{ path: "link-tracking/a.ts", imports: ["drizzle-orm/pg-core"] },
			{ path: "link-tracking/b.ts", imports: ["node:crypto"] },
			{ path: "link-tracking/c.ts", imports: ["bun"] },
			{ path: "link-tracking/http/api.ts", imports: ["./server/handlers.ts"] },
		];
		expect(serverImportsInBrowserCode(browser)).toHaveLength(4);
		const server = [
			{
				path: "link-tracking/drizzle/table.ts",
				imports: ["drizzle-orm/pg-core"],
			},
			{
				path: "link-tracking/http/server/handlers.ts",
				imports: ["../api.ts", "node:crypto"],
			},
		];
		expect(serverImportsInBrowserCode(server)).toStrictEqual([]);
	});

	it("refuse an export whose built files do not mirror its source", () => {
		expect(
			brokenExports(packageRoot, {
				"./missing": {
					"@voila.dev/source": "./src/missing/index.ts",
					types: "./dist/other.d.ts",
					default: "./dist/missing/index.js",
				},
			}),
		).toHaveLength(2);
	});
});
