import type { ReactNode } from "react";
import { ContentEditorToolbarGroup } from "#/content-editor/components/toolbar-group.tsx";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import type {
	ContentToolbarGroup,
	ContentToolbarItem,
} from "#/content-editor/features/feature-definition.tsx";
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
	/** Compose groups by hand; without children every registry item is shown. */
	children?: ReactNode;
}

export function ContentEditorToolbar({ className, children }: Props) {
	const { registry, capabilities, labels } = useContentEditorConfig();
	return (
		<div
			data-slot="content-editor-toolbar"
			role="toolbar"
			aria-label={labels.chrome.editor}
			className={cn("flex flex-wrap items-center gap-1", className)}
		>
			{children ??
				groupToolbarItems(registry.toolbarItems(capabilities)).map((bucket) => (
					<ContentEditorToolbarGroup key={bucket.group} items={bucket.items} />
				))}
		</div>
	);
}
ContentEditorToolbar.slot = "toolbar" as const;
