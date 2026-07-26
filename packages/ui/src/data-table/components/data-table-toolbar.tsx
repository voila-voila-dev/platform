import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

/**
 * Emplacement row above a `DataTable`: search at the start, filter controls
 * next to it, end-aligned actions via `DataTable.Actions`. Wraps on narrow
 * screens instead of overflowing.
 */
export function DataTableToolbar({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn("flex flex-wrap items-center gap-2", className),
			},
			props,
		),
		render,
		state: { slot: "data-table-toolbar" },
	});
}
