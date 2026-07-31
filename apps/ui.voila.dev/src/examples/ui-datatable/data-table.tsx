import { DataTable } from "@voila.dev/ui/data-table";
import { columns, PROJECTS } from "./fixtures";

export function Default() {
	return (
		<div className="w-full">
			<DataTable.Root columns={columns} data={PROJECTS} />
		</div>
	);
}
