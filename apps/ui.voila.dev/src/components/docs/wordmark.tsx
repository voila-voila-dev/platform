import { Link } from "@tanstack/react-router";

/**
 * The wordmark is HTML text rather than an <img>-referenced SVG so it uses the
 * webfont and follows the theme (an SVG image cannot load webfonts).
 */
export function Wordmark() {
	return (
		<Link
			to="/"
			translate="no"
			className="flex min-w-0 items-center gap-2.5 whitespace-nowrap no-underline"
		>
			<svg
				viewBox="0 0 32 32"
				fill="none"
				aria-hidden="true"
				className="h-6 w-6 shrink-0"
			>
				{/* Black tile, white v — inverted on dark so the mark keeps its contrast. */}
				<rect
					width="32"
					height="32"
					rx="8"
					className="fill-black dark:fill-white"
				/>
				<path
					d="M10.2 10.4 16 21.6 21.8 10.4"
					strokeWidth="3.6"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="stroke-white dark:stroke-black"
				/>
			</svg>
			<span className="font-mono text-base font-semibold tracking-tight text-foreground">
				ui.voila.dev
			</span>
		</Link>
	);
}
