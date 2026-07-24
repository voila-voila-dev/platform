// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "#/components/ui/collapsible.tsx";

function Fixture(props: React.ComponentProps<typeof Collapsible>) {
	return (
		<Collapsible {...props}>
			<CollapsibleTrigger>Toggle applications</CollapsibleTrigger>
			<CollapsibleContent>
				<p>Lea Martin — Developer</p>
			</CollapsibleContent>
		</Collapsible>
	);
}

afterEach(cleanup);

describe("Collapsible", () => {
	it("renders closed without its panel content", () => {
		const screen = render(<Fixture />);
		const trigger = screen.getByRole("button", { name: "Toggle applications" });
		expect(trigger.getAttribute("aria-expanded")).toBe("false");
		expect(screen.queryByText("Lea Martin — Developer")).toBeNull();
	});

	it("opens the panel on trigger click and closes it on a second click", async () => {
		const screen = render(<Fixture />);
		const trigger = screen.getByRole("button", { name: "Toggle applications" });

		fireEvent.click(trigger);
		await waitFor(() => {
			expect(trigger.getAttribute("aria-expanded")).toBe("true");
			expect(screen.getByText("Lea Martin — Developer")).toBeTruthy();
		});

		fireEvent.click(trigger);
		await waitFor(() => {
			expect(trigger.getAttribute("aria-expanded")).toBe("false");
			expect(screen.queryByText("Lea Martin — Developer")).toBeNull();
		});
	});

	it("starts open when defaultOpen is set", () => {
		const screen = render(<Fixture defaultOpen />);
		const trigger = screen.getByRole("button", { name: "Toggle applications" });
		expect(trigger.getAttribute("aria-expanded")).toBe("true");
		expect(screen.getByText("Lea Martin — Developer")).toBeTruthy();
	});

	it("supports controlled open state", async () => {
		const screen = render(<Fixture open={false} />);
		expect(screen.queryByText("Lea Martin — Developer")).toBeNull();

		screen.rerender(<Fixture open />);
		await waitFor(() => {
			expect(screen.getByText("Lea Martin — Developer")).toBeTruthy();
		});
	});

	it("does not open when disabled", async () => {
		const screen = render(<Fixture disabled />);
		const trigger = screen.getByRole("button", { name: "Toggle applications" });
		expect(trigger.hasAttribute("data-disabled")).toBe(true);

		fireEvent.click(trigger);
		await waitFor(() => {
			expect(trigger.getAttribute("aria-expanded")).toBe("false");
			expect(screen.queryByText("Lea Martin — Developer")).toBeNull();
		});
	});

	it("keeps hidden content in the DOM when keepMounted is set", async () => {
		const screen = render(
			<Collapsible>
				<CollapsibleTrigger>Toggle brief</CollapsibleTrigger>
				<CollapsibleContent keepMounted>
					<p>Project brief</p>
				</CollapsibleContent>
			</Collapsible>,
		);
		const panel = screen.container.querySelector(
			"[data-slot=collapsible-content]",
		);
		expect(panel).not.toBeNull();
		expect(panel?.getAttribute("hidden")).not.toBeNull();
		expect(screen.getByText("Project brief", { ignore: "" })).toBeTruthy();
	});

	it("merges className into every slot", () => {
		const screen = render(
			<Collapsible defaultOpen className="custom-root-class">
				<CollapsibleTrigger className="custom-trigger-class">
					Toggle
				</CollapsibleTrigger>
				<CollapsibleContent className="custom-panel-class">
					<p>Body</p>
				</CollapsibleContent>
			</Collapsible>,
		);
		const root = screen.container.querySelector("[data-slot=collapsible]");
		const trigger = screen.container.querySelector(
			"[data-slot=collapsible-trigger]",
		);
		const panel = screen.container.querySelector(
			"[data-slot=collapsible-content]",
		);
		expect(root?.classList.contains("custom-root-class")).toBe(true);
		expect(trigger?.classList.contains("custom-trigger-class")).toBe(true);
		expect(panel?.classList.contains("custom-panel-class")).toBe(true);
	});

	it("keeps the height transition classes on the panel", () => {
		const screen = render(<Fixture defaultOpen />);
		const panel = screen.container.querySelector(
			"[data-slot=collapsible-content]",
		);
		expect(panel?.classList.contains("transition-[height]")).toBe(true);
		expect(panel?.classList.contains("overflow-hidden")).toBe(true);
	});
});
