import { MapPinIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import { Button } from "@voila.dev/ui/components/button";
import { Input } from "@voila.dev/ui/components/input";
import { Slider } from "@voila.dev/ui/components/slider";
import { RadiusMap } from "@voila.dev/ui-map/components/radius-map";
import { useEffect, useId, useState } from "react";
import { FilterFieldFrame } from "#/components/fields/field-frame.tsx";
import type {
	FilterLabels,
	GeoRadiusFilterDefinition,
	GeoRadiusFilterValue,
	PlaceSuggestion,
} from "#/types.ts";

const DEFAULT_MIN_KM = 5;
const DEFAULT_MAX_KM = 200;
const DEFAULT_STEP_KM = 5;
const DEFAULT_RADIUS_KM = 30;
const SEARCH_DEBOUNCE_MS = 300;

/** Debounced place lookup: a keystroke is not a query. */
function usePlaceSearch(
	query: string,
	searchPlaces: GeoRadiusFilterDefinition["searchPlaces"],
): {
	readonly results: ReadonlyArray<PlaceSuggestion>;
	readonly busy: boolean;
} {
	const [results, setResults] = useState<ReadonlyArray<PlaceSuggestion>>([]);
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		const trimmed = query.trim();
		if (trimmed.length < 2) {
			setResults([]);
			setBusy(false);
			return;
		}
		setBusy(true);
		let cancelled = false;
		const handle = setTimeout(() => {
			searchPlaces(trimmed)
				.then((found) => {
					if (!cancelled) {
						setResults(found);
					}
				})
				.catch(() => {
					if (!cancelled) {
						setResults([]);
					}
				})
				.finally(() => {
					if (!cancelled) {
						setBusy(false);
					}
				});
		}, SEARCH_DEBOUNCE_MS);
		return () => {
			cancelled = true;
			clearTimeout(handle);
		};
	}, [query, searchPlaces]);

	return { results, busy };
}

function PlaceResults({
	results,
	busy,
	query,
	labels,
	onPick,
}: {
	readonly results: ReadonlyArray<PlaceSuggestion>;
	readonly busy: boolean;
	readonly query: string;
	readonly labels: FilterLabels;
	readonly onPick: (place: PlaceSuggestion) => void;
}) {
	if (busy) {
		return (
			<p className="flex items-center gap-2 text-muted-foreground text-sm">
				<SpinnerGapIcon className="size-4 animate-spin" />
				{labels.search}
			</p>
		);
	}
	if (query.trim().length >= 2 && results.length === 0) {
		return (
			<p className="text-muted-foreground text-sm">{labels.placeNoResults}</p>
		);
	}
	return (
		<ul className="flex flex-col gap-1">
			{results.map((place) => (
				<li key={place.id}>
					<button
						type="button"
						onClick={() => onPick(place)}
						className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
					>
						<MapPinIcon className="size-4 shrink-0 text-muted-foreground" />
						<span className="truncate">{place.label}</span>
					</button>
				</li>
			))}
		</ul>
	);
}

/**
 * "Within N km of somewhere": pick a place, then size the circle. The map is
 * the answer to "is that the area I meant?" — a lat/lon pair and a number are
 * not something anyone can picture.
 */
export function GeoRadiusFilterField({
	definition,
	value,
	onValueChange,
	labels,
}: {
	readonly definition: GeoRadiusFilterDefinition;
	readonly value: GeoRadiusFilterValue | undefined;
	readonly onValueChange: (value: GeoRadiusFilterValue | undefined) => void;
	readonly labels: FilterLabels;
}) {
	const controlId = useId();
	const [query, setQuery] = useState("");
	const { results, busy } = usePlaceSearch(query, definition.searchPlaces);

	const minKm = definition.minKm ?? DEFAULT_MIN_KM;
	const maxKm = definition.maxKm ?? DEFAULT_MAX_KM;

	if (value === undefined) {
		return (
			<FilterFieldFrame
				label={definition.label}
				description={definition.description}
				controlId={controlId}
				labels={labels}
			>
				<Input
					id={controlId}
					value={query}
					placeholder={labels.placePlaceholder}
					onChange={(event) => setQuery(event.target.value)}
				/>
				<PlaceResults
					results={results}
					busy={busy}
					query={query}
					labels={labels}
					onPick={(place) => {
						setQuery("");
						onValueChange({
							kind: "geoRadius",
							place,
							radiusKm: definition.defaultKm ?? DEFAULT_RADIUS_KM,
						});
					}}
				/>
			</FilterFieldFrame>
		);
	}

	return (
		<FilterFieldFrame
			label={definition.label}
			description={definition.description}
			labels={labels}
			onClear={() => onValueChange(undefined)}
		>
			<div className="flex items-center gap-2">
				<MapPinIcon className="size-4 shrink-0 text-muted-foreground" />
				<span className="min-w-0 flex-1 truncate text-sm">
					{value.place.label}
				</span>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => onValueChange(undefined)}
				>
					{labels.changePlace}
				</Button>
			</div>

			<RadiusMap center={value.place} radiusKm={value.radiusKm} />

			<div className="flex items-center gap-3">
				<span className="shrink-0 text-muted-foreground text-sm">
					{labels.radius}
				</span>
				<Slider
					aria-label={labels.radius}
					className="flex-1"
					min={minKm}
					max={maxKm}
					step={definition.stepKm ?? DEFAULT_STEP_KM}
					value={value.radiusKm}
					onValueChange={(next) =>
						onValueChange({
							...value,
							radiusKm: Array.isArray(next) ? (next[0] ?? minKm) : next,
						})
					}
				/>
				<span className="w-16 shrink-0 text-right text-sm tabular-nums">
					{`${value.radiusKm} km`}
				</span>
			</div>
		</FilterFieldFrame>
	);
}
