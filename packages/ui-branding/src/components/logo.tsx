import { cn } from "@voila.dev/ui/lib/utils";
import type { ComponentProps } from "react";

const markSizeClasses = {
	sm: "size-6",
	md: "size-8",
	lg: "size-10",
} as const;

const wordmarkSizeClasses = {
	sm: "text-base",
	md: "text-lg",
	lg: "text-2xl",
} as const;

type LogoSize = keyof typeof markSizeClasses;

/** The v of "voila". */
const V_PATH = "M10.2 10.4 16 21.6 21.8 10.4";

/**
 * The voila mark: a bold white `v` on a black tile. Rendered inline (rather
 * than as an `<img>`) so it stays crisp at any size.
 *
 * The tile is black in both themes, which means it needs a light surface behind
 * it — on a dark one, pass `inverted` to swap the two.
 */
export function BrandMark({
	size = "md",
	className,
	title = "voila",
	decorative = false,
	inverted = false,
	...props
}: Omit<ComponentProps<"svg">, "title"> & {
	readonly size?: LogoSize;
	/** Accessible name, unless `decorative`. */
	readonly title?: string;
	/** Set when a parent already names the brand, e.g. inside `Logo`. */
	readonly decorative?: boolean;
	/** White tile, black `v` — for placing the mark on a dark surface. */
	readonly inverted?: boolean;
}) {
	const shared = {
		"data-slot": "brand-mark",
		viewBox: "0 0 32 32",
		fill: "none",
		className: cn("shrink-0", markSizeClasses[size], className),
		...props,
	} as const;
	const shape = (
		<>
			<rect
				width="32"
				height="32"
				rx="8"
				fill={inverted ? "#ffffff" : "#000000"}
			/>
			<path
				d={V_PATH}
				stroke={inverted ? "#000000" : "#ffffff"}
				strokeWidth="3.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</>
	);
	if (decorative) {
		return (
			<svg {...shared} role="presentation" aria-hidden="true">
				{shape}
			</svg>
		);
	}
	return (
		<svg {...shared} role="img">
			<title>{title}</title>
			{shape}
		</svg>
	);
}

interface LogoProps extends ComponentProps<"span"> {
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
}: LogoProps) {
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
