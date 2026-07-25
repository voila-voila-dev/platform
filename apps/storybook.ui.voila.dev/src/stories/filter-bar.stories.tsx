import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { FilterBar } from "@voila.dev/ui/filter/filter-bar";
import { FilterForm } from "@voila.dev/ui/filter/filter-form";
import type {
	FilterDefinition,
	FilterValues,
	PlaceSuggestion,
} from "@voila.dev/ui/filter/types";
import { defaultFilterLabels } from "@voila.dev/ui/filter/types";
import { useState } from "react";

// Stand-in for the app's geocoder: enough French towns to try the field.
const TOWNS: ReadonlyArray<PlaceSuggestion> = [
	{
		id: "nantes",
		label: "Nantes, Loire-Atlantique",
		latitude: 47.2184,
		longitude: -1.5536,
	},
	{
		id: "paris",
		label: "Paris, Île-de-France",
		latitude: 48.8566,
		longitude: 2.3522,
	},
	{ id: "lyon", label: "Lyon, Rhône", latitude: 45.764, longitude: 4.8357 },
	{
		id: "bordeaux",
		label: "Bordeaux, Gironde",
		latitude: 44.8378,
		longitude: -0.5792,
	},
	{
		id: "rennes",
		label: "Rennes, Ille-et-Vilaine",
		latitude: 48.1173,
		longitude: -1.6778,
	},
	{
		id: "guipry",
		label: "Guipry-Messac, Ille-et-Vilaine",
		latitude: 47.8236,
		longitude: -1.8447,
	},
];

const searchTowns = async (
	query: string,
): Promise<ReadonlyArray<PlaceSuggestion>> => {
	const normalized = query.trim().toLowerCase();
	return TOWNS.filter((town) => town.label.toLowerCase().includes(normalized));
};

const definitions: ReadonlyArray<FilterDefinition> = [
	{
		kind: "text",
		key: "recipient",
		label: "Recipient",
		placeholder: "name@example.com",
		allowExclusion: true,
	},
	{
		kind: "select",
		key: "status",
		label: "Status",
		multiple: true,
		allowExclusion: true,
		options: [
			{ value: "sent", label: "Sent" },
			{ value: "suppressed", label: "Suppressed" },
			{ value: "failed", label: "Failed" },
		],
	},
	{
		kind: "select",
		key: "skill",
		label: "Skill",
		description: "A long list gets its own search box.",
		multiple: true,
		options: [
			"Designer",
			"Developer",
			"Data analyst",
			"Copywriter",
			"Consultant",
			"Illustrator",
			"Video editor",
			"SEO specialist",
			"Translator",
		].map((label) => ({ value: label.toLowerCase(), label })),
	},
	{
		kind: "geoRadius",
		key: "near",
		label: "Around",
		description: "Type a town — Nantes, Rennes, Lyon…",
		searchPlaces: searchTowns,
		defaultKm: 30,
	},
	{ kind: "dateRange", key: "sentAt", label: "Sent" },
	{
		kind: "moneyRange",
		key: "price",
		label: "Project budget",
		currency: "EUR",
	},
	{
		kind: "numberRange",
		key: "radius",
		label: "Travel radius",
		unit: "km",
		min: 0,
		max: 200,
		step: 5,
	},
	{
		kind: "boolean",
		key: "opened",
		label: "Opened",
		trueLabel: "Opened",
		falseLabel: "Not opened",
	},
];

const frenchLabels = {
	trigger: "Rechercher et filtrer",
	title: "Filtres",
	apply: "Appliquer",
	clear: "Effacer",
	clearAll: "Tout effacer",
	search: "Rechercher",
	searchPlaceholder: "Rechercher par destinataire ou objet…",
	optionSearchPlaceholder: "Rechercher…",
	around: (place: string, kilometres: number) =>
		`${kilometres} km autour de ${place}`,
	placePlaceholder: "Ville, adresse…",
	placeNoResults: "Aucun lieu trouvé.",
	radius: "Rayon",
	changePlace: "Changer",
	is: "est",
	isNot: "n'est pas",
	from: "Du",
	to: "Au",
	min: "Min",
	max: "Max",
	any: "Peu importe",
	remove: "Retirer",
	resultCount: (count: number) => `${count} résultats`,
	selectedCount: (count: number) => `${count} sélectionnés`,
};

function FilterBarFixture({
	labels,
	locale,
}: {
	labels?: Partial<typeof defaultFilterLabels>;
	locale?: string;
}) {
	const [values, setValues] = useState<FilterValues>({
		status: { kind: "select", values: ["failed"], excluded: false },
	});
	const [search, setSearch] = useState("");

	return (
		<div className="flex max-w-3xl flex-col gap-6">
			<FilterBar
				definitions={definitions}
				values={values}
				onValuesChange={setValues}
				searchValue={search}
				onSearchChange={setSearch}
				resultCount={42}
				labels={labels}
				locale={locale}
			/>
			<pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
				{JSON.stringify({ search, values }, null, 2)}
			</pre>
		</div>
	);
}

// The stories drive a stateful fixture (a filter bar owns applied values), so
// the meta is typed against it rather than the bare component.
const meta = {
	title: "UI Filters/FilterBar",
	component: FilterBarFixture,
	tags: ["autodocs"],
} satisfies Meta<typeof FilterBarFixture>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Resize below 768px to get the bottom drawer and the native date pickers. */
export const Default: Story = {
	render: () => <FilterBarFixture />,
};

export const French: Story = {
	render: () => <FilterBarFixture labels={frenchLabels} locale="fr-FR" />,
};

/** The editor on its own, for a screen that shows filters inline. */
export const InlineForm: Story = {
	render: function InlineFormStory() {
		const [values, setValues] = useState<FilterValues>({});
		return (
			<div className="max-w-xl">
				<FilterForm
					definitions={definitions}
					values={values}
					onValuesChange={setValues}
					labels={defaultFilterLabels}
					locale="en-US"
				/>
			</div>
		);
	},
};

/** The geo filter on its own: pick a town, then size the circle on the map. */
export const AroundAPlace: Story = {
	render: function AroundAPlaceStory() {
		const [values, setValues] = useState<FilterValues>({});
		return (
			<div className="flex max-w-xl flex-col gap-4">
				<FilterForm
					definitions={definitions.filter(
						(definition) => definition.kind === "geoRadius",
					)}
					values={values}
					onValuesChange={setValues}
					labels={defaultFilterLabels}
					locale="en-US"
				/>
				<pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
					{JSON.stringify(values, null, 2)}
				</pre>
			</div>
		);
	},
};
