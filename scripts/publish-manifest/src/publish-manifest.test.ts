import { describe, expect, it } from "bun:test";
import { publishManifest } from "./publish-manifest.ts";

describe("publishManifest", () => {
	it("swaps exports and imports for their published form, in place", () => {
		const published = publishManifest({
			name: "@voila.dev/platform",
			exports: { ".": "./src/index.ts" },
			imports: { "#*": "./src/*.ts" },
			files: ["dist", "src"],
			publishConfig: {
				access: "public",
				exports: { ".": "./dist/index.js" },
				imports: { "#*": "./dist/*.js" },
			},
		});
		expect(published).toStrictEqual({
			name: "@voila.dev/platform",
			exports: { ".": "./dist/index.js" },
			imports: { "#*": "./dist/*.js" },
			files: ["dist", "src"],
			publishConfig: { access: "public" },
		});
		expect(Object.keys(published)).toStrictEqual([
			"name",
			"exports",
			"imports",
			"files",
			"publishConfig",
		]);
	});

	it("leaves a manifest without publishConfig as it is", () => {
		const manifest = { name: "x", exports: { ".": "./src/index.ts" } };
		expect(publishManifest(manifest)).toBe(manifest);
	});
});
