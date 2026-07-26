import { ColumnsIcon } from "@phosphor-icons/react";
import type { Table as TanstackTable } from "@tanstack/react-table";
import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";

interface Props<TData> extends React.ComponentProps<typeof Button> {
	table: TanstackTable<TData>;
	label?: string;
}

/**
 * Column visibility menu. Every hideable column gets a checkbox; the table owns
 * the state unless `columnVisibility` is passed to `DataTable`.
 */
export function DataTableViewOptions<TData>({
	table,
	label = "Columns",
	...props
}: Props<TData>) {
	const columns = table
		.getAllLeafColumns()
		.filter((column) => column.getCanHide());
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				render={
					<Button
						variant="outline"
						size="sm"
						data-slot="data-table-view-options"
						{...props}
					>
						<ColumnsIcon />
						{label}
					</Button>
				}
			/>
			<DropdownMenu.Content align="end" className="w-48">
				<DropdownMenu.Label>{label}</DropdownMenu.Label>
				<DropdownMenu.Separator />
				{columns.map((column) => (
					<DropdownMenu.CheckboxItem
						key={column.id}
						checked={column.getIsVisible()}
						onCheckedChange={(checked) => column.toggleVisibility(checked)}
					>
						{typeof column.columnDef.header === "string"
							? column.columnDef.header
							: column.id}
					</DropdownMenu.CheckboxItem>
				))}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
