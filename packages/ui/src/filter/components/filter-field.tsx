import { BooleanFilterField } from "#/filter/components/fields/boolean-filter-field.tsx";
import { DateRangeFilterField } from "#/filter/components/fields/date-range-filter-field.tsx";
import { GeoRadiusFilterField } from "#/filter/components/fields/geo-radius-filter-field.tsx";
import { MoneyRangeFilterField } from "#/filter/components/fields/money-range-filter-field.tsx";
import {
	NumberFilterField,
	NumberRangeFilterField,
} from "#/filter/components/fields/number-filter-field.tsx";
import { SelectFilterField } from "#/filter/components/fields/select-filter-field.tsx";
import { TextFilterField } from "#/filter/components/fields/text-filter-field.tsx";
import type {
	FilterDefinition,
	FilterLabels,
	FilterValue,
} from "#/filter/types.ts";

/**
 * Renders the editor a definition asks for. The value union is discriminated by
 * the same `kind` as the definition, so each branch narrows both at once — a new
 * filter kind is a compile error here until it has an editor.
 */
export function FilterField({
	definition,
	value,
	onValueChange,
	labels,
	locale,
}: {
	readonly definition: FilterDefinition;
	readonly value: FilterValue | undefined;
	readonly onValueChange: (value: FilterValue | undefined) => void;
	readonly labels: FilterLabels;
	readonly locale: string;
}) {
	const valueOfKind = <Kind extends FilterValue["kind"]>(kind: Kind) =>
		value?.kind === kind
			? (value as Extract<FilterValue, { kind: Kind }>)
			: undefined;

	switch (definition.kind) {
		case "text":
			return (
				<TextFilterField
					definition={definition}
					value={valueOfKind("text")}
					onValueChange={onValueChange}
					labels={labels}
				/>
			);
		case "number":
			return (
				<NumberFilterField
					definition={definition}
					value={valueOfKind("number")}
					onValueChange={onValueChange}
					labels={labels}
				/>
			);
		case "numberRange":
			return (
				<NumberRangeFilterField
					definition={definition}
					value={valueOfKind("numberRange")}
					onValueChange={onValueChange}
					labels={labels}
				/>
			);
		case "moneyRange":
			return (
				<MoneyRangeFilterField
					definition={definition}
					value={valueOfKind("moneyRange")}
					onValueChange={onValueChange}
					labels={labels}
				/>
			);
		case "select":
			return (
				<SelectFilterField
					definition={definition}
					value={valueOfKind("select")}
					onValueChange={onValueChange}
					labels={labels}
				/>
			);
		case "dateRange":
			return (
				<DateRangeFilterField
					definition={definition}
					value={valueOfKind("dateRange")}
					onValueChange={onValueChange}
					labels={labels}
					locale={locale}
				/>
			);
		case "geoRadius":
			return (
				<GeoRadiusFilterField
					definition={definition}
					value={valueOfKind("geoRadius")}
					onValueChange={onValueChange}
					labels={labels}
				/>
			);
		case "boolean":
			return (
				<BooleanFilterField
					definition={definition}
					value={valueOfKind("boolean")}
					onValueChange={onValueChange}
					labels={labels}
				/>
			);
	}
}
