import * as React from "react";

import {
	applyMask,
	computeMaskedChange,
	countDigitSlots,
	extractDigits,
} from "#/formatted-input/lib/formatted-input-mask.ts";
import { Input } from "#/input/components/input.tsx";

type InputChangeEvent = Parameters<
	NonNullable<React.ComponentProps<typeof Input>["onChange"]>
>[0];

interface Props
	extends Omit<
		React.ComponentProps<typeof Input>,
		"value" | "defaultValue" | "onValueChange" | "type"
	> {
	/** Digit mask, e.g. `"### ### ### #####"` for a business id. `#` marks a digit slot. */
	mask: string;
	/** Raw digits (unformatted). */
	value?: string;
	/** Raw digits (unformatted). */
	defaultValue?: string;
	/** Receives the raw digits whenever they change. */
	onValueChange?: (value: string) => void;
}

export function FormattedInput({
	mask,
	value,
	defaultValue,
	onValueChange,
	onChange,
	ref,
	...props
}: Props) {
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
