import { DownloadSimpleIcon } from "@phosphor-icons/react";
import type { Table as TanstackTable } from "@tanstack/react-table";
import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { dataTableToCsv } from "#/data-table/lib/to-csv.ts";

interface Props<TData> extends React.ComponentProps<typeof Button> {
	table: TanstackTable<TData>;
	filename?: string;
	label?: string;
}

/** Downloads the current view as CSV. */
export function DataTableExport<TData>({
	table,
	filename = "export.csv",
	label = "Export",
	...props
}: Props<TData>) {
	const download = () => {
		const blob = new Blob([dataTableToCsv(table)], {
			type: "text/csv;charset=utf-8",
		});
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = filename;
		anchor.click();
		URL.revokeObjectURL(url);
	};
	return (
		<Button
			variant="outline"
			size="sm"
			data-slot="data-table-export"
			{...props}
			onClick={download}
		>
			<DownloadSimpleIcon />
			{label}
		</Button>
	);
}
