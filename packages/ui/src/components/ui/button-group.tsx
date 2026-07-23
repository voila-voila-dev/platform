import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as React from "react";
import { Separator } from "#/components/ui/separator.tsx";
import { cva, type VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

const buttonGroupVariants = cva({
	base: "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
	variants: {
		orientation: {
			horizontal:
				"*:data-slot:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg! [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:border-l-0",
			vertical:
				"flex-col *:data-slot:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg! [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0",
		},
	},
});

const ButtonGroupContext = React.createContext<"horizontal" | "vertical">(
	"horizontal",
);

/**
 * Visual-only grouping: label it for screen readers with `aria-label` or
 * `aria-labelledby`. For a single-select segmented control (Day/Week/Month),
 * prefer `ToggleGroup`, which carries the pressed-state semantics.
 */
function ButtonGroup({
	className,
	orientation = "horizontal",
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
	return (
		<ButtonGroupContext.Provider value={orientation}>
			<div
				role="group"
				data-slot="button-group"
				data-orientation={orientation}
				className={cn(buttonGroupVariants({ orientation }), className)}
				{...props}
			/>
		</ButtonGroupContext.Provider>
	);
}

function ButtonGroupText({
	className,
	render,
	...props
}: useRender.ComponentProps<"div">) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"flex items-center gap-2 rounded-lg border bg-muted px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
					className,
				),
			},
			props,
		),
		render,
		state: {
			slot: "button-group-text",
		},
	});
}

function ButtonGroupSeparator({
	className,
	orientation,
	...props
}: React.ComponentProps<typeof Separator>) {
	const groupOrientation = React.useContext(ButtonGroupContext);
	return (
		<Separator
			data-slot="button-group-separator"
			// A horizontal group needs a vertical rule between members, and
			// vice versa - derived from the group so consumers never pass it.
			orientation={
				orientation ??
				(groupOrientation === "horizontal" ? "vertical" : "horizontal")
			}
			className={cn(
				"relative self-stretch bg-input data-[orientation=horizontal]:mx-px data-[orientation=horizontal]:w-auto data-[orientation=vertical]:my-px data-[orientation=vertical]:h-auto",
				className,
			)}
			{...props}
		/>
	);
}

export {
	ButtonGroup,
	ButtonGroupSeparator,
	ButtonGroupText,
	buttonGroupVariants,
};
