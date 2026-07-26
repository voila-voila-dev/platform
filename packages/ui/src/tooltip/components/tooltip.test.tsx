// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "#/button/components/button.tsx";
import { Tooltip } from "#/tooltip/components/tooltip.tsx";

afterEach(cleanup);

function queryContent() {
	return document.querySelector("[data-slot=tooltip-content]");
}

describe("Tooltip", () => {
	it("works without an explicit provider thanks to the embedded one", () => {
		const screen = render(
			<Tooltip.Root defaultOpen>
				<Tooltip.Trigger>Status</Tooltip.Trigger>
				<Tooltip.Content>Awaiting confirmation</Tooltip.Content>
			</Tooltip.Root>,
		);
		expect(screen.getByText("Status")).toBeTruthy();
		expect(queryContent()?.textContent).toContain("Awaiting confirmation");
	});

	it("keeps the popup out of the DOM while closed", () => {
		render(
			<Tooltip.Root>
				<Tooltip.Trigger>Status</Tooltip.Trigger>
				<Tooltip.Content>Hidden until opened</Tooltip.Content>
			</Tooltip.Root>,
		);
		expect(queryContent()).toBeNull();
	});

	it("respects a controlled open prop", () => {
		const screen = render(
			<Tooltip.Root open>
				<Tooltip.Trigger>Status</Tooltip.Trigger>
				<Tooltip.Content>Controlled content</Tooltip.Content>
			</Tooltip.Root>,
		);
		expect(queryContent()).not.toBeNull();
		screen.rerender(
			<Tooltip.Root open={false}>
				<Tooltip.Trigger>Status</Tooltip.Trigger>
				<Tooltip.Content>Controlled content</Tooltip.Content>
			</Tooltip.Root>,
		);
		expect(queryContent()).toBeNull();
	});

	it("exposes the resolved side as a data attribute on the popup", () => {
		render(
			<Tooltip.Root defaultOpen>
				<Tooltip.Trigger>Status</Tooltip.Trigger>
				<Tooltip.Content side="bottom">Below the trigger</Tooltip.Content>
			</Tooltip.Root>,
		);
		expect(queryContent()?.getAttribute("data-side")).toBe("bottom");
	});

	it("merges className onto the popup", () => {
		render(
			<Tooltip.Root defaultOpen>
				<Tooltip.Trigger>Status</Tooltip.Trigger>
				<Tooltip.Content className="custom-tooltip-class">
					Hello
				</Tooltip.Content>
			</Tooltip.Root>,
		);
		const content = queryContent();
		expect(content?.classList.contains("custom-tooltip-class")).toBe(true);
		expect(content?.classList.contains("max-w-xs")).toBe(true);
	});

	it("composes the trigger with a real button through the render prop", () => {
		const screen = render(
			<Tooltip.Root defaultOpen>
				<Tooltip.Trigger render={<Button variant="outline" />}>
					Hover me
				</Tooltip.Trigger>
				<Tooltip.Content>Composed trigger</Tooltip.Content>
			</Tooltip.Root>,
		);
		const buttons = screen.getAllByRole("button", { name: "Hover me" });
		expect(buttons.length).toBe(1);
		expect(buttons[0]?.getAttribute("data-slot")).toBe("tooltip-trigger");
		expect(buttons[0]?.classList.contains("border-border")).toBe(true);
	});
});
