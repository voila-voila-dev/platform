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
				"flex items-center gap-0.5 not-last:border-r not-last:border-border not-last:pr-1",
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
