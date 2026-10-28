import {
	defaultFilterLabels,
	Filter,
	type FilterDefinition,
	type FilterValues,
	type PlaceSuggestion,
} from "@voila.dev/ui/filter";
import { useState } from "react";

export const STATUS = {
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

export const RECIPIENT = {
	kind: "text",
	key: "recipient",
	label: "Recipient",
	placeholder: "name@example.com",
	allowExclusion: true,
} as const satisfies FilterDefinition;

export const SENT_AT = {
	kind: "dateRange",
	key: "sentAt",
	label: "Sent",
} as const satisfies FilterDefinition;

export const PRICE = {
	kind: "moneyRange",
	key: "price",
	label: "Price",
	currency: "USD",
} as const satisfies FilterDefinition;

export const OPENED = {
	kind: "boolean",
	key: "opened",
	label: "Opened",
	trueLabel: "Opened",
	falseLabel: "Not opened",
} as const satisfies FilterDefinition;

export const TOWNS: ReadonlyArray<PlaceSuggestion> = [
	{ id: "nantes", label: "Nantes", latitude: 47.2184, longitude: -1.5536 },
	{ id: "paris", label: "Paris", latitude: 48.8566, longitude: 2.3522 },
	{ id: "lyon", label: "Lyon", latitude: 45.764, longitude: 4.8357 },
];

export const AREA = {
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
export function Field({
	definition,
}: {
	readonly definition: FilterDefinition;
}) {
	const [values, setValues] = useState<FilterValues>({});
	return (
		<div className="w-full max-w-md">
			<Filter.Form
				definitions={[definition]}
				values={values}
				onValuesChange={setValues}
				labels={defaultFilterLabels}
				locale="en-US"
			/>
		</div>
	);
}

export const ALL = [RECIPIENT, STATUS, SENT_AT, PRICE, OPENED];
