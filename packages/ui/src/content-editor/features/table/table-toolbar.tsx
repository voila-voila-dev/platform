import { getTableEntries } from "@platejs/table";
import type { TElement } from "platejs";
import { useEditorRef, useEditorSelector } from "platejs/react";
import { ContentEditorToolbarItem } from "#/content-editor/components/toolbar-item.tsx";
import { tableBarItems } from "#/content-editor/features/table/table-actions.ts";

interface Props {
	element: TElement;
}

/**
 * The table's own actions, above the table while the selection is inside
 * it. They are the same items the toolbar menu carries, so a host that
 * composed a narrower toolbar, or none, still gets the whole table.
 */
export function TableToolbar({ element }: Props) {
	const editor = useEditorRef();
	const inside = useEditorSelector(
		(current) => {
			if (current.selection === null) {
				return false;
			}
			const entries = getTableEntries(current);
			return entries?.table[0] === element;
		},
		[element],
	);
	if (!inside || editor.dom.readOnly) {
		return null;
	}
	return (
		<div
			contentEditable={false}
			data-slot="content-editor-table-toolbar"
			className="mb-1 flex w-fit select-none flex-wrap items-center gap-0.5 rounded-md border border-border bg-popover p-0.5 text-popover-foreground shadow-sm"
		>
			{tableBarItems.map((item) => (
				<ContentEditorToolbarItem key={item.key} item={item} size="sm" />
			))}
		</div>
	);
}
