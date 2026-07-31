import { DataTable } from "@voila.dev/ui/data-table";
import { useState } from "react";
import { columns, PROJECTS } from "./fixtures";

export function GlobalFilter() {
	const [search, setSearch] = useState("des");
	return (
		<div className="w-full">
			<DataTable.Root
				columns={columns}
				data={PROJECTS}
				globalFilter={search}
				toolbar={
					<DataTable.Toolbar>
						<DataTable.Search
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search projects"
						/>
					</DataTable.Toolbar>
				}
			/>
		</div>
	);
}
