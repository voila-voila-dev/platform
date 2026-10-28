import { describe, expect, it } from "bun:test";
import { publishManifest, type Workspace } from "./publish-manifest.ts";

const workspace: Workspace = {
	versions: { "@voila.dev/motion": "6.0.134" },
	catalogs: {
		"": { typescript: "7.0.2" },
		react: { "@phosphor-icons/react": "2.1.10" },
	},
};

describe("publishManifest", () => {
	it("swaps exports and imports for their published form, in place", () => {
		const published = publishManifest(
			{
				name: "@voila.dev/platform",
				exports: { ".": "./src/index.ts" },
				imports: { "#*": "./src/*.ts" },
				files: ["dist", "src"],
				publishConfig: {
					access: "public",
					exports: { ".": "./dist/index.js" },
					imports: { "#*": "./dist/*.js" },
				},
			},
			workspace,
		);
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

	it("keeps exports without a published counterpart", () => {
		const manifest = { name: "x", exports: { ".": "./src/index.ts" } };
		expect(publishManifest(manifest, workspace)).toStrictEqual(manifest);
	});

	it("resolves workspace and catalog ranges and drops devDependencies", () => {
		const published = publishManifest(
			{
				name: "@voila.dev/ui",
				dependencies: {
					"@voila.dev/motion": "workspace:*",
					"@phosphor-icons/react": "catalog:react",
					clsx: "^2.1.1",
				},
				peerDependencies: { "@voila.dev/motion": "workspace:^" },
				devDependencies: { typescript: "catalog:" },
			},
			workspace,
		);
		expect(published).toStrictEqual({
			name: "@voila.dev/ui",
			dependencies: {
				"@voila.dev/motion": "6.0.134",
				"@phosphor-icons/react": "2.1.10",
				clsx: "^2.1.1",
			},
			peerDependencies: { "@voila.dev/motion": "^6.0.134" },
		});
	});

	it("refuses a range it cannot resolve", () => {
		expect(() =>
			publishManifest(
				{ name: "x", dependencies: { react: "catalog:react" } },
				workspace,
			),
		).toThrow("react is not in the react catalog");
	});
});
