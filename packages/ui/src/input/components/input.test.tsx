// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Input } from "#/input/components/input.tsx";

afterEach(cleanup);

function queryInput(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector<HTMLInputElement>(
		"[data-slot=input]",
	);
}

describe("Input", () => {
	it("renders an input element tagged with data-slot", () => {
		const screen = render(<Input />);
		const input = queryInput(screen);
		expect(input?.tagName).toBe("INPUT");
		expect(input?.getAttribute("data-slot")).toBe("input");
	});

	it("forwards the type and native attributes", () => {
		const screen = render(
			<Input type="email" placeholder="Email" aria-invalid disabled />,
		);
		const input = queryInput(screen);
		expect(input?.getAttribute("type")).toBe("email");
		expect(input?.getAttribute("placeholder")).toBe("Email");
		expect(input?.getAttribute("aria-invalid")).toBe("true");
		expect(input?.disabled).toBe(true);
	});

	it("applies the review's transition and disabled-cursor fixes", () => {
		const screen = render(<Input />);
		const className = queryInput(screen)?.className ?? "";
		// transition now covers the ring (box-shadow), not only colors.
		expect(className).toContain("transition-[color,box-shadow]");
		expect(className).not.toContain("transition-colors");
		// pointer-events-none was dead (it killed cursor-not-allowed); only the
		// cursor hint should remain.
		expect(className).toContain("disabled:cursor-not-allowed");
		expect(className).not.toContain("disabled:pointer-events-none");
	});

	it("merges a consumer className over the base via tailwind-merge", () => {
		const screen = render(<Input className="h-12" />);
		const className = queryInput(screen)?.className ?? "";
		expect(className).toContain("h-12");
		// tailwind-merge drops the conflicting base height.
		expect(className).not.toContain("h-8");
	});

	it("exposes Base UI's onValueChange (typed via InputPrimitive.Props)", () => {
		const onValueChange = vi.fn();
		const screen = render(<Input onValueChange={onValueChange} />);
		const input = queryInput(screen);
		if (!input) throw new Error("input not rendered");

		fireEvent.change(input, { target: { value: "ref-123" } });

		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange.mock.calls[0]?.[0]).toBe("ref-123");
	});
});
