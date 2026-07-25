// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	NativeDatePicker,
	NativeDateTimePicker,
	NativeTimePicker,
} from "#/components/native-date-picker.tsx";

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

function queryInput(screen: ReturnType<typeof render>, slot: string) {
	return screen.baseElement.querySelector(
		`input[data-slot=${slot}]`,
	) as HTMLInputElement | null;
}

describe("NativeDatePicker", () => {
	it("renders a native date input with a leading calendar icon", () => {
		const screen = render(<NativeDatePicker />);
		const input = queryInput(screen, "native-date-picker");
		expect(input?.type).toBe("date");
		expect(
			screen.baseElement.querySelector(
				"[data-slot=native-date-picker-icon] svg",
			),
		).not.toBeNull();
	});

	it("merges className onto the input and wrapperClassName onto the wrapper", () => {
		const screen = render(
			<NativeDatePicker className="custom-input" wrapperClassName="w-full" />,
		);
		const input = queryInput(screen, "native-date-picker");
		expect(input?.classList.contains("custom-input")).toBe(true);
		const wrapper = screen.baseElement.querySelector(
			"[data-slot=native-date-picker-wrapper]",
		);
		expect(wrapper?.classList.contains("w-full")).toBe(true);
	});

	it("forwards native input props (name, min, max, required, aria-invalid)", () => {
		const screen = render(
			<NativeDatePicker
				name="missionDate"
				min="2026-06-01"
				max="2026-06-30"
				required
				aria-invalid
			/>,
		);
		const input = queryInput(screen, "native-date-picker");
		expect(input?.name).toBe("missionDate");
		expect(input?.min).toBe("2026-06-01");
		expect(input?.max).toBe("2026-06-30");
		expect(input?.required).toBe(true);
		expect(input?.getAttribute("aria-invalid")).toBe("true");
	});

	it("fires onChange with the picked value", () => {
		const onChange = vi.fn();
		const screen = render(<NativeDatePicker onChange={onChange} />);
		const input = queryInput(screen, "native-date-picker") as HTMLInputElement;
		fireEvent.change(input, { target: { value: "2026-06-20" } });
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(input.value).toBe("2026-06-20");
	});

	it("opens the native picker on click via showPicker", () => {
		const showPicker = vi.fn();
		HTMLInputElement.prototype.showPicker = showPicker;
		const screen = render(<NativeDatePicker />);
		fireEvent.click(
			queryInput(screen, "native-date-picker") as HTMLInputElement,
		);
		expect(showPicker).toHaveBeenCalledTimes(1);
	});

	it("skips showPicker when the click handler prevents default", () => {
		const showPicker = vi.fn();
		HTMLInputElement.prototype.showPicker = showPicker;
		const screen = render(
			<NativeDatePicker onClick={(event) => event.preventDefault()} />,
		);
		fireEvent.click(
			queryInput(screen, "native-date-picker") as HTMLInputElement,
		);
		expect(showPicker).not.toHaveBeenCalled();
	});

	it("exposes the size on both the wrapper and the input", () => {
		const screen = render(<NativeDatePicker size="sm" />);
		const input = queryInput(screen, "native-date-picker");
		expect(input?.getAttribute("data-size")).toBe("sm");
		const wrapper = screen.baseElement.querySelector(
			"[data-slot=native-date-picker-wrapper]",
		);
		expect(wrapper?.getAttribute("data-size")).toBe("sm");
	});

	it("hides the WebKit indicator (the whole field is the affordance)", () => {
		const screen = render(<NativeDatePicker />);
		const input = queryInput(screen, "native-date-picker");
		expect(
			input?.classList.contains(
				"[&::-webkit-calendar-picker-indicator]:hidden",
			),
		).toBe(true);
	});
});

describe("NativeTimePicker", () => {
	it("renders a native time input with a clock icon", () => {
		const screen = render(<NativeTimePicker />);
		const input = queryInput(screen, "native-time-picker");
		expect(input?.type).toBe("time");
		expect(
			screen.baseElement.querySelector(
				"[data-slot=native-time-picker-icon] svg",
			),
		).not.toBeNull();
	});

	it("forwards step and fires onChange with the picked value", () => {
		const onChange = vi.fn();
		const screen = render(<NativeTimePicker step={900} onChange={onChange} />);
		const input = queryInput(screen, "native-time-picker") as HTMLInputElement;
		expect(input.step).toBe("900");
		fireEvent.change(input, { target: { value: "14:30" } });
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(input.value).toBe("14:30");
	});
});

describe("NativeDateTimePicker", () => {
	it("renders a native datetime-local input", () => {
		const screen = render(<NativeDateTimePicker />);
		const input = queryInput(screen, "native-date-time-picker");
		expect(input?.type).toBe("datetime-local");
		expect(
			screen.baseElement.querySelector(
				"[data-slot=native-date-time-picker-icon] svg",
			),
		).not.toBeNull();
	});

	it("fires onChange with the picked value", () => {
		const onChange = vi.fn();
		const screen = render(<NativeDateTimePicker onChange={onChange} />);
		const input = queryInput(
			screen,
			"native-date-time-picker",
		) as HTMLInputElement;
		fireEvent.change(input, { target: { value: "2026-06-20T14:30" } });
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(input.value).toBe("2026-06-20T14:30");
	});
});
