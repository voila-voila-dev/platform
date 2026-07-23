import * as React from "react";

import { Input } from "#/components/ui/input.tsx";

/**
 * Digit masks for the French identifiers the apps collect. `#` is a digit
 * slot; any other character is a literal separator inserted while typing.
 */
const rppsMask = "###########";
const siretMask = "### ### ### #####";
const frenchPhoneMask = "## ## ## ## ##";

function countDigitSlots(mask: string): number {
	let count = 0;
	for (const maskCharacter of mask) {
		if (maskCharacter === "#") count += 1;
	}
	return count;
}

function extractDigits(text: string, maximumDigits: number): string {
	return text.replace(/\D/g, "").slice(0, maximumDigits);
}

function applyMask(digits: string, mask: string): string {
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

type InputChangeEvent = Parameters<
	NonNullable<React.ComponentProps<typeof Input>["onChange"]>
>[0];

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

function computeMaskedChange(input: {
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

type FormattedInputProps = Omit<
	React.ComponentProps<typeof Input>,
	"value" | "defaultValue" | "onValueChange" | "type"
> & {
	/** Digit mask, e.g. `"### ### ### #####"` for SIRET. `#` marks a digit slot. */
	mask: string;
	/** Raw digits (unformatted). */
	value?: string;
	/** Raw digits (unformatted). */
	defaultValue?: string;
	/** Receives the raw digits whenever they change. */
	onValueChange?: (value: string) => void;
};

function FormattedInput({
	mask,
	value,
	defaultValue,
	onValueChange,
	onChange,
	ref,
	...props
}: FormattedInputProps) {
	const maximumDigits = countDigitSlots(mask);
	const [internalDigits, setInternalDigits] = React.useState(() =>
		extractDigits(defaultValue ?? "", maximumDigits),
	);
	const digits =
		value !== undefined ? extractDigits(value, maximumDigits) : internalDigits;
	const formattedValue = applyMask(digits, mask);

	const inputRef = React.useRef<HTMLInputElement | null>(null);
	const pendingCaret = React.useRef<number | null>(null);

	// The caret can only be repositioned once React has re-rendered the input
	// with the reformatted value, hence the layout effect rather than doing it
	// inside the change handler.
	React.useLayoutEffect(() => {
		if (pendingCaret.current === null) return;
		inputRef.current?.setSelectionRange(
			pendingCaret.current,
			pendingCaret.current,
		);
		pendingCaret.current = null;
	});

	const commitDigits = (nextDigits: string) => {
		if (value === undefined) setInternalDigits(nextDigits);
		if (nextDigits !== digits) onValueChange?.(nextDigits);
	};

	const handleChange = (event: InputChangeEvent) => {
		const { nextDigits, caretPosition } = computeMaskedChange({
			rawText: event.target.value,
			selectionStart: event.target.selectionStart,
			inputType: (event.nativeEvent as InputEvent).inputType,
			currentDigits: digits,
			formattedValue,
			mask,
			maximumDigits,
		});
		pendingCaret.current = caretPosition;
		commitDigits(nextDigits);
		onChange?.(event);
	};

	return (
		<Input
			data-slot="formatted-input"
			type="text"
			inputMode="numeric"
			autoComplete="off"
			spellCheck={false}
			{...props}
			ref={(element: HTMLInputElement | null) => {
				inputRef.current = element;
				if (typeof ref === "function") return ref(element);
				if (ref) ref.current = element;
			}}
			value={formattedValue}
			onChange={handleChange}
		/>
	);
}

export {
	applyMask,
	FormattedInput,
	type FormattedInputProps,
	frenchPhoneMask,
	rppsMask,
	siretMask,
};
