// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	ButtonGroup,
	ButtonGroupSeparator,
	ButtonGroupText,
} from "#/components/button-group.tsx";

afterEach(cleanup);

describe("ButtonGroup", () => {
	it("renders a labelled group with the horizontal orientation by default", () => {
		const screen = render(
			<ButtonGroup aria-label="Actions">
				<button type="button">One</button>
			</ButtonGroup>,
		);
		const group = screen.getByRole("group", { name: "Actions" });
		expect(group.getAttribute("data-slot")).toBe("button-group");
		expect(group.getAttribute("data-orientation")).toBe("horizontal");
	});

	it("exposes the vertical orientation as a data attribute", () => {
		const screen = render(
			<ButtonGroup aria-label="Actions" orientation="vertical">
				<button type="button">One</button>
			</ButtonGroup>,
		);
		const group = screen.getByRole("group", { name: "Actions" });
		expect(group.getAttribute("data-orientation")).toBe("vertical");
		expect(group.classList.contains("flex-col")).toBe(true);
	});

	it("merges className onto the group element", () => {
		const screen = render(
			<ButtonGroup aria-label="Actions" className="custom-group-class" />,
		);
		const group = screen.getByRole("group", { name: "Actions" });
		expect(group.classList.contains("custom-group-class")).toBe(true);
		expect(group.classList.contains("items-stretch")).toBe(true);
	});
});

describe("ButtonGroupSeparator", () => {
	function querySeparator(screen: ReturnType<typeof render>) {
		return screen.baseElement.querySelector(
			"[data-slot=button-group-separator]",
		);
	}

	it("defaults to a vertical rule inside a horizontal group", () => {
		const screen = render(
			<ButtonGroup aria-label="Actions">
				<button type="button">One</button>
				<ButtonGroupSeparator />
				<button type="button">Two</button>
			</ButtonGroup>,
		);
		expect(querySeparator(screen)?.getAttribute("data-orientation")).toBe(
			"vertical",
		);
	});

	it("defaults to a horizontal rule inside a vertical group", () => {
		const screen = render(
			<ButtonGroup aria-label="Actions" orientation="vertical">
				<button type="button">One</button>
				<ButtonGroupSeparator />
				<button type="button">Two</button>
			</ButtonGroup>,
		);
		expect(querySeparator(screen)?.getAttribute("data-orientation")).toBe(
			"horizontal",
		);
	});

	it("lets an explicit orientation override the derived one", () => {
		const screen = render(
			<ButtonGroup aria-label="Actions" orientation="vertical">
				<button type="button">One</button>
				<ButtonGroupSeparator orientation="vertical" />
				<button type="button">Two</button>
			</ButtonGroup>,
		);
		expect(querySeparator(screen)?.getAttribute("data-orientation")).toBe(
			"vertical",
		);
	});
});

describe("ButtonGroupText", () => {
	it("renders a div with its slot attribute and children", () => {
		const screen = render(<ButtonGroupText>June 2026</ButtonGroupText>);
		const text = screen.baseElement.querySelector(
			"[data-slot=button-group-text]",
		);
		expect(text?.tagName).toBe("DIV");
		expect(text?.textContent).toBe("June 2026");
	});

	it("renders as a label through the render prop", () => {
		const screen = render(
			// biome-ignore lint/a11y/noLabelWithoutControl: render target only
			<ButtonGroupText render={<label />}>Period</ButtonGroupText>,
		);
		const text = screen.baseElement.querySelector(
			"[data-slot=button-group-text]",
		);
		expect(text?.tagName).toBe("LABEL");
		expect(text?.classList.contains("bg-muted")).toBe(true);
	});
});
