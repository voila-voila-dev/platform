// Defense in depth before a log line or an alert leaves for a third-party sink:
// it errs toward over-masking rather than trying to be a perfect parser. Order
// matters: emails first, so the digits of an address are not rewritten, and
// digit groups before phones, so no phone match leaves the rest of a card
// number behind.

const EMAIL = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/giu;
// Social security (15 digits), card (16) and account numbers, often written in groups.
const SPACED_DIGITS = /\b\d(?: ?\d){12,}\b/gu;
// A French number (0X XX XX XX XX) or an international one (+44 …), never the
// digits inside a longer number or a uuid.
const PHONE =
	/(?<![\w-])(?:0[\s.-]?[1-9](?:[\s.-]?\d{2}){4}|\+[1-9]\d{0,2}(?:[\s.-]?\d){6,12})(?![\w-])/gu;
// RPPS (11 digits) and any other long digit run.
const LONG_DIGITS = /\b\d{9,}\b/gu;

export function redactPii(input: string): string {
	return input
		.replace(EMAIL, "«email»")
		.replace(SPACED_DIGITS, "«id»")
		.replace(PHONE, "«phone»")
		.replace(LONG_DIGITS, "«id»");
}
