import { PlusIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { ContentEditorToolbarGroup } from "#/content-editor/components/toolbar-group.tsx";
import { ContentEditorToolbarMenu } from "#/content-editor/components/toolbar-menu.tsx";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import type {
	ContentToolbarGroup,
	ContentToolbarItem,
} from "#/content-editor/features/feature-definition.tsx";
import type { ContentEditorLabels } from "#/content-editor/labels.ts";
import { cn } from "#/lib/utils.ts";

const GROUP_ORDER: ReadonlyArray<ContentToolbarGroup> = [
	"history",
	"text",
	"block",
	"list",
	"insert",
	"table",
];

/** The registry's items, bucketed by group in the order the toolbar shows them. */
export function groupToolbarItems(
	items: ReadonlyArray<ContentToolbarItem>,
): ReadonlyArray<{
	readonly group: ContentToolbarGroup;
	readonly items: ReadonlyArray<ContentToolbarItem>;
}> {
	return GROUP_ORDER.map((group) => ({
		group,
		items: items.filter((item) => item.group === group),
	})).filter((bucket) => bucket.items.length > 0);
}

interface Props {
	className?: string;
	/**
	 * `compact` (the default) is one row of the everyday controls: the block
	 * type as a menu, the marks, the lists, everything insertable under one
	 * « Insert » menu; undo, redo and indent stay on their keys. `full` lays
	 * every item out as its own control, grouped.
	 */
	variant?: "compact" | "full";
	/**
	 * Wrap the groups onto several rows instead of scrolling one row sideways.
	 * Off by default: on a phone, wrapped groups leave a ragged block of
	 * rows and hairlines above the document, while one row scrolls the way
	 * a phone keyboard bar does.
	 */
	wrap?: boolean;
	/** Compose groups by hand; without children every registry item is shown. */
	children?: ReactNode;
}

function CompactToolbar({
	items,
	labels,
}: {
	readonly items: ReadonlyArray<ContentToolbarItem>;
	readonly labels: ContentEditorLabels;
}) {
	const of = (group: ContentToolbarGroup) =>
		items.filter((item) => item.group === group && item.secondary !== true);
	const block = of("block");
	const insert = of("insert");
	return (
		<>
			{block.length > 0 ? (
				<ContentEditorToolbarGroup>
					<ContentEditorToolbarMenu items={block} trigger="active" />
				</ContentEditorToolbarGroup>
			) : null}
			<ContentEditorToolbarGroup items={of("text")} />
			<ContentEditorToolbarGroup items={of("list")} />
			{insert.length > 0 ? (
				<ContentEditorToolbarGroup>
					<ContentEditorToolbarMenu
						items={insert}
						trigger={{ label: labels.chrome.insert, icon: PlusIcon }}
					/>
				</ContentEditorToolbarGroup>
			) : null}
			<ContentEditorToolbarGroup items={of("table")} />
		</>
	);
}

export function ContentEditorToolbar({
	className,
	variant = "compact",
	wrap = false,
	children,
}: Props) {
	const { registry, capabilities, labels } = useContentEditorConfig();
	const items = registry.toolbarItems(capabilities);
	return (
		<div
			data-slot="content-editor-toolbar"
			role="toolbar"
			aria-label={labels.chrome.editor}
			className={cn(
				"flex items-center gap-1",
				wrap
					? "flex-wrap"
					: "min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				className,
			)}
		>
			{children ??
				(variant === "compact" ? (
					<CompactToolbar items={items} labels={labels} />
				) : (
					groupToolbarItems(items).map((bucket) => (
						<ContentEditorToolbarGroup
							key={bucket.group}
							items={bucket.items}
						/>
					))
				))}
		</div>
	);
}
ContentEditorToolbar.slot = "toolbar" as const;
