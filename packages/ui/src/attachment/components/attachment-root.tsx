import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

const attachmentVariants = cva({
	base: "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-xl border bg-card text-card-foreground transition-colors focus-within:ring-1 focus-within:ring-ring/50 has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed",
	variants: {
		size: {
			default:
				"gap-2 text-sm has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2",
			sm: "gap-2.5 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5",
			xs: "gap-1.5 rounded-lg text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1",
		},
		orientation: {
			horizontal: "min-w-40 items-center",
			vertical: "w-24 flex-col has-data-[slot=attachment-content]:w-30",
		},
	},
	defaultVariants: {
		size: "default",
		orientation: "horizontal",
	},
});

interface Props
	extends useRender.ComponentProps<"div">,
		VariantProps<typeof attachmentVariants> {
	/** The upload lifecycle stage the attachment renders. */
	state?: "idle" | "uploading" | "processing" | "error" | "done";
}

export function AttachmentRoot({
	className,
	state = "done",
	size = "default",
	orientation = "horizontal",
	render,
	...props
}: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(attachmentVariants({ size, orientation }), className),
			},
			props,
		),
		render,
		state: {
			slot: "attachment",
			state,
			size,
			orientation,
		},
	});
}
