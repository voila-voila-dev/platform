import { DataTable } from "@voila.dev/ui/data-table";
import { columns, PROJECTS } from "./fixtures";

export function Expansion() {
	return (
		<div className="w-full">
			<DataTable.Root
				columns={columns}
				data={PROJECTS}
				renderExpandedRow={(project) => (
					<dl className="grid gap-1 text-sm sm:grid-cols-2">
						<div>
							<dt className="inline text-muted-foreground">Client: </dt>
							<dd className="inline">{project.client}</dd>
						</div>
						<div>
							<dt className="inline text-muted-foreground">Role: </dt>
							<dd className="inline">{project.role}</dd>
						</div>
					</dl>
				)}
			/>
		</div>
	);
}
