import { useState } from "react";
import { FilterChips } from "#/components/filter-chips.tsx";
import { FilterPanel } from "#/components/filter-panel.tsx";
import { FilterTrigger } from "#/components/filter-trigger.tsx";
import { countActiveFilters } from "#/lib/filter-values.ts";
import {
	defaultFilterLabels,
	type FilterDefinition,
	type FilterLabels,
	type FilterValues,
} from "#/types.ts";

/**
 * The whole filtering surface of a list, in one component: the search-shaped
 * trigger, the overlay editor behind it, the chips stating what is active, and
 * the result count. Screens declare their filters and hand over the applied
 * record — everything else (draft handling, responsiveness, copy) lives here so
 * every list filters the same way.
 */
export function FilterBar({
	definitions,
	values,
	onValuesChange,
	searchValue,
	onSearchChange,
	resultCount,
	labels: labelOverrides,
	locale = "en-US",
}: {
	readonly definitions: ReadonlyArray<FilterDefinition>;
	readonly values: FilterValues;
	readonly onValuesChange: (values: FilterValues) => void;
	/** Omit both search props for a list that filters without free text. */
	readonly searchValue?: string;
	readonly onSearchChange?: (value: string) => void;
	readonly resultCount?: number;
	readonly labels?: Partial<FilterLabels>;
	readonly locale?: string;
}) {
	const [open, setOpen] = useState(false);
	const labels: FilterLabels = { ...defaultFilterLabels, ...labelOverrides };
	const activeCount = countActiveFilters(values);

	return (
		<div className="flex w-full min-w-0 flex-col gap-3" data-slot="filter-bar">
			{/* `min-w-0` on both children: without it a flex item refuses to shrink
			    below its content, and the nowrap result count pushes the row past
			    the viewport — a phone then scrolls sideways. */}
			<div className="flex min-w-0 items-center gap-3">
				<FilterTrigger
					summary={
						searchValue === undefined || searchValue === ""
							? undefined
							: searchValue
					}
					activeCount={activeCount}
					labels={labels}
					className="min-w-0 flex-1 sm:max-w-md"
					onClick={() => setOpen(true)}
				/>
				{resultCount !== undefined && (
					<span className="shrink-0 whitespace-nowrap text-muted-foreground text-sm">
						{labels.resultCount(resultCount)}
					</span>
				)}
			</div>

			<FilterChips
				definitions={definitions}
				values={values}
				onValuesChange={onValuesChange}
				labels={labels}
				locale={locale}
				onChipClick={() => setOpen(true)}
			/>

			<FilterPanel
				open={open}
				onOpenChange={setOpen}
				definitions={definitions}
				values={values}
				onValuesChange={onValuesChange}
				labels={labels}
				locale={locale}
				searchValue={searchValue}
				onSearchChange={onSearchChange}
			/>
		</div>
	);
}
