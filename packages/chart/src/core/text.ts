import type { ChartTextMeasurer } from "#/core/types.ts";

/**
 * Text width without a browser. The server and the first client render both
 * lay out with this estimate, so the hydrated markup matches; the browser
 * swaps in real metrics right after.
 *
 * Widths are in ems for a typical UI sans-serif: narrow letters, wide
 * letters, digits (tabular in most UI fonts) and everything else.
 */
const NARROW = /[ijlt.,:;'!|()[\]\s]/;
const WIDE = /[mwMW@%]/;
const DIGIT = /[0-9]/;
const UPPER = /[A-Z]/;

const EM_NARROW = 0.3;
const EM_WIDE = 0.85;
const EM_DIGIT = 0.58;
const EM_UPPER = 0.66;
const EM_OTHER = 0.54;
const BOLD_FACTOR = 1.06;
const BOLD_WEIGHT = 600;

function emWidth(character: string): number {
	if (NARROW.test(character)) return EM_NARROW;
	if (WIDE.test(character)) return EM_WIDE;
	if (DIGIT.test(character)) return EM_DIGIT;
	if (UPPER.test(character)) return EM_UPPER;
	return EM_OTHER;
}

export const estimateTextWidth: ChartTextMeasurer = (
	text,
	fontSize,
	fontWeight = 400,
) => {
	let ems = 0;
	for (const character of text) {
		ems += emWidth(character);
	}
	return ems * fontSize * (fontWeight >= BOLD_WEIGHT ? BOLD_FACTOR : 1);
};
