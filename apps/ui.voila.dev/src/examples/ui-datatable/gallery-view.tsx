import { CardGallery } from "@voila.dev/ui/card-gallery";
import {
	type ColumnDef,
	DataTable,
	type DataTableView,
} from "@voila.dev/ui/data-table";
import { useState } from "react";

interface Organization {
	name: string;
	category: string;
	logo?: string;
}

function logo(initials: string, background: string) {
	return `data:image/svg+xml;utf8,${encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="20" fill="${background}"/><text x="48" y="61" font-family="system-ui, sans-serif" font-size="34" font-weight="600" fill="#fff" text-anchor="middle">${initials}</text></svg>`,
	)}`;
}

const ORGANIZATIONS: Organization[] = [
	{
		name: "Riverside Studio",
		category: "Design studio",
		logo: logo("RS", "#0e7490"),
	},
	{
		name: "Northgate Labs",
		category: "Research",
		logo: logo("NL", "#7c3aed"),
	},
	{
		name: "Harbour Media",
		category: "Media production",
		logo: logo("HM", "#ea580c"),
	},
	{
		name: "Eastfield Group",
		category: "Consulting",
		logo: logo("EG", "#16a34a"),
	},
	{
		name: "Southbank Digital",
		category: "Software",
		logo: logo("SD", "#2563eb"),
	},
	{ name: "Old Town Press", category: "Publishing" },
	{
		name: "Westside Ventures",
		category: "Finance",
		logo: logo("WV", "#ca8a04"),
	},
	{
		name: "Lakeside Health",
		category: "Healthcare",
		logo: logo("LH", "#dc2626"),
	},
];

const columns: ColumnDef<Organization>[] = [
	{ accessorKey: "name", header: "Name" },
	{ accessorKey: "category", header: "Category" },
];

export function GalleryView() {
	const [view, setView] = useState<DataTableView>("gallery");
	const [search, setSearch] = useState("");
	return (
		<div className="w-full">
			<DataTable.Root
				columns={columns}
				data={ORGANIZATIONS}
				globalFilter={search}
				view={view}
				renderGalleryCard={(organization) => (
					<>
						<CardGallery.Logo src={organization.logo}>
							{organization.name.charAt(0)}
						</CardGallery.Logo>
						<CardGallery.Title>{organization.name}</CardGallery.Title>
						<CardGallery.Description>
							{organization.category}
						</CardGallery.Description>
					</>
				)}
				toolbar={
					<DataTable.Toolbar>
						<DataTable.Search
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search organizations"
						/>
						<DataTable.Actions>
							<DataTable.ViewToggle view={view} onViewChange={setView} />
						</DataTable.Actions>
					</DataTable.Toolbar>
				}
			/>
		</div>
	);
}
