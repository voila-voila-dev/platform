// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "#/components/ui/button.tsx";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "#/components/ui/tooltip.tsx";

afterEach(cleanup);

function queryContent() {
	return document.querySelector("[data-slot=tooltip-content]");
}

describe("Tooltip", () => {
	it("works without an explicit provider thanks to the embedded one", () => {
		const screen = render(
			<Tooltip defaultOpen>
				<TooltipTrigger>Status</TooltipTrigger>
				<TooltipContent>Awaiting confirmation</TooltipContent>
			</Tooltip>,
		);
		expect(screen.getByText("Status")).toBeTruthy();
		expect(queryContent()?.textContent).toContain("Awaiting confirmation");
	});

	it("keeps the popup out of the DOM while closed", () => {
		render(
			<Tooltip>
				<TooltipTrigger>Status</TooltipTrigger>
				<TooltipContent>Hidden until opened</TooltipContent>
			</Tooltip>,
		);
		expect(queryContent()).toBeNull();
	});

	it("respects a controlled open prop", () => {
		const screen = render(
			<Tooltip open>
				<TooltipTrigger>Status</TooltipTrigger>
				<TooltipContent>Controlled content</TooltipContent>
			</Tooltip>,
		);
		expect(queryContent()).not.toBeNull();
		screen.rerender(
			<Tooltip open={false}>
				<TooltipTrigger>Status</TooltipTrigger>
				<TooltipContent>Controlled content</TooltipContent>
			</Tooltip>,
		);
		expect(queryContent()).toBeNull();
	});

	it("exposes the resolved side as a data attribute on the popup", () => {
		render(
			<Tooltip defaultOpen>
				<TooltipTrigger>Status</TooltipTrigger>
				<TooltipContent side="bottom">Below the trigger</TooltipContent>
			</Tooltip>,
		);
		expect(queryContent()?.getAttribute("data-side")).toBe("bottom");
	});

	it("merges className onto the popup", () => {
		render(
			<Tooltip defaultOpen>
				<TooltipTrigger>Status</TooltipTrigger>
				<TooltipContent className="custom-tooltip-class">Hello</TooltipContent>
			</Tooltip>,
		);
		const content = queryContent();
		expect(content?.classList.contains("custom-tooltip-class")).toBe(true);
		expect(content?.classList.contains("max-w-xs")).toBe(true);
	});

	it("composes the trigger with a real button through the render prop", () => {
		const screen = render(
			<Tooltip defaultOpen>
				<TooltipTrigger render={<Button variant="outline" />}>
					Hover me
				</TooltipTrigger>
				<TooltipContent>Composed trigger</TooltipContent>
			</Tooltip>,
		);
		const buttons = screen.getAllByRole("button", { name: "Hover me" });
		expect(buttons.length).toBe(1);
		expect(buttons[0]?.getAttribute("data-slot")).toBe("tooltip-trigger");
		expect(buttons[0]?.classList.contains("border-border")).toBe(true);
	});
});
