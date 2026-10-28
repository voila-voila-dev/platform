import { FilterBar } from "#/filter/components/filter-bar.tsx";
import { FilterChips } from "#/filter/components/filter-chips.tsx";
import { FilterField } from "#/filter/components/filter-field.tsx";
import { FilterForm } from "#/filter/components/filter-form.tsx";
import { FilterPanel } from "#/filter/components/filter-panel.tsx";
import { FilterTrigger } from "#/filter/components/filter-trigger.tsx";

/**
 * The Filter parts as one namespace.
 *
 * `Root` is the bar that holds the trigger and the chips; `Panel` and `Form`
 * build the editing surface, `Field` renders one definition.
 */
export const Filter = {
	Root: FilterBar,
	Chips: FilterChips,
	Field: FilterField,
	Form: FilterForm,
	Panel: FilterPanel,
	Trigger: FilterTrigger,
};
