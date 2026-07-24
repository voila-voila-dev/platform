/**
 * Email look mirrored into the editor canvas, so blocks render on screen the
 * way the sent email will. Override these to match your own email theme: your
 * server-side renderer stays the source of truth, and these values only need to
 * agree with it closely enough that the canvas is an honest preview.
 */
export const EMAIL_COLOR = {
	brand: "#151b77",
	ink: "#2a2a33",
	muted: "#9095a3",
	border: "#ececf1",
	card: "#ffffff",
	canvas: "#f4f4f7",
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
