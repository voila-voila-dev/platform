import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";

import { cn } from "#/lib/utils.ts";

/**
 * Rich hover preview (Base UI PreviewCard) for link/mention triggers — an
 * avatar, a bio, a few stats. For a plain text hint on any control, use
 * Tooltip instead: a hover card is for content worth lingering on, so it opens
 * slower and stays open while the pointer is over the card itself.
 */
function HoverCard({ ...props }: PreviewCardPrimitive.Root.Props) {
	return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />;
}

/**
 * Opens the card after `delay` (600ms Base UI default) and closes it after
 * `closeDelay` (300ms default) — both are tuned here, on the trigger.
 */
function HoverCardTrigger({ ...props }: PreviewCardPrimitive.Trigger.Props) {
	return (
		<PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
	);
}

function HoverCardContent({
	className,
	align = "center",
	alignOffset = 0,
	side = "bottom",
	sideOffset = 8,
	collisionPadding = 8,
	positionerProps,
	...props
}: PreviewCardPrimitive.Popup.Props &
	Pick<
		PreviewCardPrimitive.Positioner.Props,
		"align" | "alignOffset" | "collisionPadding" | "side" | "sideOffset"
	> & {
		// Escape hatch for the Positioner props not surfaced as dedicated props
		// (sticky, anchor, positionMethod, arrowPadding…).
		positionerProps?: Omit<
			PreviewCardPrimitive.Positioner.Props,
			| "align"
			| "alignOffset"
			| "collisionPadding"
			| "side"
			| "sideOffset"
			| "children"
		>;
	}) {
	const { className: positionerClassName, ...restPositionerProps } =
		positionerProps ?? {};
	return (
		<PreviewCardPrimitive.Portal data-slot="hover-card-portal">
			<PreviewCardPrimitive.Positioner
				align={align}
				alignOffset={alignOffset}
				collisionPadding={collisionPadding}
				side={side}
				sideOffset={sideOffset}
				className={cn("isolate z-50", positionerClassName)}
				{...restPositionerProps}
			>
				<PreviewCardPrimitive.Popup
					data-slot="hover-card-content"
					className={cn(
						"z-50 w-72 origin-(--transform-origin) rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 motion-reduce:animate-none",
						className,
					)}
					{...props}
				/>
			</PreviewCardPrimitive.Positioner>
		</PreviewCardPrimitive.Portal>
	);
}

export { HoverCard, HoverCardContent, HoverCardTrigger };
