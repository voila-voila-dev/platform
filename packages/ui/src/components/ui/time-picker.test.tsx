// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TimePicker } from "#/components/ui/time-picker.tsx";

beforeEach(() => {
	// Base UI's Positioner measures the anchor with ResizeObserver, absent in jsdom.
	vi.stubGlobal(
		"ResizeObserver",
		class {
			observe() {}
			unobserve() {}
			disconnect() {}
		},
	);
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

const queryTrigger = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector("[data-slot=time-picker-trigger]");

const queryContent = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector("[data-slot=time-picker-content]");

const queryOptions = (screen: ReturnType<typeof render>) =>
	Array.from(screen.baseElement.querySelectorAll("[role=option]"));

describe("TimePicker", () => {
	it("shows the placeholder and marks the trigger empty when nothing is selected", () => {
		const screen = render(<TimePicker placeholder="Start time" />);
		const trigger = queryTrigger(screen);
		expect(trigger?.textContent).toContain("Start time");
		expect(trigger?.getAttribute("data-empty")).toBe("true");
	});

	it("formats the selected time on the trigger (Intl short time, en default)", () => {
		const screen = render(<TimePicker defaultValue="14:30" />);
		const trigger = queryTrigger(screen);
		expect(trigger?.textContent).toContain("2:30 PM");
		expect(trigger?.getAttribute("data-empty")).toBeNull();
	});

	it("formats the trigger label with the provided locale", () => {
		const screen = render(<TimePicker locale="fr-FR" defaultValue="14:30" />);
		expect(queryTrigger(screen)?.textContent).toContain("14:30");
		expect(queryTrigger(screen)?.textContent).not.toContain("PM");
	});

	it("defaults the trigger to the outline button variant", () => {
		const screen = render(<TimePicker />);
		expect(queryTrigger(screen)?.getAttribute("data-variant")).toBe("outline");
	});

	it("lists options from min to max inclusive at the given step", async () => {
		const screen = render(
			<TimePicker min="09:00" max="11:00" step={30} defaultOpen />,
		);
		await waitFor(() => {
			expect(queryOptions(screen).map((option) => option.textContent)).toEqual([
				"9:00 AM",
				"9:30 AM",
				"10:00 AM",
				"10:30 AM",
				"11:00 AM",
			]);
		});
	});

	it("marks the matching option as selected", async () => {
		const screen = render(
			<TimePicker min="09:00" max="11:00" defaultValue="10:00" defaultOpen />,
		);
		await waitFor(() => {
			const selected = screen.baseElement.querySelector(
				"[role=option][aria-selected=true]",
			);
			expect(selected?.textContent).toBe("10:00 AM");
			expect(selected?.getAttribute("data-selected")).toBe("true");
		});
	});

	it("selecting an option fires onValueChange, updates the label, and closes", async () => {
		const onValueChange = vi.fn();
		const screen = render(
			<TimePicker min="09:00" max="11:00" onValueChange={onValueChange} />,
		);
		fireEvent.click(queryTrigger(screen) as Element);
		await waitFor(() => {
			expect(queryOptions(screen).length).toBeGreaterThan(0);
		});

		const target = queryOptions(screen).find(
			(option) => option.textContent === "9:30 AM",
		);
		fireEvent.click(target as Element);
		await waitFor(() => {
			expect(queryContent(screen)).toBeNull();
		});
		expect(onValueChange).toHaveBeenCalledWith("09:30");
		expect(queryTrigger(screen)?.textContent).toContain("9:30 AM");
	});

	it("serializes the value into a hidden form input as HH:mm", () => {
		const screen = render(<TimePicker name="startTime" defaultValue="09:30" />);
		const input = screen.baseElement.querySelector(
			'input[type=hidden][name="startTime"]',
		) as HTMLInputElement;
		expect(input).not.toBeNull();
		expect(input.value).toBe("09:30");
	});

	it("does not open when disabled", () => {
		const screen = render(<TimePicker disabled />);
		const trigger = queryTrigger(screen) as HTMLButtonElement;
		expect(trigger.disabled).toBe(true);
		fireEvent.click(trigger);
		expect(queryContent(screen)).toBeNull();
	});

	it("falls back to a 30-minute step when given a non-positive step", async () => {
		const screen = render(
			<TimePicker min="09:00" max="10:00" step={0} defaultOpen />,
		);
		await waitFor(() => {
			expect(queryOptions(screen).length).toBe(3);
		});
	});

	it("renders an unparseable controlled value verbatim", () => {
		const screen = render(<TimePicker value="not-a-time" />);
		expect(queryTrigger(screen)?.textContent).toContain("not-a-time");
	});
});
