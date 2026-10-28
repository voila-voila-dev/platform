import type { ChartTheme } from "#/core/types.ts";

/** What the palette falls back to on a page without the kit's `--chart-N` tokens. */
const FALLBACK_PALETTE = [
	"oklch(0.646 0.222 41.116)",
	"oklch(0.6 0.118 184.704)",
	"oklch(0.398 0.07 227.392)",
	"oklch(0.828 0.189 84.429)",
	"oklch(0.769 0.188 70.08)",
];

/**
 * Every colour is a CSS variable with a fallback, so a chart picks up the
 * kit's tokens (`--chart-1`…, `--muted-foreground`, `--border`) when the page
 * has them and still draws legibly when it does not.
 */
export const DEFAULT_THEME: ChartTheme = {
	palette: FALLBACK_PALETTE.map(
		(fallback, index) => `var(--chart-${index + 1}, ${fallback})`,
	),
	foreground: "var(--foreground, currentColor)",
	muted: "var(--muted-foreground, currentColor)",
	grid: "var(--border, color-mix(in oklab, currentColor 15%, transparent))",
	background: "var(--background, Canvas)",
	fontSize: 12,
};
