import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"span"> {}

export function AttachmentTitle({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "span",
		props: mergeProps<"span">(
			{
				className: cn(
					"block max-w-full min-w-0 truncate font-medium group-data-[state=processing]/attachment:animate-pulse group-data-[state=uploading]/attachment:animate-pulse",
					className,
				),
			},
			props,
		),
		render,
		state: {
			slot: "attachment-title",
		},
	});
}
