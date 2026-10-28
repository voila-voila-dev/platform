/**
 * Ready-made digit masks for common identifier fields. `#` is a digit
 * slot; any other character is a literal separator inserted while typing.
 */
export const idNumberMask = "###########";
export const businessIdMask = "### ### ### #####";
export const phoneMask = "## ## ## ## ##";

export function countDigitSlots(mask: string): number {
	let count = 0;
	for (const maskCharacter of mask) {
		if (maskCharacter === "#") count += 1;
	}
	return count;
}

export function extractDigits(text: string, maximumDigits: number): string {
	return text.replace(/\D/g, "").slice(0, maximumDigits);
}

export function applyMask(digits: string, mask: string): string {
	let formatted = "";
	let digitIndex = 0;
	for (const maskCharacter of mask) {
		if (digitIndex >= digits.length) break;
		if (maskCharacter === "#") {
			formatted += digits[digitIndex];
			digitIndex += 1;
		} else {
			formatted += maskCharacter;
		}
	}
	return formatted;
}

function caretPositionAfterDigits(
	formatted: string,
	digitCount: number,
): number {
	if (digitCount <= 0) return 0;
	let digitsSeen = 0;
	for (let index = 0; index < formatted.length; index += 1) {
		if (/\d/.test(formatted.charAt(index))) {
			digitsSeen += 1;
			if (digitsSeen === digitCount) return index + 1;
		}
	}
	return formatted.length;
}

/**
 * Deleting a literal separator leaves the digits untouched, which would
 * reformat to the exact same string and trap the caret. Forward the deletion
 * to the adjacent digit instead.
 */
function forwardSeparatorDeletion(input: {
	digits: string;
	digitsBeforeCaret: number;
	inputType: string | undefined;
}): { digits: string; digitsBeforeCaret: number } {
	if (
		input.inputType === "deleteContentBackward" &&
		input.digitsBeforeCaret > 0
	) {
		return {
			digits:
				input.digits.slice(0, input.digitsBeforeCaret - 1) +
				input.digits.slice(input.digitsBeforeCaret),
			digitsBeforeCaret: input.digitsBeforeCaret - 1,
		};
	}
	if (input.inputType === "deleteContentForward") {
		return {
			digits:
				input.digits.slice(0, input.digitsBeforeCaret) +
				input.digits.slice(input.digitsBeforeCaret + 1),
			digitsBeforeCaret: input.digitsBeforeCaret,
		};
	}
	return { digits: input.digits, digitsBeforeCaret: input.digitsBeforeCaret };
}

export function computeMaskedChange(input: {
	rawText: string;
	selectionStart: number | null;
	inputType: string | undefined;
	currentDigits: string;
	formattedValue: string;
	mask: string;
	maximumDigits: number;
}): { nextDigits: string; caretPosition: number } {
	const selectionStart = input.selectionStart ?? input.rawText.length;
	let nextDigits = extractDigits(input.rawText, input.maximumDigits);
	let digitsBeforeCaret = extractDigits(
		input.rawText.slice(0, selectionStart),
		input.maximumDigits,
	).length;

	if (
		nextDigits === input.currentDigits &&
		input.rawText.length < input.formattedValue.length
	) {
		const forwarded = forwardSeparatorDeletion({
			digits: nextDigits,
			digitsBeforeCaret,
			inputType: input.inputType,
		});
		nextDigits = forwarded.digits;
		digitsBeforeCaret = forwarded.digitsBeforeCaret;
	}

	const caretPosition = caretPositionAfterDigits(
		applyMask(nextDigits, input.mask),
		Math.min(digitsBeforeCaret, nextDigits.length),
	);
	return { nextDigits, caretPosition };
}
