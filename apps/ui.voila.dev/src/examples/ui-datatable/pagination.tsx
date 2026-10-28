import { DataTable } from "@voila.dev/ui/data-table";
import { useState } from "react";
import { columns, PROJECTS } from "./fixtures";

export function Pagination() {
	const [page, setPage] = useState(0);
	return (
		<div className="w-full">
			<DataTable.Root
				columns={columns}
				data={PROJECTS.slice(page * 2, page * 2 + 2)}
				pagination={{
					page,
					pageSize: 2,
					total: PROJECTS.length,
					onPageChange: setPage,
				}}
			/>
		</div>
	);
}
