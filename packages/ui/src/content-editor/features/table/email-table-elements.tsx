import {
	PlateElement,
	type PlateElementProps,
	useElement,
} from "platejs/react";
import { useContentEditorTheme } from "#/content-editor/context/theme-context.ts";
import { emailTableBarItems } from "#/content-editor/features/table/email-table.ts";
import type { ContentTableNode } from "#/content-editor/features/table/reader.tsx";
import { TableToolbar } from "#/content-editor/features/table/table-toolbar.tsx";
import { cn } from "#/lib/utils.ts";

/**
 * The email block editor's table view, editable: header rules, row
 * separators and per-column alignment, as the email's `emailLineItemsTable`
 * draws them.
 */
export function EmailTableElement({ children, ...props }: PlateElementProps) {
	const theme = useContentEditorTheme();
	return (
		<PlateElement {...props} className="py-1">
			<TableToolbar element={props.element} items={emailTableBarItems} />
			<table
				className="w-full border-collapse"
				style={{ fontFamily: theme.font }}
			>
				<tbody>{children}</tbody>
			</table>
		</PlateElement>
	);
}

export function EmailTableRowElement(props: PlateElementProps) {
	return <PlateElement {...props} as="tr" />;
}

function emailCellElement(header: boolean) {
	return function EmailCellElement({ children, ...props }: PlateElementProps) {
		const theme = useContentEditorTheme();
		const table = useElement("table") as unknown as ContentTableNode;
		const column = props.path.at(-1) ?? 0;
		const width = table.columns?.length ?? 1;
		const align = table.columns?.[column]?.align ?? "left";
		return (
			<PlateElement
				{...props}
				as={header ? "th" : "td"}
				className={cn(
					"py-2 align-top font-normal",
					column === 0 ? "pl-0" : "pl-[10px]",
					column === width - 1 ? "pr-0" : "pr-[10px]",
				)}
				style={{
					borderBottom: `${header ? 2 : 1}px solid ${theme.color.border}`,
					textAlign: align,
				}}
			>
				<div
					className={cn(
						"min-h-5",
						header
							? "font-semibold text-[11px] uppercase leading-[1.3] tracking-[0.04em]"
							: "text-[14px] leading-[1.4]",
					)}
					style={{ color: header ? theme.color.muted : theme.color.ink }}
				>
					{children}
				</div>
			</PlateElement>
		);
	};
}

export const EmailTableCellElement = emailCellElement(false);
export const EmailTableHeaderCellElement = emailCellElement(true);
