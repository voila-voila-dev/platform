import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"button"> {}

/**
 * A full-card overlay that makes the whole attachment clickable (open a
 * preview, a link…) while `Attachment.Actions` stays clickable above it.
 */
export function AttachmentTrigger({
	className,
	render,
	type,
	...props
}: Props) {
	return useRender({
		defaultTagName: "button",
		props: mergeProps<"button">(
			{
				type: render ? type : (type ?? "button"),
				className: cn("absolute inset-0 z-10 outline-none", className),
			},
			props,
		),
		render,
		state: {
			slot: "attachment-trigger",
		},
	});
}
