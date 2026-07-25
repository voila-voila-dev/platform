import { XIcon } from "@phosphor-icons/react";
import { Chip, ChipRemove } from "#/components/chip.tsx";
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
}: {
	readonly definitions: ReadonlyArray<FilterDefinition>;
	readonly values: FilterValues;
	readonly onValuesChange: (values: FilterValues) => void;
	readonly labels: FilterLabels;
	readonly locale: string;
	/** Opens the editor, usually scrolled to the clicked filter. */
	readonly onChipClick?: (key: string) => void;
	readonly className?: string;
}) {
	const entries = Object.entries(values);
	if (entries.length === 0) {
		return null;
	}

	return (
		<div
			data-slot="filter-chips"
			className={cn("flex flex-wrap items-center gap-2", className)}
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
					<Chip key={key} variant="outline" className="max-w-full">
						<button
							type="button"
							className="cursor-pointer truncate text-left"
							onClick={() => onChipClick?.(key)}
						>
							{description}
						</button>
						<ChipRemove
							aria-label={`${labels.remove}: ${description}`}
							onClick={() => onValuesChange(clearFilterValue(values, key))}
						>
							<XIcon />
						</ChipRemove>
					</Chip>
				);
			})}
		</div>
	);
}
