import { type ColumnDef, DataTable } from "@voila.dev/ui/data-table";
import {
	Filter,
	type FilterDefinition,
	type FilterValues,
} from "@voila.dev/ui/filter";
import { RadiusMap } from "@voila.dev/ui/radius-map";
import { useMemo, useState } from "react";
import { AREA } from "./fixtures";

interface Project {
	readonly reference: string;
	readonly client: string;
	readonly role: "designer" | "developer" | "writer";
	/** Day rate in minor units (cents), the platform's money representation. */
	readonly rate: number;
	readonly city: string;
	readonly latitude: number;
	readonly longitude: number;
}

const PROJECTS: ReadonlyArray<Project> = [
	{
		reference: "PRJ-001",
		client: "Riverside Studio",
		role: "designer",
		rate: 18_000,
		city: "Nantes",
		latitude: 47.2184,
		longitude: -1.5536,
	},
	{
		reference: "PRJ-002",
		client: "Northgate Labs",
		role: "developer",
		rate: 24_000,
		city: "Saint-Herblain",
		latitude: 47.2122,
		longitude: -1.6496,
	},
	{
		reference: "PRJ-003",
		client: "Harbour Media",
		role: "writer",
		rate: 15_000,
		city: "Paris",
		latitude: 48.8566,
		longitude: 2.3522,
	},
	{
		reference: "PRJ-004",
		client: "Eastfield Group",
		role: "designer",
		rate: 21_000,
		city: "Boulogne-Billancourt",
		latitude: 48.8397,
		longitude: 2.2399,
	},
	{
		reference: "PRJ-005",
		client: "Southbank Digital",
		role: "developer",
		rate: 32_000,
		city: "Lyon",
		latitude: 45.764,
		longitude: 4.8357,
	},
	{
		reference: "PRJ-006",
		client: "Westgate Ventures",
		role: "designer",
		rate: 17_000,
		city: "Villeurbanne",
		latitude: 45.7719,
		longitude: 4.8902,
	},
];

const ROLE = {
	kind: "select",
	key: "role",
	label: "Role",
	multiple: true,
	options: [
		{ value: "designer", label: "Designer" },
		{ value: "developer", label: "Developer" },
		{ value: "writer", label: "Copywriter" },
	],
} as const satisfies FilterDefinition;

const RATE = {
	kind: "moneyRange",
	key: "rate",
	label: "Day rate",
	currency: "USD",
} as const satisfies FilterDefinition;

const LISTING_DEFINITIONS = [ROLE, RATE, AREA];

const ROLE_LABEL: Record<Project["role"], string> = {
	designer: "Designer",
	developer: "Developer",
	writer: "Copywriter",
};

const PROJECT_COLUMNS: ColumnDef<Project>[] = [
	{ accessorKey: "reference", header: "Reference", size: 110 },
	{ accessorKey: "client", header: "Client" },
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => ROLE_LABEL[row.original.role],
	},
	{ accessorKey: "city", header: "City" },
	{
		accessorKey: "rate",
		header: "Day rate",
		size: 110,
		cell: ({ row }) => `$${row.original.rate / 100}`,
	},
];

function distanceKm(
	a: { readonly latitude: number; readonly longitude: number },
	b: { readonly latitude: number; readonly longitude: number },
): number {
	const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
	const dLat = toRadians(b.latitude - a.latitude);
	const dLng = toRadians(b.longitude - a.longitude);
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRadians(a.latitude)) *
			Math.cos(toRadians(b.latitude)) *
			Math.sin(dLng / 2) ** 2;
	return 2 * 6371 * Math.asin(Math.sqrt(h));
}

function matchesProject(
	project: Project,
	values: FilterValues,
	search: string,
): boolean {
	const query = search.trim().toLowerCase();
	if (
		query &&
		!`${project.client} ${project.city}`.toLowerCase().includes(query)
	) {
		return false;
	}
	const role = values.role;
	if (role?.kind === "select" && role.values.length > 0) {
		const included = role.values.includes(project.role);
		if (role.excluded ? included : !included) {
			return false;
		}
	}
	const rate = values.rate;
	if (rate?.kind === "moneyRange") {
		if (rate.min !== undefined && project.rate < rate.min) {
			return false;
		}
		if (rate.max !== undefined && project.rate > rate.max) {
			return false;
		}
	}
	const area = values.area;
	if (
		area?.kind === "geoRadius" &&
		distanceKm(area.place, project) > area.radiusKm
	) {
		return false;
	}
	return true;
}

/** The whole listing screen: one `FilterValues` record drives all three views. */
export function Listing() {
	const [values, setValues] = useState<FilterValues>({});
	const [search, setSearch] = useState("");
	const projects = useMemo(
		() => PROJECTS.filter((project) => matchesProject(project, values, search)),
		[values, search],
	);
	const area = values.area;
	return (
		<div className="flex w-full flex-col gap-4">
			<Filter.Root
				definitions={LISTING_DEFINITIONS}
				values={values}
				onValuesChange={setValues}
				searchValue={search}
				onSearchChange={setSearch}
				resultCount={projects.length}
			/>
			<DataTable.Root columns={PROJECT_COLUMNS} data={projects} />
			{area?.kind === "geoRadius" ? (
				<RadiusMap
					className="h-64 w-full overflow-hidden rounded-lg border"
					center={{
						latitude: area.place.latitude,
						longitude: area.place.longitude,
					}}
					radiusKm={area.radiusKm}
					unavailableFallback={
						<p className="p-6 text-muted-foreground text-sm">
							This browser has no WebGL, so the map cannot render.
						</p>
					}
				/>
			) : null}
		</div>
	);
}
