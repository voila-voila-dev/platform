import { DataTable } from "@voila.dev/ui/data-table";
import { columns, PROJECTS } from "./fixtures";

export function Pinning() {
	return (
		// Narrow on purpose: pinning only shows itself once the table has to pan.
		<div className="w-full max-w-md">
			<DataTable.Root
				columns={columns}
				data={PROJECTS}
				columnPinning={{ left: ["reference"], right: ["amount"] }}
			/>
		</div>
	);
}
