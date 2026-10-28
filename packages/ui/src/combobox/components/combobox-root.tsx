import { Combobox as ComboboxPrimitive } from "@base-ui/react";

interface Props<
	Value,
	Multiple extends boolean | undefined = false,
	Item = Value,
> extends ComboboxPrimitive.Root.Props<Value, Multiple, Item> {}

// Base UI's combobox root renders no DOM element of its own, so it can't carry
// a `data-slot` the way the other kit roots do; we still wrap it in a named
// generic function for API consistency (and a discoverable doc anchor) while
// forwarding the value/multiple/item generics intact. `Item` is what the list
// iterates and defaults to `Value`; a grid iterates rows, so there it differs.
export function ComboboxRoot<
	Value,
	Multiple extends boolean | undefined = false,
	Item = Value,
>(props: Props<Value, Multiple, Item>) {
	return <ComboboxPrimitive.Root {...props} />;
}
