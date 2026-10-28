import { StarIcon } from "@phosphor-icons/react";
import { describe, expect, it } from "vitest";
import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type { ContentFieldOf } from "#/content-editor/features/field-definition.ts";
import { createContentRegistry } from "#/content-editor/features/registry.ts";
import { defineElementFeature } from "#/content-editor/lib/define-element-feature.ts";

interface BadgeNode extends ContentNodeLike {
	readonly type: "badge";
	readonly label: string;
	readonly tone: "info" | "warning";
	readonly pinned?: boolean;
}

const reader = {
	type: "badge",
	kind: "void",
	Render: () => null,
	toHtml: () => "",
} as const;

const badgeFeature = defineElementFeature<BadgeNode>({
	key: "badge",
	kind: "void",
	node: reader,
	fields: [
		{ type: "text", key: "label", label: "label" },
		{
			type: "select",
			key: "tone",
			label: "tone",
			options: [
				{ value: "info", label: "info" },
				{ value: "warning", label: "warning" },
			],
		},
		{ type: "boolean", key: "pinned", label: "pinned" },
	],
	defaults: { label: "New", tone: "info" },
	view: () => null,
	insert: { icon: StarIcon, keywords: ["badge"] },
});

describe("defineElementFeature", () => {
	it("mints a node from the defaults, with an id and an empty text child", () => {
		const node = badgeFeature.nodes[0].createNode();
		expect(node).toMatchObject({
			type: "badge",
			label: "New",
			tone: "info",
			children: [{ text: "" }],
		});
		expect(typeof node.id).toBe("string");
		expect(badgeFeature.nodes[0].createNode({ tone: "warning" }).tone).toBe(
			"warning",
		);
	});

	it("offers the element in the slash menu and the insert menu", () => {
		expect(badgeFeature.slash?.map((item) => item.key)).toEqual(["badge"]);
		expect(badgeFeature.toolbar?.map((item) => item.group)).toEqual(["insert"]);
	});

	it("registers its fields for the inspector, under its node type", () => {
		const registry = createContentRegistry([badgeFeature]);
		expect(registry.inspectorFor("badge")).toMatchObject({
			featureKey: "badge",
			fields: [{ key: "label" }, { key: "tone" }, { key: "pinned" }],
		});
		expect(registry.inspectorFor("p")).toBeUndefined();
	});

	it("declares its node to Plate as a void element", () => {
		const registry = createContentRegistry([badgeFeature]);
		const plugin = registry.plugins.find(
			(candidate) => candidate.key === "badge",
		);
		expect(plugin?.node).toMatchObject({ isElement: true, isVoid: true });
	});

	it("types each field against the attribute it edits", () => {
		const fields: ReadonlyArray<ContentFieldOf<BadgeNode>> = [
			{
				type: "select",
				key: "tone",
				label: "tone",
				// @ts-expect-error a select option must be one of the attribute's values
				options: [{ value: "loud", label: "loud" }],
			},
			// @ts-expect-error a boolean attribute takes a boolean field
			{ type: "text", key: "pinned", label: "pinned" },
			// @ts-expect-error the node has no such attribute
			{ type: "text", key: "missing", label: "missing" },
		];
		expect(fields).toHaveLength(3);
	});
});
