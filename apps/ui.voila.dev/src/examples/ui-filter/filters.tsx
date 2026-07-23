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
import { useState } from "react";

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
