import {
	type AnyPlatePlugin,
	createPlatePlugin,
	type PlateElementProps,
} from "platejs/react";
import type { FunctionComponent } from "react";
import type {
	ContentCapability,
	ContentEditorMode,
	ContentFeature,
	ContentFileHandler,
	ContentSlashItem,
	ContentToolbarItem,
} from "#/content-editor/features/feature-definition.tsx";
import {
	type ContentReaderRegistry,
	createContentReaderRegistry,
} from "#/content-editor/features/reader-registry.ts";
import { SingleLinePlugin } from "#/content-editor/lib/single-line-plugin.ts";

export interface ContentRegistry {
	readonly features: ReadonlyArray<ContentFeature>;
	readonly featureFor: (key: string) => ContentFeature | undefined;
	readonly mode: ContentEditorMode;
	readonly plugins: ReadonlyArray<AnyPlatePlugin>;
	readonly components: Readonly<
		Record<string, FunctionComponent<PlateElementProps>>
	>;
	readonly toolbarItems: (
		capabilities: ReadonlySet<ContentCapability>,
	) => ReadonlyArray<ContentToolbarItem>;
	readonly floatingItems: (
		capabilities: ReadonlySet<ContentCapability>,
	) => ReadonlyArray<ContentToolbarItem>;
	readonly slashItems: (
		capabilities: ReadonlySet<ContentCapability>,
	) => ReadonlyArray<ContentSlashItem>;
	readonly fileHandlers: (
		capabilities: ReadonlySet<ContentCapability>,
	) => ReadonlyArray<ContentFileHandler>;
	readonly reader: ContentReaderRegistry;
}

function allowedIn(feature: ContentFeature, mode: ContentEditorMode): boolean {
	if (feature.allowIn !== undefined) {
		return feature.allowIn(mode);
	}
	// A feature that declares block nodes is for block editors; marks, links
	// and behaviours travel everywhere.
	const declaresBlocks = (feature.nodes ?? []).some(
		(node) => node.kind !== "inline",
	);
	return mode === "block" || !declaresBlocks;
}

function available(
	feature: ContentFeature,
	capabilities: ReadonlySet<ContentCapability>,
): boolean {
	return (feature.requires ?? []).every((capability) =>
		capabilities.has(capability),
	);
}

/**
 * The one place a feature list becomes an editor. The reader registry is
 * built first (it is what validates keys and node types), then every feature
 * still allowed in this mode contributes its plugins in declaration order.
 * Autoformat rules are pooled into one plugin because Plate keys plugins by
 * name and a second AutoformatPlugin would replace the first.
 */
export function createContentRegistry(
	features: ReadonlyArray<ContentFeature>,
	options: { readonly mode?: ContentEditorMode } = {},
): ContentRegistry {
	const mode = options.mode ?? "block";
	const reader = createContentReaderRegistry(features);
	const active = features.filter((feature) => allowedIn(feature, mode));
	const context = { mode, indentableTypes: reader.indentableTypes };

	// A node a feature declares without a plugin of its own gets the plugin
	// its reader describes: an element, void or inline as the kind says. A
	// host feature that only renders and inserts then works without touching
	// Plate.
	const plugins: AnyPlatePlugin[] = active.flatMap((feature) => {
		const declared = [...feature.plugins(context)];
		const keys = new Set(declared.map((plugin) => plugin.key));
		const derived = (feature.nodes ?? [])
			.filter((node) => !keys.has(node.type))
			.map((node) =>
				createPlatePlugin({
					key: node.type,
					node: {
						isElement: true,
						isVoid: node.kind === "void",
						isInline: node.kind === "inline",
					},
				}),
			);
		return [...declared, ...derived];
	});
	if (mode === "single-line") {
		plugins.push(SingleLinePlugin);
	}

	const components = Object.assign(
		{},
		...active.map((feature) => feature.components ?? {}),
	) as Readonly<Record<string, FunctionComponent<PlateElementProps>>>;

	const items =
		<Item>(
			pick: (feature: ContentFeature) => ReadonlyArray<Item> | undefined,
		) =>
		(capabilities: ReadonlySet<ContentCapability>) =>
			active
				.filter((feature) => available(feature, capabilities))
				.flatMap((feature) => pick(feature) ?? []);

	return {
		features,
		featureFor: (key) => features.find((feature) => feature.key === key),
		mode,
		plugins,
		components,
		toolbarItems: items((feature) => feature.toolbar),
		floatingItems: items((feature) => feature.floating),
		slashItems: items((feature) => feature.slash),
		fileHandlers: items((feature) => (feature.files ? [feature.files] : [])),
		reader,
	};
}

export function toContentRegistry(
	features: ReadonlyArray<ContentFeature> | ContentRegistry,
	mode: ContentEditorMode,
): ContentRegistry {
	return Array.isArray(features)
		? createContentRegistry(features, { mode })
		: (features as ContentRegistry);
}
