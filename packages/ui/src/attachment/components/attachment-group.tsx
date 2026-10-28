import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

export function AttachmentGroup({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"no-scrollbar flex min-w-0 snap-x snap-mandatory gap-3 scroll-px-1 overflow-x-auto overscroll-x-contain py-1 *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start",
					className,
				),
			},
			props,
		),
		render,
		state: {
			slot: "attachment-group",
		},
	});
}
