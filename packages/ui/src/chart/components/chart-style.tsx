import type { ChartConfig } from "#/chart/core/config.ts";

/**
 * Per-chart CSS: the `--color-<key>` variable each configured series is drawn
 * with, and the entrance animation its marks fade in on.
 *
 * The variables live in a stylesheet rather than in an inline `style` so a
 * `theme` pair can serve light and dark from the same markup — no re-render on
 * theme change, no reading the document during render.
 */

/** Where each theme's variables apply. Light is the unprefixed default. */
const THEME_SELECTORS = { light: "", dark: ".dark" } as const;

/** Guards interpolated colours: variables, functions, hex and keywords only. */
const CSS_VALUE_PATTERN = /^[\w(),.%#\s-]+$/;

function colorDeclarations(
	config: ChartConfig,
	theme: "light" | "dark",
): string {
	return Object.entries(config)
		.map(([key, item]) => {
			const color = item.theme?.[theme] ?? item.color;
			return color !== undefined && CSS_VALUE_PATTERN.test(color)
				? `  --color-${key}: ${color};`
				: null;
		})
		.filter((declaration) => declaration !== null)
		.join("\n");
}

/**
 * Marks opt in with `data-chart-animate`. Gated behind
 * `prefers-reduced-motion: no-preference`, so a reader who has asked for less
 * motion gets the finished chart immediately instead of a faster animation.
 */
const ENTER_ANIMATION = `
@keyframes voila-chart-enter {
  from { opacity: 0; }
  to { opacity: 1; }
}
@media (prefers-reduced-motion: no-preference) {
  [data-slot="chart-root"] [data-chart-animate] {
    animation: voila-chart-enter 320ms cubic-bezier(0.4, 0, 0.2, 1) both;
    animation-delay: var(--chart-enter-delay, 0ms);
  }
}`;

export function ChartStyle({
	id,
	config,
}: {
	readonly id: string;
	readonly config: ChartConfig;
}) {
	const scoped = Object.entries(THEME_SELECTORS)
		.map(([theme, prefix]) => {
			const declarations = colorDeclarations(
				config,
				theme as keyof typeof THEME_SELECTORS,
			);
			return declarations === ""
				? ""
				: `${prefix} [data-chart=${id}] {\n${declarations}\n}`;
		})
		.filter((block) => block !== "")
		.join("\n");

	// A <style> element has no other API. Everything interpolated is either a
	// generated id or a colour that passed CSS_VALUE_PATTERN.
	return (
		<style
			data-slot="chart-style"
			dangerouslySetInnerHTML={{ __html: `${scoped}\n${ENTER_ANIMATION}` }}
		/>
	);
}
