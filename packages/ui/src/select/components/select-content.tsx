import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "#/lib/utils.ts";
import { SelectScrollDownButton } from "#/select/components/select-scroll-down-button.tsx";
import { SelectScrollUpButton } from "#/select/components/select-scroll-up-button.tsx";

interface Props
	extends SelectPrimitive.Popup.Props,
		Pick<
			SelectPrimitive.Positioner.Props,
			| "align"
			| "alignOffset"
			| "side"
			| "sideOffset"
			| "alignItemWithTrigger"
			| "collisionPadding"
		> {}

/* With the default `alignItemWithTrigger` the popup overlaps the trigger
 * macOS-style and intentionally suppresses the open/close animation; pass
 * `alignItemWithTrigger={false}` to get the popover-style zoom/fade. */
export function SelectContent({
	className,
	children,
	side = "bottom",
	sideOffset = 4,
	align = "center",
	alignOffset = 0,
	alignItemWithTrigger = true,
	collisionPadding,
	...props
}: Props) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Positioner
				side={side}
				sideOffset={sideOffset}
				align={align}
				alignOffset={alignOffset}
				alignItemWithTrigger={alignItemWithTrigger}
				collisionPadding={collisionPadding}
				className="isolate z-50"
			>
				<SelectPrimitive.Popup
					data-slot="select-content"
					data-align-trigger={alignItemWithTrigger}
					className={cn(
						"relative isolate z-50 max-h-(--available-height) max-w-(--available-width) min-w-[max(9rem,var(--anchor-width))] origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
						className,
					)}
					{...props}
				>
					<SelectScrollUpButton />
					<SelectPrimitive.List className="p-1">
						{children}
					</SelectPrimitive.List>
					<SelectScrollDownButton />
				</SelectPrimitive.Popup>
			</SelectPrimitive.Positioner>
		</SelectPrimitive.Portal>
	);
}
