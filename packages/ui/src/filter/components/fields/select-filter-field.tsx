import { useId, useState } from "react";
import { FilterFieldFrame } from "#/filter/components/fields/filter-field-frame.tsx";
import { FilterOperatorToggle } from "#/filter/components/fields/filter-operator-toggle.tsx";
import { OptionToggle } from "#/filter/components/fields/option-toggle.tsx";
import type {
	FilterLabels,
	SelectFilterDefinition,
	SelectFilterValue,
} from "#/filter/types.ts";
import { Input } from "#/input/components/input.tsx";

/** Past this many options the list gets its own search box. */
const SEARCHABLE_FROM = 8;
function toggleValue(
	values: ReadonlyArray<string>,
	value: string,
	multiple: boolean,
): ReadonlyArray<string> {
	if (values.includes(value)) {
		return values.filter((current) => current !== value);
	}
	return multiple ? [...values, value] : [value];
}

interface Props {
	definition: SelectFilterDefinition;
	value: SelectFilterValue | undefined;
	onValueChange: (value: SelectFilterValue) => void;
	labels: FilterLabels;
}

/** Single or multiple choice among a known set, optionally inverted. */
export function SelectFilterField({
	definition,
	value,
	onValueChange,
	labels,
}: Props) {
	const searchId = useId();
	const [query, setQuery] = useState("");
	const selected = value?.values ?? [];
	const excluded = value?.excluded ?? false;
	const multiple = definition.multiple ?? false;

	const searchable = definition.options.length >= SEARCHABLE_FROM;
	const normalizedQuery = query.trim().toLowerCase();
	const visibleOptions =
		normalizedQuery === ""
			? definition.options
			: definition.options.filter((option) =>
					option.label.toLowerCase().includes(normalizedQuery),
				);

	return (
		<FilterFieldFrame
			label={definition.label}
			description={definition.description}
			controlId={searchable ? searchId : undefined}
			labels={labels}
			operator={
				definition.allowExclusion === true ? (
					<FilterOperatorToggle
						excluded={excluded}
						disabled={selected.length === 0}
						onExcludedChange={(next) =>
							onValueChange({
								kind: "select",
								values: selected,
								excluded: next,
							})
						}
						labels={labels}
					/>
				) : undefined
			}
			onClear={
				selected.length === 0
					? undefined
					: () => onValueChange({ kind: "select", values: [], excluded })
			}
		>
			{searchable && (
				<Input
					id={searchId}
					value={query}
					placeholder={labels.optionSearchPlaceholder}
					aria-label={`${definition.label} — ${labels.search}`}
					onChange={(event) => setQuery(event.target.value)}
				/>
			)}
			<div
				role="listbox"
				aria-multiselectable={multiple}
				aria-label={definition.label}
				className="flex flex-wrap gap-2"
			>
				{visibleOptions.map((option) => (
					<OptionToggle
						key={option.value}
						option={option}
						selected={selected.includes(option.value)}
						onToggle={() =>
							onValueChange({
								kind: "select",
								values: toggleValue(selected, option.value, multiple),
								excluded,
							})
						}
					/>
				))}
			</div>
		</FilterFieldFrame>
	);
}
