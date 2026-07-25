import { Fragment } from "react";
import { Separator } from "#/components/separator.tsx";
import { FilterField } from "#/filter/components/filter-field.tsx";
import { setFilterValue } from "#/filter/lib/filter-values.ts";
import type {
	FilterDefinition,
	FilterLabels,
	FilterValues,
} from "#/filter/types.ts";

/**
 * The editor: every declared filter, in declaration order, separated so a long
 * panel stays scannable. It edits a whole `FilterValues` record — clearing a
 * field removes its key, so the record never carries empty filters.
 */
export function FilterForm({
	definitions,
	values,
	onValuesChange,
	labels,
	locale,
}: {
	readonly definitions: ReadonlyArray<FilterDefinition>;
	readonly values: FilterValues;
	readonly onValuesChange: (values: FilterValues) => void;
	readonly labels: FilterLabels;
	readonly locale: string;
}) {
	return (
		<div className="flex flex-col gap-5" data-slot="filter-form">
			{definitions.map((definition, index) => (
				<Fragment key={definition.key}>
					{index > 0 && <Separator />}
					<FilterField
						definition={definition}
						value={values[definition.key]}
						locale={locale}
						labels={labels}
						onValueChange={(value) =>
							onValuesChange(setFilterValue(values, definition.key, value))
						}
					/>
				</Fragment>
			))}
		</div>
	);
}
