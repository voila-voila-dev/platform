import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { cn } from "#/lib/utils.ts";
import { SeparatorLine } from "#/separator/components/separator-line.tsx";

interface Props extends SeparatorPrimitive.Props {}

export function Separator({
	className,
	orientation = "horizontal",
	children,
	...props
}: Props) {
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
