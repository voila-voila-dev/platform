// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	applyMask,
	businessIdMask,
	FormattedInput,
	idNumberMask,
	phoneMask,
} from "#/components/formatted-input.tsx";

afterEach(cleanup);

function queryInput(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector<HTMLInputElement>(
		"[data-slot=formatted-input]",
	);
}

/**
 * Sets the value through the native setter (bypassing React's value tracker so
 * the event is not deduplicated), positions the caret, then dispatches an
 * input event carrying the given inputType — the closest jsdom gets to a real
 * keystroke.
 */
function typeRaw(
	input: HTMLInputElement,
	rawValue: string,
	caret: number,
	inputType: string,
) {
	const nativeValueSetter = Object.getOwnPropertyDescriptor(
		window.HTMLInputElement.prototype,
		"value",
	)?.set;
	nativeValueSetter?.call(input, rawValue);
	input.setSelectionRange(caret, caret);
	fireEvent.input(input, { inputType });
}

describe("applyMask", () => {
	it("formats a full business id into 3-3-3-5 groups", () => {
		expect(applyMask("12345678901234", businessIdMask)).toBe(
			"123 456 789 01234",
		);
	});

	it("formats partial digits without a trailing separator", () => {
		expect(applyMask("123", businessIdMask)).toBe("123");
		expect(applyMask("1234", businessIdMask)).toBe("123 4");
	});

	it("leaves the id number unseparated and pairs phone digits", () => {
		expect(applyMask("10003456789", idNumberMask)).toBe("10003456789");
		expect(applyMask("0612345678", phoneMask)).toBe("06 12 34 56 78");
	});
});

describe("FormattedInput", () => {
	it("renders a numeric text input tagged with data-slot", () => {
		const screen = render(<FormattedInput mask={businessIdMask} />);
		const input = queryInput(screen);
		expect(input?.tagName).toBe("INPUT");
		expect(input?.getAttribute("type")).toBe("text");
		expect(input?.getAttribute("inputmode")).toBe("numeric");
		expect(input?.getAttribute("autocomplete")).toBe("off");
	});

	it("formats the defaultValue digits through the mask", () => {
		const screen = render(
			<FormattedInput mask={phoneMask} defaultValue="0612345678" />,
		);
		expect(queryInput(screen)?.value).toBe("06 12 34 56 78");
	});

	it("reformats on change and reports raw digits via onValueChange", () => {
		const onValueChange = vi.fn();
		const screen = render(
			<FormattedInput mask={businessIdMask} onValueChange={onValueChange} />,
		);
		const input = queryInput(screen);
		if (!input) throw new Error("input not rendered");

		fireEvent.change(input, { target: { value: "1234" } });

		expect(input.value).toBe("123 4");
		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange).toHaveBeenLastCalledWith("1234");
	});

	it("strips non-digits and truncates pasted overflow to the mask capacity", () => {
		const onValueChange = vi.fn();
		const screen = render(
			<FormattedInput mask={idNumberMask} onValueChange={onValueChange} />,
		);
		const input = queryInput(screen);
		if (!input) throw new Error("input not rendered");

		fireEvent.change(input, { target: { value: "ID 10003456789 extra 99" } });

		expect(input.value).toBe("10003456789");
		expect(onValueChange).toHaveBeenLastCalledWith("10003456789");
	});

	it("does not fire onValueChange when the digits are unchanged", () => {
		const onValueChange = vi.fn();
		const screen = render(
			<FormattedInput
				mask={idNumberMask}
				defaultValue="123"
				onValueChange={onValueChange}
			/>,
		);
		const input = queryInput(screen);
		if (!input) throw new Error("input not rendered");

		fireEvent.change(input, { target: { value: "123a" } });

		expect(input.value).toBe("123");
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it("supports controlled usage: display follows the value prop", () => {
		const screen = render(<FormattedInput mask={phoneMask} value="0612" />);
		const input = queryInput(screen);
		expect(input?.value).toBe("06 12");

		screen.rerender(<FormattedInput mask={phoneMask} value="061234" />);
		expect(input?.value).toBe("06 12 34");
	});

	it("forwards backspace over a separator to the digit before it", () => {
		const screen = render(
			<FormattedInput mask={businessIdMask} defaultValue="123456" />,
		);
		const input = queryInput(screen);
		if (!input) throw new Error("input not rendered");
		expect(input.value).toBe("123 456");

		// Caret sits right after the separator ("123 |456"); backspace removes
		// the space, leaving the digits intact: the component must delete the
		// "3" instead and land the caret after "12".
		typeRaw(input, "123456", 3, "deleteContentBackward");

		expect(input.value).toBe("124 56");
		expect(input.selectionStart).toBe(2);
	});

	it("forwards forward-delete over a separator to the digit after it", () => {
		const screen = render(
			<FormattedInput mask={businessIdMask} defaultValue="123456" />,
		);
		const input = queryInput(screen);
		if (!input) throw new Error("input not rendered");

		// Caret before the separator ("123| 456"); delete removes the space:
		// the component must delete the "4" instead.
		typeRaw(input, "123456", 3, "deleteContentForward");

		expect(input.value).toBe("123 56");
		expect(input.selectionStart).toBe(3);
	});

	it("keeps the caret with the typed digit when inserting mid-value", () => {
		const screen = render(
			<FormattedInput mask={businessIdMask} defaultValue="12345" />,
		);
		const input = queryInput(screen);
		if (!input) throw new Error("input not rendered");
		expect(input.value).toBe("123 45");

		// Typing "9" at "12|3 45" yields raw "1293 45" with the caret after the 9.
		typeRaw(input, "1293 45", 3, "insertText");

		expect(input.value).toBe("129 345");
		expect(input.selectionStart).toBe(3);
	});

	it("forwards aria-invalid and disabled to the underlying input", () => {
		const screen = render(
			<FormattedInput mask={businessIdMask} aria-invalid disabled />,
		);
		const input = queryInput(screen);
		expect(input?.getAttribute("aria-invalid")).toBe("true");
		expect(input?.disabled).toBe(true);
	});
});
