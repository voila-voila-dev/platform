import type * as React from "react";
import { cva, type VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

const inputGroupAddonVariants = cva({
	base: "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none [&>svg:not([class*='size-'])]:size-4",
	variants: {
		align: {
			"inline-start": "order-first pl-2 has-[>button]:-ml-1 has-[>kbd]:-ml-0.5",
			"inline-end": "order-last pr-2 has-[>button]:-mr-1 has-[>kbd]:-mr-0.5",
			"block-start":
				"order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
			"block-end":
				"order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
		},
	},
	defaultVariants: {
		align: "inline-start",
	},
});

/**
 * `align` is mirrored as a `data-align` attribute because the `InputGroup`
 * root styles off it (`has-[>[data-align=block-end]]:flex-col`, control
 * padding, ...) - overriding `data-align` from the outside breaks that
 * coupling. Clicking the addon's EMPTY SPACE forwards focus to the group's
 * control (input or textarea); a consumer `onClick` runs first and can cancel
 * the forwarding with `event.preventDefault()`.
 *
 * A click that lands on an interactive element inside the addon is left alone.
 * That covers more than buttons: `TranslationInput` and `MoneyInput` both put a
 * `<select>` in a trailing addon, and forwarding focus to the input on
 * mousedown-then-click closed the native dropdown the moment it opened - the
 * locale/currency simply could not be changed with the pointer.
 */
interface Props
	extends React.ComponentProps<"div">,
		VariantProps<typeof inputGroupAddonVariants> {}

export function InputGroupAddon({
	className,
	align = "inline-start",
	onClick,
	...props
}: Props) {
	return (
		<div
			role="group"
			data-slot="input-group-addon"
			data-align={align}
			className={cn(inputGroupAddonVariants({ align }), className)}
			onClick={(event) => {
				onClick?.(event);
				if (event.defaultPrevented) {
					return;
				}
				if (
					(event.target as HTMLElement).closest(
						"button, a, input, select, textarea, label",
					)
				) {
					return;
				}
				event.currentTarget.parentElement
					?.querySelector<HTMLElement>("[data-slot=input-group-control]")
					?.focus();
			}}
			{...props}
		/>
	);
}
