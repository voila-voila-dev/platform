/**
 * Canvas takes colours as computed values only: no `var()`, and `currentColor`
 * means black. A hidden probe inside the chart resolves each CSS colour
 * against the page, theme and inherited colour included; the answers are
 * cached until the theme can have changed.
 */
export interface ColorResolver {
	readonly resolve: (color: string) => string;
	readonly dispose: () => void;
}

export function createColorResolver(host: HTMLElement): ColorResolver {
	const probe = document.createElement("span");
	probe.setAttribute("aria-hidden", "true");
	probe.style.cssText =
		"position:absolute;width:0;height:0;overflow:hidden;visibility:hidden";
	host.append(probe);
	const cache = new Map<string, string>();
	return {
		resolve(color) {
			const cached = cache.get(color);
			if (cached !== undefined) {
				return cached;
			}
			probe.style.color = "";
			probe.style.color = color;
			const resolved = getComputedStyle(probe).color || color;
			cache.set(color, resolved);
			return resolved;
		},
		dispose() {
			probe.remove();
		},
	};
}

/**
 * Calls `onChange` whenever the colours a chart resolved may be stale: a
 * class, style or theme attribute change on the root, a colour-scheme or
 * forced-colours switch.
 */
export function watchTheme(onChange: () => void): () => void {
	const observer = new MutationObserver(onChange);
	for (const node of [document.documentElement, document.body]) {
		if (node) {
			observer.observe(node, {
				attributes: true,
				attributeFilter: ["class", "style", "data-theme"],
			});
		}
	}
	const queries = [
		"(prefers-color-scheme: dark)",
		"(forced-colors: active)",
	].map((query) => window.matchMedia(query));
	for (const query of queries) {
		query.addEventListener("change", onChange);
	}
	return () => {
		observer.disconnect();
		for (const query of queries) {
			query.removeEventListener("change", onChange);
		}
	};
}
