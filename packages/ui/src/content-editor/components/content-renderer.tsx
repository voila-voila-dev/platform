import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { Fragment, type ReactNode, useMemo } from "react";
import {
	type ContentDescendant,
	type ContentNodeLike,
	type ContentValue,
	isContentText,
} from "#/content-editor/features/content-value.ts";
import type {
	ContentFeatureReader,
	ContentHtmlOptions,
} from "#/content-editor/features/reader-definition.tsx";
import type { ContentReaderRegistry } from "#/content-editor/features/reader-registry.ts";
import {
	groupSiblings,
	renderedChildren,
	toReaderRegistry,
} from "#/content-editor/reader/content-to-html.ts";
import { cn } from "#/lib/utils.ts";

function renderLeaf(
	registry: ContentReaderRegistry,
	leaf: { readonly text: string; readonly [mark: string]: unknown },
	key: number,
): ReactNode {
	const lines = leaf.text.split("\n");
	let content: ReactNode = lines.map((line, index) => (
		<Fragment key={index}>
			{index > 0 ? <br /> : null}
			{line}
		</Fragment>
	));
	for (const decorator of [...registry.leaves].reverse()) {
		if (leaf[decorator.key] === true) {
			content = <decorator.Render>{content}</decorator.Render>;
		}
	}
	return <Fragment key={key}>{content}</Fragment>;
}

function renderGroups(
	registry: ContentReaderRegistry,
	siblings: ReadonlyArray<ContentDescendant>,
	options: ContentHtmlOptions,
): ReactNode[] {
	let position = 0;
	return groupSiblings(registry, siblings).map((group) => {
		const start = position;
		if (group.kind === "single") {
			position += 1;
			return isContentText(group.node)
				? renderLeaf(registry, group.node, start)
				: renderNode(registry, group.node, options, start);
		}
		position += group.nodes.length;
		const [first] = group.nodes;
		return (
			<group.reader.wrapRun.Render
				key={`run-${start}`}
				runKey={group.runKey}
				first={first}
				options={options}
			>
				{group.nodes.map((node, index) =>
					renderNode(registry, node, options, start + index),
				)}
			</group.reader.wrapRun.Render>
		);
	});
}

function renderNode(
	registry: ContentReaderRegistry,
	node: ContentNodeLike,
	options: ContentHtmlOptions,
	key: number | string,
): ReactNode {
	const reader = registry.nodeFor(node.type);
	if (reader === undefined) {
		return null;
	}
	return (
		<reader.Render
			key={(node.id as string | undefined) ?? key}
			node={node}
			options={options}
		>
			{renderGroups(registry, renderedChildren(reader, node), options)}
		</reader.Render>
	);
}

interface Props extends useRender.ComponentProps<"div"> {
	value: ContentValue | null;
	features: ReadonlyArray<ContentFeatureReader> | ContentReaderRegistry;
	options?: ContentHtmlOptions;
}

/** Stored content rendered for a reader, outside any editor. */
export function ContentRenderer({
	value,
	features,
	options = {},
	className,
	render,
	...props
}: Props) {
	const registry = useMemo(() => toReaderRegistry(features), [features]);
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: options.unstyled
					? className
					: cn("flex flex-col gap-3", className),
				children:
					value === null ? null : renderGroups(registry, value, options),
			},
			props,
		),
		render,
		state: { slot: "content-renderer" },
	});
}
