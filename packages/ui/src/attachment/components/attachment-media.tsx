import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

const attachmentMediaVariants = cva({
	base: "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-foreground group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-md group-data-[orientation=vertical]/attachment:w-full group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6",
	variants: {
		variant: {
			icon: "",
			image:
				"opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 [&_img]:aspect-square [&_img]:w-full [&_img]:object-cover",
		},
	},
	defaultVariants: {
		variant: "icon",
	},
});

interface Props
	extends useRender.ComponentProps<"div">,
		VariantProps<typeof attachmentMediaVariants> {}

export function AttachmentMedia({
	className,
	variant = "icon",
	render,
	...props
}: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(attachmentMediaVariants({ variant }), className),
			},
			props,
		),
		render,
		state: {
			slot: "attachment-media",
			variant,
		},
	});
}
