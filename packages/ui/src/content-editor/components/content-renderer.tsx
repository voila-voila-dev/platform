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
import { toReaderRegistry } from "#/content-editor/reader/content-to-html.ts";
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

function renderChildren(
	registry: ContentReaderRegistry,
	children: ReadonlyArray<ContentDescendant>,
	options: ContentHtmlOptions,
): ReactNode {
	return children.map((child, index) =>
		isContentText(child)
			? renderLeaf(registry, child, index)
			: renderNode(registry, child, options, index),
	);
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
			{renderChildren(registry, node.children, options)}
		</reader.Render>
	);
}

function renderBlocks(
	registry: ContentReaderRegistry,
	value: ContentValue,
	options: ContentHtmlOptions,
): ReactNode {
	const output: ReactNode[] = [];
	let index = 0;
	while (index < value.length) {
		const node = value[index] as ContentNodeLike;
		const reader = registry.nodeFor(node.type);
		const run = reader?.wrapRun?.of(node) ?? null;
		if (run === null || reader?.wrapRun === undefined) {
			output.push(renderNode(registry, node, options, index));
			index += 1;
			continue;
		}
		const items: ReactNode[] = [];
		const first = node;
		const start = index;
		while (index < value.length) {
			const candidate = value[index] as ContentNodeLike;
			if (
				candidate.type !== node.type ||
				reader.wrapRun.of(candidate) !== run
			) {
				break;
			}
			items.push(renderNode(registry, candidate, options, index));
			index += 1;
		}
		output.push(
			<reader.wrapRun.Render key={`run-${start}`} runKey={run} first={first}>
				{items}
			</reader.wrapRun.Render>,
		);
	}
	return output;
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
				className: cn("flex flex-col gap-3", className),
				children:
					value === null ? null : renderBlocks(registry, value, options),
			},
			props,
		),
		render,
		state: { slot: "content-renderer" },
	});
}
