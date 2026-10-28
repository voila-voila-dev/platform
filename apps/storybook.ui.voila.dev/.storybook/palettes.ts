import emeraldCss from "@voila.dev/ui/styles/themes/emerald.css?url";
import indigoCss from "@voila.dev/ui/styles/themes/indigo.css?url";
import irisCss from "@voila.dev/ui/styles/themes/iris.css?url";
import oliveCss from "@voila.dev/ui/styles/themes/olive.css?url";
import sandCss from "@voila.dev/ui/styles/themes/sand.css?url";

/**
 * The themes shipped by @voila.dev/ui, offered as a toolbar switch so every story
 * can be checked against each one.
 *
 * A theme is a plain stylesheet of custom properties, so switching one is
 * switching a `<link>`. `default` has no stylesheet because globals.css already
 * imports it; the others layer their overrides on top, which is why the link is
 * appended last.
 */
export const PALETTES = [
	{ id: "default", title: "Default (black & white)" },
	{ id: "indigo", title: "Indigo (Linear)", href: indigoCss },
	{ id: "iris", title: "Iris (Stripe)", href: irisCss },
	{ id: "sand", title: "Sand (Notion)", href: sandCss },
	{ id: "emerald", title: "Emerald (Supabase)", href: emeraldCss },
	{ id: "olive", title: "Olive (fintech)", href: oliveCss },
] as const;

const PALETTE_LINK_ID = "ui-palette-stylesheet";

const HREFS: Record<string, string | undefined> = Object.fromEntries(
	PALETTES.map((palette) => [
		palette.id,
		"href" in palette ? palette.href : undefined,
	]),
);

/**
 * Points the injected `<link>` at `id`'s stylesheet, or removes it for the
 * default theme. Idempotent, so re-rendering a story is free.
 */
export function applyPalette(id: string): void {
	const href = HREFS[id];
	const existing = document.getElementById(PALETTE_LINK_ID);

	if (href === undefined) {
		existing?.remove();
		return;
	}

	if (existing instanceof HTMLLinkElement) {
		if (existing.getAttribute("href") !== href) existing.href = href;
		return;
	}

	const link = document.createElement("link");
	link.id = PALETTE_LINK_ID;
	link.rel = "stylesheet";
	link.href = href;
	document.head.append(link);
}
