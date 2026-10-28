import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

/**
 * End-aligned slot of the toolbar for bulk/primary actions (export, create,
 * delete selection...).
 */
export function DataTableActions({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn("ms-auto flex items-center gap-2", className),
			},
			props,
		),
		render,
		state: { slot: "data-table-actions" },
	});
}
