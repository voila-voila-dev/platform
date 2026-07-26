import { MapPinIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import type * as React from "react";
import type { FilterLabels, PlaceSuggestion } from "#/filter/types.ts";
import { cn } from "#/lib/utils.ts";

// `results` is omitted from the base: React declares it on every element as
// Safari's legacy `<input results>` number.
interface Props extends Omit<React.ComponentProps<"ul">, "results"> {
	results: ReadonlyArray<PlaceSuggestion>;
	busy: boolean;
	query: string;
	labels: FilterLabels;
	onPick: (place: PlaceSuggestion) => void;
}

export function PlaceResults({
	results,
	busy,
	query,
	labels,
	onPick,
	className,
	...props
}: Props) {
	if (busy) {
		return (
			<p
				data-slot="filter-place-results"
				className="flex items-center gap-2 text-muted-foreground text-sm"
			>
				<SpinnerGapIcon className="size-4 animate-spin" />
				{labels.search}
			</p>
		);
	}
	if (query.trim().length >= 2 && results.length === 0) {
		return (
			<p
				data-slot="filter-place-results"
				className="text-muted-foreground text-sm"
			>
				{labels.placeNoResults}
			</p>
		);
	}
	return (
		<ul
			data-slot="filter-place-results"
			className={cn("flex flex-col gap-1", className)}
			{...props}
		>
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
