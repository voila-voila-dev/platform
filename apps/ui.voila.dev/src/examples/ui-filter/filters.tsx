import {
	type ColumnDef,
	DataTable,
} from "@voila.dev/ui-datatable/components/data-table";
import { FilterBar } from "@voila.dev/ui-filter/components/filter-bar";
import { FilterChips } from "@voila.dev/ui-filter/components/filter-chips";
import { FilterForm } from "@voila.dev/ui-filter/components/filter-form";
import { FilterTrigger } from "@voila.dev/ui-filter/components/filter-trigger";
import type {
	FilterDefinition,
	FilterValues,
	PlaceSuggestion,
} from "@voila.dev/ui-filter/types";
import { defaultFilterLabels } from "@voila.dev/ui-filter/types";
import { RadiusMap } from "@voila.dev/ui-map/components/radius-map";
import { useMemo, useState } from "react";

const STATUS = {
	kind: "select",
	key: "status",
	label: "Status",
	multiple: true,
	allowExclusion: true,
	options: [
		{ value: "sent", label: "Sent" },
		{ value: "failed", label: "Failed" },
		{ value: "bounced", label: "Bounced" },
	],
} as const satisfies FilterDefinition;

const RECIPIENT = {
	kind: "text",
	key: "recipient",
	label: "Recipient",
	placeholder: "name@example.com",
	allowExclusion: true,
} as const satisfies FilterDefinition;

const SENT_AT = {
	kind: "dateRange",
	key: "sentAt",
	label: "Sent",
} as const satisfies FilterDefinition;

const PRICE = {
	kind: "moneyRange",
	key: "price",
	label: "Price",
	currency: "EUR",
} as const satisfies FilterDefinition;

const ATTEMPTS = {
	kind: "number",
	key: "attempts",
	label: "Attempts",
} as const satisfies FilterDefinition;

const OPENED = {
	kind: "boolean",
	key: "opened",
	label: "Opened",
	trueLabel: "Opened",
	falseLabel: "Not opened",
} as const satisfies FilterDefinition;

const TOWNS: ReadonlyArray<PlaceSuggestion> = [
	{ id: "nantes", label: "Nantes", latitude: 47.2184, longitude: -1.5536 },
	{ id: "paris", label: "Paris", latitude: 48.8566, longitude: 2.3522 },
	{ id: "lyon", label: "Lyon", latitude: 45.764, longitude: 4.8357 },
];

const AREA = {
	kind: "geoRadius",
	key: "area",
	label: "Area",
	searchPlaces: async (query: string) =>
		TOWNS.filter((town) =>
			town.label.toLowerCase().includes(query.trim().toLowerCase()),
		),
	defaultKm: 30,
} as const satisfies FilterDefinition;

/** One `FilterForm` with a single definition, for the per-field pages. */
function Field({ definition }: { readonly definition: FilterDefinition }) {
	const [values, setValues] = useState<FilterValues>({});
	return (
		<div className="w-full max-w-md">
			<FilterForm
				definitions={[definition]}
				values={values}
				onValuesChange={setValues}
				labels={defaultFilterLabels}
				locale="en-US"
			/>
		</div>
	);
}

export const TextField = () => <Field definition={RECIPIENT} />;
export const SelectField = () => <Field definition={STATUS} />;
export const NumberField = () => <Field definition={ATTEMPTS} />;
export const MoneyRangeField = () => <Field definition={PRICE} />;
export const DateRangeField = () => <Field definition={SENT_AT} />;
export const BooleanField = () => <Field definition={OPENED} />;
export const GeoRadiusField = () => <Field definition={AREA} />;

const ALL = [RECIPIENT, STATUS, SENT_AT, PRICE, OPENED];

export function Bar() {
	const [values, setValues] = useState<FilterValues>({});
	const [search, setSearch] = useState("");
	return (
		<div className="w-full">
			<FilterBar
				definitions={ALL}
				values={values}
				onValuesChange={setValues}
				searchValue={search}
				onSearchChange={setSearch}
				resultCount={128}
			/>
		</div>
	);
}

export function Form() {
	const [values, setValues] = useState<FilterValues>({});
	return (
		<div className="w-full max-w-md">
			<FilterForm
				definitions={ALL}
				values={values}
				onValuesChange={setValues}
				labels={defaultFilterLabels}
				locale="en-US"
			/>
		</div>
	);
}

export function Chips() {
	const [values, setValues] = useState<FilterValues>({
		status: { kind: "select", values: ["failed"] },
		recipient: { kind: "text", text: "name@example.com" },
	});
	return (
		<div className="w-full">
			<FilterChips
				definitions={ALL}
				values={values}
				onValuesChange={setValues}
				labels={defaultFilterLabels}
				locale="en-US"
			/>
		</div>
	);
}

