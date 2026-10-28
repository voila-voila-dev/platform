import { MapPinIcon } from "@phosphor-icons/react";
import { useEffect, useId, useState } from "react";
import { Button } from "#/button/components/button.tsx";
import { FilterFieldFrame } from "#/filter/components/fields/filter-field-frame.tsx";
import { PlaceResults } from "#/filter/components/fields/place-results.tsx";
import type {
	FilterLabels,
	GeoRadiusFilterDefinition,
	GeoRadiusFilterValue,
	PlaceSuggestion,
} from "#/filter/types.ts";
import { Input } from "#/input/components/input.tsx";
import { RadiusMap } from "#/radius-map/components/radius-map.tsx";
import { Slider } from "#/slider/components/slider.tsx";

const DEFAULT_MIN_KM = 5;
const DEFAULT_MAX_KM = 200;
const DEFAULT_STEP_KM = 5;
const DEFAULT_RADIUS_KM = 30;
/** Debounced place lookup: a keystroke is not a query. */
function usePlaceSearch(
	query: string,
	searchPlaces: GeoRadiusFilterDefinition["searchPlaces"],
): {
	results: ReadonlyArray<PlaceSuggestion>;
	busy: boolean;
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

interface Props {
	definition: GeoRadiusFilterDefinition;
	value: GeoRadiusFilterValue | undefined;
	onValueChange: (value: GeoRadiusFilterValue | undefined) => void;
	labels: FilterLabels;
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
}: Props) {
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
				<Slider.Root
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

export const SEARCH_DEBOUNCE_MS = 300;
