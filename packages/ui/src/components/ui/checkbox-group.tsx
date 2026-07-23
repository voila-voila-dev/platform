import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";

import { cn } from "#/lib/utils.ts";

type CheckboxGroupProps = CheckboxGroupPrimitive.Props & {
	/**
	 * Layout direction of the items. `vertical` stacks them (the default);
	 * `horizontal` lays them out in a wrapping row - saves consumers from
	 * rebuilding a `flex-row` wrapper for short option sets. (Same API as
	 * `RadioGroup`.)
	 */
	orientation?: "vertical" | "horizontal";
};

/**
 * Shared `value: string[]` state for a set of `Checkbox`es - each box opts in
 * with its `name` prop. A box given `parent` together with `allValues` on the
 * group becomes the tick-all/indeterminate parent checkbox.
 *
 * In parent mode Base UI overrides every box's `id` for its `aria-controls`
 * wiring, which silently breaks `htmlFor`/`id` label pairs - wrap each box in
 * its `Label` instead (implicit association).
 */
function CheckboxGroup({
	className,
	orientation = "vertical",
	...props
}: CheckboxGroupProps) {
	return (
		<CheckboxGroupPrimitive
			data-slot="checkbox-group"
			data-orientation={orientation}
			className={cn(
				orientation === "horizontal"
					? "flex flex-wrap items-center gap-x-4 gap-y-2"
					: "grid gap-2",
				className,
			)}
			{...props}
		/>
	);
}

export { CheckboxGroup, type CheckboxGroupProps };
