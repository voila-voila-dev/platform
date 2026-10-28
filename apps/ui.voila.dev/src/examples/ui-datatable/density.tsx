import { DataTable, type DataTableDensity } from "@voila.dev/ui/data-table";
import { useState } from "react";
import { columns, PROJECTS } from "./fixtures";

export function Density() {
	const [density, setDensity] = useState<DataTableDensity>("compact");
	return (
		<div className="w-full">
			<DataTable.Root
				columns={columns}
				data={PROJECTS}
				density={density}
				toolbar={
					<DataTable.Toolbar>
						<DataTable.Actions>
							<DataTable.DensityToggle
								density={density}
								onDensityChange={setDensity}
							/>
						</DataTable.Actions>
					</DataTable.Toolbar>
				}
			/>
		</div>
	);
}
