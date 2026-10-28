import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
	type BadgeVariants,
	badgeVariants,
} from "#/badge/components/badge-variants.ts";
import { cn } from "#/lib/utils.ts";

// `color` is declared on both `useRender.ComponentProps<"span">` (as `string`)
// and `BadgeVariants` (as a palette union), so this has to stay an
// intersection — an interface `extends` would reject the conflicting member.
type Props = useRender.ComponentProps<"span"> & BadgeVariants;

/**
 * Dismissible tag built on the Badge recipe: same `variant`/`color`/`size`
 * axes, plus a `ChipRemove` button for removable selections (skills catalog,
 * active filters). For a static label, use `Badge` instead.
 */
export function ChipRoot({
	className,
	variant = "secondary",
	color,
	size = "default",
	render,
	...props
}: Props) {
	return useRender({
		defaultTagName: "span",
		props: mergeProps<"span">(
			{
				className: cn(
					badgeVariants({ variant, color, size }),
					"has-data-[slot=chip-remove]:pr-1",
					size === "sm" && "has-data-[slot=chip-remove]:pr-0.5",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "chip", variant, color, size },
	});
}
