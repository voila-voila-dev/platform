// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Textarea } from "#/components/ui/textarea.tsx";

afterEach(cleanup);

describe("Textarea", () => {
	it("renders a textarea with its slot attribute", () => {
		const screen = render(<Textarea placeholder="Describe the project" />);
		const textarea = screen.getByPlaceholderText("Describe the project");
		expect(textarea.tagName).toBe("TEXTAREA");
		expect(textarea.getAttribute("data-slot")).toBe("textarea");
	});

	it("bounds the auto-growth between min and max heights", () => {
		const screen = render(<Textarea aria-label="Description" />);
		const textarea = screen.getByRole("textbox", { name: "Description" });
		expect(textarea.classList.contains("field-sizing-content")).toBe(true);
		expect(textarea.classList.contains("min-h-16")).toBe(true);
		expect(textarea.classList.contains("max-h-64")).toBe(true);
	});

	it("accepts typed input", () => {
		const onChange = vi.fn();
		const screen = render(
			<Textarea aria-label="Description" onChange={onChange} />,
		);
		const textarea = screen.getByRole("textbox", {
			name: "Description",
		}) as HTMLTextAreaElement;
		fireEvent.change(textarea, { target: { value: "Pitch-side cover" } });
		expect(onChange).toHaveBeenCalled();
		expect(textarea.value).toBe("Pitch-side cover");
	});

	it("passes native attributes through", () => {
		const screen = render(
			<Textarea aria-label="Description" maxLength={500} rows={6} />,
		);
		const textarea = screen.getByRole("textbox", { name: "Description" });
		expect(textarea.getAttribute("maxlength")).toBe("500");
		expect(textarea.getAttribute("rows")).toBe("6");
	});

	it("keeps the cursor affordance when disabled", () => {
		const screen = render(<Textarea aria-label="Description" disabled />);
		const textarea = screen.getByRole("textbox", { name: "Description" });
		expect(textarea.hasAttribute("disabled")).toBe(true);
		expect(textarea.classList.contains("disabled:cursor-not-allowed")).toBe(
			true,
		);
	});

	it("marks invalid state for the destructive styles", () => {
		const screen = render(<Textarea aria-label="Description" aria-invalid />);
		const textarea = screen.getByRole("textbox", { name: "Description" });
		expect(textarea.getAttribute("aria-invalid")).toBe("true");
		expect(textarea.classList.contains("aria-invalid:border-destructive")).toBe(
			true,
		);
		expect(textarea.classList.contains("aria-invalid:ring-3")).toBe(true);
	});

	it("merges className over the defaults", () => {
		const screen = render(
			<Textarea aria-label="Description" className="max-h-96" />,
		);
		const textarea = screen.getByRole("textbox", { name: "Description" });
		expect(textarea.classList.contains("max-h-96")).toBe(true);
		expect(textarea.classList.contains("max-h-64")).toBe(false);
	});
});
