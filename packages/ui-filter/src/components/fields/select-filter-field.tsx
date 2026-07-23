import { CheckIcon } from "@phosphor-icons/react";
import { Input } from "@voila.dev/ui/components/input";
import { cn } from "@voila.dev/ui/lib/utils";
import { useId, useState } from "react";
import {
	FilterFieldFrame,
	FilterOperatorToggle,
} from "#/components/fields/field-frame.tsx";
import type {
	FilterLabels,
	FilterOption,
	SelectFilterDefinition,
	SelectFilterValue,
} from "#/types.ts";

/** Past this many options the list gets its own search box. */
const SEARCHABLE_FROM = 8;

/**
 * One option, as a toggle. Options are pressable pills rather than a dropdown:
 * the whole choice set stays visible while you build a filter, which is what
 * makes multi-select legible — and a pill is the same target size on a phone as
 * a native option row, without the modal picker's round trip.
 */
function OptionToggle({
	option,
	selected,
	onToggle,
}: {
	readonly option: FilterOption;
	readonly selected: boolean;
	readonly onToggle: () => void;
}) {
	return (
		<button
			type="button"
			role="option"
			aria-selected={selected}
			onClick={onToggle}
			className={cn(
				"inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
				"focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
				selected
					? "border-primary bg-primary text-primary-foreground"
					: "border-input bg-background text-foreground hover:bg-accent",
			)}
		>
			{selected && <CheckIcon weight="bold" className="size-3.5 shrink-0" />}
			{option.icon}
			{option.label}
		</button>
	);
}

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

/** Single or multiple choice among a known set, optionally inverted. */
export function SelectFilterField({
	definition,
	value,
	onValueChange,
	labels,
}: {
	readonly definition: SelectFilterDefinition;
	readonly value: SelectFilterValue | undefined;
	readonly onValueChange: (value: SelectFilterValue) => void;
	readonly labels: FilterLabels;
}) {
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
