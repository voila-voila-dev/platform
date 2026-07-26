import type {
	EmailEditorHeadingLevel,
	EmailEditorImageWidth,
} from "#/email-block-editor/document/types.ts";

/**
 * Colours the canvas paints blocks with. They point at the kit's design tokens
 * rather than at literal hex, so the canvas follows the active theme (and dark
 * mode) instead of sitting there as a light rectangle inside a dark app.
 *
 * The sent email is a different rendering: an email client has no CSS
 * variables, so the server-side renderer keeps its own literal palette. Point
 * these tokens at your email palette (or override the constants) when you want
 * the canvas to preview the exact colours a recipient receives.
 */
export const EMAIL_COLOR = {
	brand: "var(--color-primary)",
	ink: "var(--color-card-foreground)",
	muted: "var(--color-muted-foreground)",
	border: "var(--color-border)",
	card: "var(--color-card)",
	canvas: "var(--color-muted)",
} as const;

export const EMAIL_FONT =
	"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/**
 * The locale the canvas previews prices and dates in, mirroring
 * `renderMarketingEmailDocument`'s default. Deliberately not the browser's
 * locale: the canvas shows what the email will look like, and an author on a
 * differently-configured machine would otherwise see a price the recipient
 * never gets. The sent email formats per recipient.
 */
export const EMAIL_PREVIEW_LOCALE = "en-US";

/** The two heading sizes, mirroring the domain `emailHeading` component. */
export const EMAIL_HEADING_STYLE: {
	readonly [Level in EmailEditorHeadingLevel]: {
		readonly fontSize: string;
		readonly label: string;
	};
} = {
	1: { fontSize: "22px", label: "Main title (H1)" },
	2: { fontSize: "17px", label: "Subtitle (H2)" },
};

/** The gutter between two cells, mirrored by the renderer's cell padding. */
export const EMAIL_GRID_GAP_PX = 16;

/**
 * How much of the card's inner width each option occupies. `contained` is the
 * option for a visual that should not bleed edge to edge (a logo, a portrait);
 * the renderer uses the same ratio against the 536px content width.
 */
export const EMAIL_IMAGE_WIDTH_RATIO: {
	readonly [W in EmailEditorImageWidth]: number;
} = { full: 1, contained: 0.6 };
