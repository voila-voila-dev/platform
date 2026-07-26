import type * as React from "react";
import { Fragment } from "react";
import { FilterField } from "#/filter/components/filter-field.tsx";
import { setFilterValue } from "#/filter/lib/filter-values.ts";
import type {
	FilterDefinition,
	FilterLabels,
	FilterValues,
} from "#/filter/types.ts";
import { cn } from "#/lib/utils.ts";
import { Separator } from "#/separator/components/separator.tsx";

interface Props extends React.ComponentProps<"div"> {
	definitions: ReadonlyArray<FilterDefinition>;
	values: FilterValues;
	onValuesChange: (values: FilterValues) => void;
	labels: FilterLabels;
	locale: string;
}

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
	className,
	...props
}: Props) {
	return (
		<div
			data-slot="filter-form"
			className={cn("flex flex-col gap-5", className)}
			{...props}
		>
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
