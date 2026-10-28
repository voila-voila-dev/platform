// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Field } from "#/field/components/field.tsx";

afterEach(cleanup);

const querySlot = (screen: ReturnType<typeof render>, slot: string) =>
	screen.baseElement.querySelector(`[data-slot=${slot}]`);

describe("Field", () => {
	it("renders a group with the vertical orientation by default", () => {
		const screen = render(<Field.Root>content</Field.Root>);
		const field = querySlot(screen, "field");
		expect(field).toBeTruthy();
		expect(field?.getAttribute("role")).toBe("group");
		expect(field?.getAttribute("data-orientation")).toBe("vertical");
	});

	it("applies the requested orientation", () => {
		for (const orientation of ["horizontal", "responsive"] as const) {
			const screen = render(<Field.Root orientation={orientation} />);
			expect(querySlot(screen, "field")?.getAttribute("data-orientation")).toBe(
				orientation,
			);
			cleanup();
		}
	});

	it("sets data-invalid from the invalid prop", () => {
		// Regression: consumers used to have to pass the raw `data-invalid`
		// attribute themselves alongside aria-invalid on the control.
		const screen = render(<Field.Root invalid />);
		expect(querySlot(screen, "field")?.getAttribute("data-invalid")).toBe(
			"true",
		);
	});

	it("omits data-invalid when the field is valid", () => {
		const screen = render(<Field.Root />);
		expect(querySlot(screen, "field")?.hasAttribute("data-invalid")).toBe(
			false,
		);
	});

	it("merges className onto the root", () => {
		const screen = render(<Field.Root className="custom-field" />);
		expect(querySlot(screen, "field")?.classList.contains("custom-field")).toBe(
			true,
		);
	});
});

describe("Field.Title", () => {
	it("uses its own field-title slot, not field-label", () => {
		// Regression: Field.Title shared Field.Label's slot, so orientation rules
		// targeting [data-slot=field-label] also matched titles.
		const screen = render(<Field.Title>Notifications</Field.Title>);
		expect(querySlot(screen, "field-title")).toBeTruthy();
		expect(querySlot(screen, "field-label")).toBeNull();
	});
});

describe("Field.Label", () => {
	it("renders a label with the field-label slot", () => {
		const screen = render(
			<Field.Label htmlFor="client-name">Client</Field.Label>,
		);
		const label = querySlot(screen, "field-label");
		expect(label?.tagName).toBe("LABEL");
		expect(label?.getAttribute("for")).toBe("client-name");
	});
});

describe("Field.Legend", () => {
	it("defaults to the legend variant", () => {
		const screen = render(
			<Field.Set>
				<Field.Legend>Availability</Field.Legend>
			</Field.Set>,
		);
		const legend = querySlot(screen, "field-legend");
		expect(legend?.tagName).toBe("LEGEND");
		expect(legend?.getAttribute("data-variant")).toBe("legend");
		expect(legend?.classList.contains("text-base")).toBe(true);
	});

	it("sizes down with the label variant", () => {
		const screen = render(
			<Field.Set>
				<Field.Legend variant="label">Availability</Field.Legend>
			</Field.Set>,
		);
		const legend = querySlot(screen, "field-legend");
		expect(legend?.getAttribute("data-variant")).toBe("label");
		expect(legend?.classList.contains("text-sm")).toBe(true);
	});
});

describe("Field.Description", () => {
	it("renders a real <p> matching its props type", () => {
		const screen = render(<Field.Description>Hint.</Field.Description>);
		const description = querySlot(screen, "field-description");
		expect(description?.tagName).toBe("P");
		expect(description?.textContent).toBe("Hint.");
	});
});

describe("Field.Separator", () => {
	it("renders a separator without content", () => {
		const screen = render(<Field.Separator />);
		const separator = querySlot(screen, "field-separator");
		expect(separator?.getAttribute("data-content")).toBe("false");
		expect(querySlot(screen, "field-separator-content")).toBeNull();
	});

	it("renders inline content over the rule", () => {
		const screen = render(<Field.Separator>Optional</Field.Separator>);
		const separator = querySlot(screen, "field-separator");
		expect(separator?.getAttribute("data-content")).toBe("true");
		expect(querySlot(screen, "field-separator-content")?.textContent).toBe(
			"Optional",
		);
	});
});

describe("Field.Error", () => {
	it("renders nothing without children or errors", () => {
		const screen = render(<Field.Error />);
		expect(querySlot(screen, "field-error")).toBeNull();
	});

	it("renders nothing for an empty errors array", () => {
		const screen = render(<Field.Error errors={[]} />);
		expect(querySlot(screen, "field-error")).toBeNull();
	});

	it("renders a single error as plain text with role=alert", () => {
		const screen = render(
			<Field.Error errors={[{ message: "VAT number must be 11 digits." }]} />,
		);
		const error = querySlot(screen, "field-error");
		expect(error?.getAttribute("role")).toBe("alert");
		expect(error?.textContent).toBe("VAT number must be 11 digits.");
		expect(error?.querySelector("ul")).toBeNull();
	});

	it("renders multiple errors as a list", () => {
		const screen = render(
			<Field.Error
				errors={[{ message: "Too short." }, { message: "Needs a number." }]}
			/>,
		);
		const items = querySlot(screen, "field-error")?.querySelectorAll("li");
		expect(items?.length).toBe(2);
		expect(items?.[0]?.textContent).toBe("Too short.");
		expect(items?.[1]?.textContent).toBe("Needs a number.");
	});

	it("deduplicates errors by message", () => {
		const screen = render(
			<Field.Error
				errors={[
					{ message: "Needs a number." },
					{ message: "Needs a number." },
				]}
			/>,
		);
		const error = querySlot(screen, "field-error");
		expect(error?.querySelector("ul")).toBeNull();
		expect(error?.textContent).toBe("Needs a number.");
	});

	it("prefers children over errors", () => {
		const screen = render(
			<Field.Error errors={[{ message: "Ignored." }]}>
				Custom error
			</Field.Error>,
		);
		expect(querySlot(screen, "field-error")?.textContent).toBe("Custom error");
	});

	it("accepts an id for aria-describedby wiring", () => {
		const screen = render(
			<Field.Error id="vat-error" errors={[{ message: "Invalid." }]} />,
		);
		expect(querySlot(screen, "field-error")?.id).toBe("vat-error");
	});
});

describe("Field.Set, Field.Group and Field.Content", () => {
	it("render their slots and merge className", () => {
		const screen = render(
			<Field.Set className="custom-set">
				<Field.Group className="custom-group">
					<Field.Content className="custom-content">body</Field.Content>
				</Field.Group>
			</Field.Set>,
		);
		expect(querySlot(screen, "field-set")?.tagName).toBe("FIELDSET");
		expect(
			querySlot(screen, "field-set")?.classList.contains("custom-set"),
		).toBe(true);
		expect(
			querySlot(screen, "field-group")?.classList.contains("custom-group"),
		).toBe(true);
		expect(
			querySlot(screen, "field-content")?.classList.contains("custom-content"),
		).toBe(true);
	});
});