export function Trigger() {
	return (
		<div className="w-full max-w-md">
			<FilterTrigger
				summary="name@example.com"
				activeCount={2}
				labels={defaultFilterLabels}
				onClick={() => {}}
			/>
		</div>
	);
}

// --- The end-to-end listing recipe: filters + datatable + map -------------

interface Mission {
	readonly reference: string;
	readonly club: string;
	readonly specialty: "physio" | "osteopath" | "nurse";
	/** Day rate in minor units (cents), the platform's money representation. */
	readonly rate: number;
	readonly city: string;
	readonly latitude: number;
	readonly longitude: number;
}

const MISSIONS: ReadonlyArray<Mission> = [
	{
		reference: "MIS-001",
		club: "Riverside Rugby",
		specialty: "physio",
		rate: 18_000,
		city: "Nantes",
		latitude: 47.2184,
		longitude: -1.5536,
	},
	{
		reference: "MIS-002",
		club: "Northgate FC",
		specialty: "osteopath",
		rate: 24_000,
		city: "Saint-Herblain",
		latitude: 47.2122,
		longitude: -1.6496,
	},
	{
		reference: "MIS-003",
		club: "Harbour Athletics",
		specialty: "nurse",
		rate: 15_000,
		city: "Paris",
		latitude: 48.8566,
		longitude: 2.3522,
	},
	{
		reference: "MIS-004",
		club: "Eastfield United",
		specialty: "physio",
		rate: 21_000,
		city: "Boulogne-Billancourt",
		latitude: 48.8397,
		longitude: 2.2399,
	},
	{
		reference: "MIS-005",
		club: "Southbank Swim",
		specialty: "osteopath",
		rate: 32_000,
		city: "Lyon",
		latitude: 45.764,
		longitude: 4.8357,
	},
	{
		reference: "MIS-006",
		club: "Westgate Handball",
		specialty: "physio",
		rate: 17_000,
		city: "Villeurbanne",
		latitude: 45.7719,
		longitude: 4.8902,
	},
];

const SPECIALTY = {
	kind: "select",
	key: "specialty",
	label: "Specialty",
	multiple: true,
	options: [
		{ value: "physio", label: "Physiotherapist" },
		{ value: "osteopath", label: "Osteopath" },
		{ value: "nurse", label: "Nurse" },
	],
} as const satisfies FilterDefinition;

const RATE = {
	kind: "moneyRange",
	key: "rate",
	label: "Day rate",
	currency: "EUR",
} as const satisfies FilterDefinition;

const LISTING_DEFINITIONS = [SPECIALTY, RATE, AREA];

const SPECIALTY_LABEL: Record<Mission["specialty"], string> = {
	physio: "Physiotherapist",
	osteopath: "Osteopath",
	nurse: "Nurse",
};

const MISSION_COLUMNS: ColumnDef<Mission>[] = [
	{ accessorKey: "reference", header: "Reference", size: 110 },
	{ accessorKey: "club", header: "Club" },
	{
		accessorKey: "specialty",
		header: "Specialty",
		cell: ({ row }) => SPECIALTY_LABEL[row.original.specialty],
	},
	{ accessorKey: "city", header: "City" },
	{
		accessorKey: "rate",
		header: "Day rate",
		size: 110,
		cell: ({ row }) => `€${row.original.rate / 100}`,
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

function matchesMission(
	mission: Mission,
	values: FilterValues,
	search: string,
): boolean {
	const query = search.trim().toLowerCase();
	if (
		query &&
		!`${mission.club} ${mission.city}`.toLowerCase().includes(query)
	) {
		return false;
	}
	const specialty = values.specialty;
	if (specialty?.kind === "select" && specialty.values.length > 0) {
		const included = specialty.values.includes(mission.specialty);
		if (specialty.excluded ? included : !included) {
			return false;
		}
	}
	const rate = values.rate;
	if (rate?.kind === "moneyRange") {
		if (rate.min !== undefined && mission.rate < rate.min) {
			return false;
		}
		if (rate.max !== undefined && mission.rate > rate.max) {
			return false;
		}
	}
	const area = values.area;
	if (
		area?.kind === "geoRadius" &&
		distanceKm(area.place, mission) > area.radiusKm
	) {
		return false;
	}
	return true;
}

/** The whole listing screen: one `FilterValues` record drives all three views. */
export function Listing() {
	const [values, setValues] = useState<FilterValues>({});
	const [search, setSearch] = useState("");
	const missions = useMemo(
		() =>
			MISSIONS.filter((mission) => matchesMission(mission, values, search)),
		[values, search],
	);
	const area = values.area;
	return (
		<div className="flex w-full flex-col gap-4">
			<FilterBar
				definitions={LISTING_DEFINITIONS}
				values={values}
				onValuesChange={setValues}
				searchValue={search}
				onSearchChange={setSearch}
				resultCount={missions.length}
			/>
			<DataTable columns={MISSION_COLUMNS} data={missions} />
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
