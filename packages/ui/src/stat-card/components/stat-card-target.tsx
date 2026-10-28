import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

/**
 * Quiet objective line under the value ("Target: 90%"). The copy is yours —
 * the component only sets the muted small type and the slot.
 */
export function StatCardTarget({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"px-4 text-xs text-muted-foreground group-data-[size=sm]/card:px-3",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "stat-card-target" },
	});
}
