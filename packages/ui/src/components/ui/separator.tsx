import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import { cn } from "#/lib/utils.ts";

/**
 * Visual divider. Pass `children` for a labeled divider (the auth-screen
 * "OU" pattern): the element keeps its separator semantics while two
 * decorative lines flank the label, so it works on any background - no
 * `bg-background` punch-through needed.
 *
 * Vertical separators `self-stretch` to fill the row. To shorten one inside
 * a taller row, pass a height plus `my-auto` (e.g. `className="my-auto h-4"`):
 * a definite height makes `self-stretch` start-align, and the auto margins
 * re-center it.
 */
function Separator({
	className,
	orientation = "horizontal",
	children,
	...props
}: SeparatorPrimitive.Props) {
	if (children == null) {
		return (
			<SeparatorPrimitive
				data-slot="separator"
				orientation={orientation}
				className={cn(
					"shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
					className,
				)}
				{...props}
			/>
		);
	}
	return (
		<SeparatorPrimitive
			data-slot="separator"
			orientation={orientation}
			className={cn(
				"flex shrink-0 items-center gap-2 text-sm text-muted-foreground data-[orientation=horizontal]:w-full data-[orientation=vertical]:flex-col data-[orientation=vertical]:self-stretch",
				className,
			)}
			{...props}
		>
			<SeparatorLine orientation={orientation} />
			<span data-slot="separator-label">{children}</span>
			<SeparatorLine orientation={orientation} />
		</SeparatorPrimitive>
	);
}

function SeparatorLine({
	orientation,
}: {
	orientation: NonNullable<SeparatorPrimitive.Props["orientation"]>;
}) {
	return (
		<span
			aria-hidden
			data-slot="separator-line"
			className={cn(
				"flex-1 bg-border",
				orientation === "vertical" ? "w-px" : "h-px",
			)}
		/>
	);
}

export { Separator };
