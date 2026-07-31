import { DataTable, dataTableSelectionColumn } from "@voila.dev/ui/data-table";
import { useState } from "react";
import { columns, PROJECTS, type Project } from "./fixtures";

export function Hero() {
	const [search, setSearch] = useState("");
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
				globalFilter={search}
				toolbar={(table) => (
					<DataTable.Toolbar>
						<DataTable.Search
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search projects"
						/>
						<DataTable.Actions>
							<DataTable.ViewOptions table={table} />
							<DataTable.Export table={table} filename="projects.csv" />
						</DataTable.Actions>
					</DataTable.Toolbar>
				)}
			/>
		</div>
	);
}
