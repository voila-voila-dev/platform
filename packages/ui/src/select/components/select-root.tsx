import { Select as SelectPrimitive } from "@base-ui/react/select";

interface Props<Value, Multiple extends boolean | undefined>
	extends SelectPrimitive.Root.Props<Value, Multiple> {}

/* Pass `items` (value → label) so the trigger renders the selected item's
 * label; without it Base UI's Value falls back to the raw value string. */
export function SelectRoot<Value, Multiple extends boolean | undefined = false>(
	props: Props<Value, Multiple>,
) {
	return <SelectPrimitive.Root data-slot="select" {...props} />;
}
