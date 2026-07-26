import { cn } from "@voila.dev/ui/utils";
import type { ComponentProps } from "react";
import { BrandMark, type LogoSize } from "#/components/brand-mark.tsx";

const wordmarkSizeClasses = {
	sm: "text-base",
	md: "text-lg",
	lg: "text-2xl",
} as const;
interface Props extends ComponentProps<"span"> {
	readonly size?: LogoSize;
	/** `full` pairs the mark with the wordmark; `mark` renders the tile alone. */
	readonly variant?: "full" | "mark";
	/** White tile, black `v` — for placing the lockup on a dark surface. */
	readonly inverted?: boolean;
}

/**
 * The canonical voila.dev lockup (the link, if any, comes from the caller).
 * The wordmark is set in the theme's mono family — give `--font-mono` a value
 * you have actually loaded, or it falls back to the system monospace.
 */
export function Logo({
	size = "md",
	variant = "full",
	inverted = false,
	className,
	...props
}: Props) {
	if (variant === "mark") {
		return <BrandMark size={size} inverted={inverted} className={className} />;
	}
	return (
		<span
			data-slot="logo"
			className={cn("inline-flex items-center gap-2", className)}
			{...props}
		>
			<BrandMark size={size} inverted={inverted} decorative />
			{/* One element, so the suffix stays kerned against the wordmark. */}
			<span
				className={cn(
					"font-mono font-semibold leading-none tracking-tight",
					wordmarkSizeClasses[size],
				)}
			>
				voila<span className="text-muted-foreground">.dev</span>
			</span>
		</span>
	);
}
