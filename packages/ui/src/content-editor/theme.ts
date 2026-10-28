/** How the canvas looks: a page of prose, a mail as in Gmail, or the campaign card. */
export type ContentEditorAppearance = "document" | "plain" | "email";

/**
 * What the canvas is sized, coloured and set in. The defaults point at the
 * kit's tokens rather than at literal hex, so the canvas follows the active
 * theme and dark mode; a host overrides one section at a time.
 *
 * The sent email is a different rendering: an email client has no CSS
 * variables, so a server-side renderer keeps its own literal palette. Pass
 * that palette here when the canvas should preview the exact colours a
 * recipient receives.
 */
export interface ContentEditorThemeColor {
	readonly brand: string;
	readonly ink: string;
	readonly muted: string;
	readonly border: string;
	readonly card: string;
	readonly canvas: string;
}

export interface ContentEditorTheme {
	/** Sizes, as CSS custom properties set on the editor root. */
	readonly variables: {
		readonly "--content-editor-min-height": string;
		readonly "--content-editor-max-height": string;
		readonly "--content-editor-block-gap": string;
		readonly "--content-editor-prose-width": string;
	};
	readonly color: ContentEditorThemeColor;
	readonly font: string;
	/**
	 * The locale the canvas previews prices and dates in. Deliberately not the
	 * browser's: the canvas shows what the email will look like, and an author
	 * on a differently configured machine would otherwise see a price the
	 * recipient never gets. The sent email formats per recipient.
	 */
	readonly locale: string;
	/** The two email heading sizes. */
	readonly headingFontSize: { readonly 1: string; readonly 2: string };
	/** The gutter between two columns, to mirror the renderer's cell padding. */
	readonly gridGapPx: number;
	/**
	 * How much of the card's inner width each image width occupies.
	 * `contained` is for a visual that should not bleed edge to edge (a logo,
	 * a portrait).
	 */
	readonly imageWidthRatio: {
		readonly full: number;
		readonly contained: number;
	};
	/** The card width the email appearance mirrors, and a common phone viewport. */
	readonly previewWidth: { readonly desktop: number; readonly mobile: number };
}

/** A theme override: every section optional, and optional within the section. */
export interface ContentEditorThemeInput {
	readonly variables?: Partial<ContentEditorTheme["variables"]>;
	readonly color?: Partial<ContentEditorThemeColor>;
	readonly font?: string;
	readonly locale?: string;
	readonly headingFontSize?: Partial<ContentEditorTheme["headingFontSize"]>;
	readonly gridGapPx?: number;
	readonly imageWidthRatio?: Partial<ContentEditorTheme["imageWidthRatio"]>;
	readonly previewWidth?: Partial<ContentEditorTheme["previewWidth"]>;
}

export const DEFAULT_CONTENT_EDITOR_THEME: ContentEditorTheme = {
	variables: {
		"--content-editor-min-height": "8rem",
		"--content-editor-max-height": "none",
		"--content-editor-block-gap": "0.75rem",
		"--content-editor-prose-width": "48rem",
	},
	color: {
		brand: "var(--color-primary)",
		ink: "var(--color-card-foreground)",
		muted: "var(--color-muted-foreground)",
		border: "var(--color-border)",
		card: "var(--color-card)",
		canvas: "var(--color-muted)",
	},
	font: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
	locale: "en-US",
	headingFontSize: { 1: "22px", 2: "17px" },
	gridGapPx: 16,
	imageWidthRatio: { full: 1, contained: 0.6 },
	previewWidth: { desktop: 600, mobile: 390 },
};

/**
 * The defaults with an override laid over them, one section at a time. Not a
 * deep merge: a nested object here is a fixed set of keys, and spreading them
 * explicitly is what keeps `color.brand` overridable without `color` having
 * to be given whole.
 */
export function mergeContentEditorTheme(
	input: ContentEditorThemeInput | undefined,
): ContentEditorTheme {
	if (input === undefined) {
		return DEFAULT_CONTENT_EDITOR_THEME;
	}
	const defaults = DEFAULT_CONTENT_EDITOR_THEME;
	return {
		variables: { ...defaults.variables, ...input.variables },
		color: { ...defaults.color, ...input.color },
		font: input.font ?? defaults.font,
		locale: input.locale ?? defaults.locale,
		headingFontSize: { ...defaults.headingFontSize, ...input.headingFontSize },
		gridGapPx: input.gridGapPx ?? defaults.gridGapPx,
		imageWidthRatio: { ...defaults.imageWidthRatio, ...input.imageWidthRatio },
		previewWidth: { ...defaults.previewWidth, ...input.previewWidth },
	};
}

/**
 * The theme as CSS custom properties, set on the editor root so the canvas
 * of each appearance is styled with classes rather than inline styles.
 */
export function contentEditorThemeProperties(
	theme: ContentEditorTheme,
): Readonly<Record<string, string>> {
	return {
		...theme.variables,
		"--content-editor-brand": theme.color.brand,
		"--content-editor-ink": theme.color.ink,
		"--content-editor-muted": theme.color.muted,
		"--content-editor-border": theme.color.border,
		"--content-editor-card": theme.color.card,
		"--content-editor-canvas": theme.color.canvas,
		"--content-editor-font": theme.font,
		"--content-editor-email-width": `${theme.previewWidth.desktop}px`,
	};
}
