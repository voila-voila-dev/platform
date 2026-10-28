import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

/**
 * Filters emplacement for the toolbar - groups selects, checkbox groups,
 * toggle filters... so every table lays them out the same way.
 */
export function DataTableFilters({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				role: "group",
				className: cn("flex flex-wrap items-center gap-2", className),
			},
			props,
		),
		render,
		state: { slot: "data-table-filters" },
	});
}
