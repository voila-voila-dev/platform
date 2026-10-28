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
	/** The filters to edit, in the order they are rendered. */
	definitions: ReadonlyArray<FilterDefinition>;
	/** The record being edited. Controlled — this component keeps no draft. */
	values: FilterValues;
	/**
	 * Called on every edit, not on an apply: `Filter.Form` is the editor without
	 * the commit step, so hold the record in your own state and decide when to
	 * query. For draft-then-apply, use `Filter.Root` or `Filter.Panel`.
	 */
	onValuesChange: (values: FilterValues) => void;
	/**
	 * Every string the editor shows. `Filter.Root` supplies it; standalone, pass
	 * `defaultFilterLabels` or your own.
	 */
	labels: FilterLabels;
	/** BCP 47 tag used to format the numbers, money and dates in the fields. */
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
