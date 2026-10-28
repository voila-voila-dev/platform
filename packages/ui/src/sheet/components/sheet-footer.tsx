import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

export function SheetFooter({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					// Extra bottom padding keeps actions above the iOS home indicator.
					"mt-auto flex flex-col gap-2 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "sheet-footer" },
	});
}
