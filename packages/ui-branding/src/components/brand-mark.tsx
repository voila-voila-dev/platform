import { cn } from "@voila.dev/ui/utils";
import type { ComponentProps } from "react";

const markSizeClasses = {
	sm: "size-6",
	md: "size-8",
	lg: "size-10",
} as const;
export type LogoSize = keyof typeof markSizeClasses;
/** The v of "voila". */
const V_PATH = "M10.2 10.4 16 21.6 21.8 10.4";
interface Props extends Omit<ComponentProps<"svg">, "title"> {
	readonly size?: LogoSize;
	/** Accessible name, unless `decorative`. */
	readonly title?: string;
	/** Set when a parent already names the brand, e.g. inside `Logo`. */
	readonly decorative?: boolean;
	/** White tile, black `v` — for placing the mark on a dark surface. */
	readonly inverted?: boolean;
}
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
}: Props) {
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
