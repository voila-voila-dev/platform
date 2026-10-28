import { XIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { Chip } from "#/chip/components/chip.tsx";
import {
	clearFilterValue,
	describeFilterValue,
} from "#/filter/lib/filter-values.ts";
import type {
	FilterDefinition,
	FilterLabels,
	FilterValues,
} from "#/filter/types.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	/**
	 * The same array the editor reads. A chip needs its definition to render a
	 * label, so a value with no matching definition is skipped.
	 */
	definitions: ReadonlyArray<FilterDefinition>;
	/** The applied filters. One chip per key present. */
	values: FilterValues;
	/** Called with the record minus the removed filter, as the chip is dismissed. */
	onValuesChange: (values: FilterValues) => void;
	/**
	 * Every string the chips show. `Filter.Root` supplies it; standalone, pass
	 * `defaultFilterLabels` or your own.
	 */
	labels: FilterLabels;
	/** BCP 47 tag used to format the numbers, money and dates inside the chips. */
	locale: string;
	/** Opens the editor, usually scrolled to the clicked filter. */
	onChipClick?: (key: string) => void;
}

/**
 * What is currently filtered, stated in full: one removable chip per active
 * filter. This is the "view" half of the pair — the editor is behind a trigger,
 * so without it a filtered list would look like a short list.
 */
export function FilterChips({
	definitions,
	values,
	onValuesChange,
	labels,
	locale,
	onChipClick,
	className,
	...props
}: Props) {
	const entries = Object.entries(values);
	if (entries.length === 0) {
		return null;
	}

	return (
		<div
			data-slot="filter-chips"
			className={cn("flex flex-wrap items-center gap-2", className)}
			{...props}
		>
			{entries.map(([key, value]) => {
				const description = describeFilterValue({
					definition: definitions.find((definition) => definition.key === key),
					value,
					labels,
					locale,
				});
				if (description === null) {
					return null;
				}
				return (
					<Chip.Root key={key} variant="outline" className="max-w-full">
						<button
							type="button"
							className="cursor-pointer truncate text-left"
							onClick={() => onChipClick?.(key)}
						>
							{description}
						</button>
						<Chip.Remove
							aria-label={`${labels.remove}: ${description}`}
							onClick={() => onValuesChange(clearFilterValue(values, key))}
						>
							<XIcon />
						</Chip.Remove>
					</Chip.Root>
				);
			})}
		</div>
	);
}
