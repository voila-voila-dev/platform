import { DataTable, dataTableSelectionColumn } from "@voila.dev/ui/data-table";
import { columns, PROJECTS, type Project } from "./fixtures";

export function Selection() {
	return (
		<div className="w-full">
			<DataTable.Root
				columns={[
					dataTableSelectionColumn<Project>({
						selectAllLabel: "Select all projects",
						selectRowLabel: (project) => `Select ${project.reference}`,
					}),
					...columns,
				]}
				data={PROJECTS}
				enableRowSelection
				getRowId={(project) => project.reference}
			/>
		</div>
	);
}
