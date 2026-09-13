import { createPlateEditor } from "platejs/react";
import { describe, expect, it } from "vitest";
import { createContentFeatures } from "#/content-editor/features/create-content-features.ts";
import type { ContentFeature } from "#/content-editor/features/feature-definition.tsx";
import { createContentReaderRegistry } from "#/content-editor/features/reader-registry.ts";
import { createContentRegistry } from "#/content-editor/features/registry.ts";
import { createContentReaders } from "#/content-editor/reader/readers.ts";

const none = new Set<never>();
const withUpload = new Set(["upload-image" as const]);

describe("createContentReaderRegistry", () => {
	it("refuses a feature key or a node type declared twice", () => {
		const readers = createContentReaders();
		expect(() => createContentReaderRegistry([...readers, readers[0]])).toThrow(
			/"paragraph" is declared twice/,
		);
		expect(() =>
			createContentReaderRegistry([
				...readers,
				{
					key: "other",
					nodes: [{ type: "p", Render: () => null, toHtml: () => "" }],
				},
			]),
		).toThrow(/"p" is declared by two features/);
	});

	it("resolves every built-in node type and knows the indentable ones", () => {
		const registry = createContentReaderRegistry(createContentReaders());
		for (const type of [
			"p",
			"h2",
			"h3",
			"a",
			"blockquote",
			"hr",
			"callout",
			"image",
			"table",
			"tr",
			"td",
			"th",
			"youtube-video",
			"x-post",
			"video",
			"file",
		]) {
			expect(registry.nodeFor(type)?.type).toBe(type);
		}
		expect(registry.indentableTypes).toEqual(["p", "h2", "h3", "blockquote"]);
		expect(registry.leaves.map((leaf) => leaf.key)).toEqual([
			"bold",
			"italic",
			"underline",
			"strikethrough",
			"code",
		]);
	});
});

describe("createContentRegistry", () => {
	it("edits exactly what the readers of the same options render", () => {
		const options = {
			headings: ["h2", "h3", "h4"] as const,
			embeds: ["youtube"] as const,
		};
		const editing = createContentRegistry(createContentFeatures(options));
		const reading = createContentReaderRegistry(createContentReaders(options));
		expect(editing.reader.nodeTypes).toEqual(reading.nodeTypes);
	});

	it("assembles a Plate editor whose input rules come from the features and whose indent targets every indentable block", () => {
		const registry = createContentRegistry(createContentFeatures());
		const editor = createPlateEditor({ plugins: [...registry.plugins] });
		const rules = editor.meta.inputRules.insertText.all;
		expect(rules.map((rule) => rule.pluginKey)).toEqual(
			expect.arrayContaining(["h2", "blockquote", "hr", "bold", "list"]),
		);
		expect(editor.getPlugin({ key: "indent" }).inject.targetPlugins).toEqual([
			"p",
			"h2",
			"h3",
			"blockquote",
		]);
	});

	it("keeps indent working when the heading feature is left out", () => {
		const features = createContentFeatures().filter(
			(feature) => feature.key !== "heading",
		);
		const editor = createPlateEditor({
			plugins: [...createContentRegistry(features).plugins],
		});
		expect(editor.getPlugin({ key: "indent" }).inject.targetPlugins).toEqual([
			"p",
			"blockquote",
		]);
	});

	it("hides a feature until its capability is wired", () => {
		const registry = createContentRegistry(createContentFeatures());
		const keysWithout = registry.toolbarItems(none).map((item) => item.key);
		expect(keysWithout).toContain("bold");
		expect(keysWithout).not.toContain("image");
		expect(registry.slashItems(withUpload).map((item) => item.key)).toContain(
			"divider",
		);
	});

	it("drops block features in inline mode and keeps marks and links", () => {
		const registry = createContentRegistry(createContentFeatures(), {
			mode: "inline",
		});
		const keys = registry.plugins.map((plugin) => plugin.key);
		expect(keys).toContain("bold");
		expect(keys).toContain("a");
		expect(keys).not.toContain("h2");
		expect(keys).not.toContain("list");
		expect(keys).not.toContain("slash_command");
	});

	it("lets a host add a feature of its own", () => {
		const stock: ContentFeature = {
			key: "stock-quote",
			nodes: [
				{
					type: "stock-quote",
					kind: "void",
					Render: () => null,
					toHtml: () => "<span>ACME</span>",
				},
			],
			plugins: () => [],
		};
		const registry = createContentRegistry([...createContentFeatures(), stock]);
		expect(registry.featureFor("stock-quote")).toBe(stock);
		expect(
			registry.reader
				.nodeFor("stock-quote")
				?.toHtml({ type: "stock-quote", children: [] }, "", {}),
		).toBe("<span>ACME</span>");
	});
});
