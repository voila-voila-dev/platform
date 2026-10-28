import { DataTable } from "@voila.dev/ui/data-table";
import { columns, PROJECTS } from "./fixtures";

export function Export() {
	return (
		<div className="w-full">
			<DataTable.Root
				columns={columns}
				data={PROJECTS}
				toolbar={(table) => (
					<DataTable.Toolbar>
						<DataTable.Actions>
							<DataTable.Export table={table} filename="projects.csv" />
						</DataTable.Actions>
					</DataTable.Toolbar>
				)}
			/>
		</div>
	);
}
