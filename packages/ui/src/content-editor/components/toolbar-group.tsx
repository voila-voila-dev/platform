import type { ReactNode } from "react";
import { ContentEditorToolbarItem } from "#/content-editor/components/toolbar-item.tsx";
import type { ContentToolbarItem } from "#/content-editor/features/feature-definition.tsx";
import { cn } from "#/lib/utils.ts";

interface Props {
	/** Registry items to render; or compose children by hand. */
	items?: ReadonlyArray<ContentToolbarItem>;
	size?: "default" | "sm";
	className?: string;
	children?: ReactNode;
}

/** A run of related controls, separated from the next group by a hairline. */
export function ContentEditorToolbarGroup({
	items = [],
	size,
	className,
	children,
}: Props) {
	return (
		<div
			data-slot="content-editor-toolbar-group"
			className={cn(
				// The hairline leads each group rather than trailing it, and a group whose
				// items are all hidden (the table controls outside a table) hides with
				// them: a row never ends on a stray separator.
				"flex shrink-0 items-center gap-0.5 empty:hidden not-first:border-l not-first:border-border not-first:pl-1",
				className,
			)}
		>
			{items.map((item) => (
				<ContentEditorToolbarItem key={item.key} item={item} size={size} />
			))}
			{children}
		</div>
	);
}
