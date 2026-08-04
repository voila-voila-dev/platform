import type {
	EmailEditorHeadingLevel,
	EmailEditorImageWidth,
	EmailEditorPreview,
} from "#/email-block-editor/document/types.ts";

/**
 * Colours the canvas paints blocks with. The defaults point at the kit's
 * design tokens rather than at literal hex, so the canvas follows the active
 * theme (and dark mode) instead of sitting there as a light rectangle inside a
 * dark app.
 *
 * The sent email is a different rendering: an email client has no CSS
 * variables, so a server-side renderer keeps its own literal palette. Pass your
 * email palette here when you want the canvas to preview the exact colours a
 * recipient receives.
 */
export interface EmailEditorThemeColor {
	readonly brand: string;
	readonly ink: string;
	readonly muted: string;
	readonly border: string;
	readonly card: string;
	readonly canvas: string;
}

export interface EmailEditorTheme {
	readonly color: EmailEditorThemeColor;
	readonly font: string;
	/**
	 * The locale the canvas previews prices and dates in. Deliberately not the
	 * browser's locale: the canvas shows what the email will look like, and an
	 * author on a differently-configured machine would otherwise see a price the
	 * recipient never gets. The sent email formats per recipient.
	 */
	readonly locale: string;
	/** The two heading sizes. */
	readonly headingFontSize: {
		readonly [Level in EmailEditorHeadingLevel]: string;
	};
	/** The gutter between two grid cells, to mirror your renderer's cell padding. */
	readonly gridGapPx: number;
	/**
	 * How much of the card's inner width each image option occupies.
	 * `contained` is the option for a visual that should not bleed edge to edge
	 * (a logo, a portrait).
	 */
	readonly imageWidthRatio: {
		readonly [Width in EmailEditorImageWidth]: number;
	};
	/** The card width each preview mirrors: the full email card, or a common
	 * phone viewport. */
	readonly previewWidth: {
		readonly [Preview in EmailEditorPreview]: number;
	};
}

/** A theme override: every section optional, and optional within the section. */
export interface EmailEditorThemeInput {
	readonly color?: Partial<EmailEditorThemeColor>;
	readonly font?: string;
	readonly locale?: string;
	readonly headingFontSize?: Partial<EmailEditorTheme["headingFontSize"]>;
	readonly gridGapPx?: number;
	readonly imageWidthRatio?: Partial<EmailEditorTheme["imageWidthRatio"]>;
	readonly previewWidth?: Partial<EmailEditorTheme["previewWidth"]>;
}

export const DEFAULT_EMAIL_EDITOR_THEME: EmailEditorTheme = {
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
 * explicitly is what keeps `color.brand` overridable without `color` having to
 * be given whole.
 */
export const mergeEmailEditorTheme = (
	theme: EmailEditorThemeInput | undefined,
): EmailEditorTheme =>
	theme === undefined
		? DEFAULT_EMAIL_EDITOR_THEME
		: {
				color: { ...DEFAULT_EMAIL_EDITOR_THEME.color, ...theme.color },
				font: theme.font ?? DEFAULT_EMAIL_EDITOR_THEME.font,
				locale: theme.locale ?? DEFAULT_EMAIL_EDITOR_THEME.locale,
				headingFontSize: {
					...DEFAULT_EMAIL_EDITOR_THEME.headingFontSize,
					...theme.headingFontSize,
				},
				gridGapPx: theme.gridGapPx ?? DEFAULT_EMAIL_EDITOR_THEME.gridGapPx,
				imageWidthRatio: {
					...DEFAULT_EMAIL_EDITOR_THEME.imageWidthRatio,
					...theme.imageWidthRatio,
				},
				previewWidth: {
					...DEFAULT_EMAIL_EDITOR_THEME.previewWidth,
					...theme.previewWidth,
				},
			};
