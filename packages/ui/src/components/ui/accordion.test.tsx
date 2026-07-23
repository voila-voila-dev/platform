// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion.tsx";

function Fixture(props: React.ComponentProps<typeof Accordion>) {
	return (
		<Accordion {...props}>
			<AccordionItem value="first">
				<AccordionTrigger>First question</AccordionTrigger>
				<AccordionContent>
					<p>First answer</p>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="second">
				<AccordionTrigger>Second question</AccordionTrigger>
				<AccordionContent>
					<p>Second answer</p>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}

afterEach(cleanup);

describe("Accordion", () => {
	it("renders closed items without their panel content", () => {
		const screen = render(<Fixture />);
		expect(screen.getByRole("button", { name: "First question" })).toBeTruthy();
		expect(screen.queryByText("First answer")).toBeNull();
	});

	it("opens a panel on trigger click and closes it on a second click", async () => {
		const screen = render(<Fixture />);
		const trigger = screen.getByRole("button", { name: "First question" });

		fireEvent.click(trigger);
		await waitFor(() => {
			expect(trigger.getAttribute("aria-expanded")).toBe("true");
			expect(screen.getByText("First answer")).toBeTruthy();
		});

		fireEvent.click(trigger);
		await waitFor(() => {
			expect(trigger.getAttribute("aria-expanded")).toBe("false");
			expect(screen.queryByText("First answer")).toBeNull();
		});
	});

	it("only keeps one item open at a time by default", async () => {
		const screen = render(<Fixture defaultValue={["first"]} />);
		expect(screen.getByText("First answer")).toBeTruthy();

		fireEvent.click(screen.getByRole("button", { name: "Second question" }));
		await waitFor(() => {
			expect(screen.getByText("Second answer")).toBeTruthy();
			expect(screen.queryByText("First answer")).toBeNull();
		});
	});

	it("keeps several items open when multiple is set", async () => {
		const screen = render(<Fixture multiple defaultValue={["first"]} />);

		fireEvent.click(screen.getByRole("button", { name: "Second question" }));
		await waitFor(() => {
			expect(screen.getByText("First answer")).toBeTruthy();
			expect(screen.getByText("Second answer")).toBeTruthy();
		});
	});

	it("does not open a disabled item", async () => {
		const screen = render(
			<Accordion>
				<AccordionItem value="locked" disabled>
					<AccordionTrigger>Locked question</AccordionTrigger>
					<AccordionContent>
						<p>Locked answer</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>,
		);
		const trigger = screen.getByRole("button", { name: "Locked question" });
		expect(trigger.getAttribute("aria-disabled")).toBe("true");

		fireEvent.click(trigger);
		await waitFor(() => {
			expect(trigger.getAttribute("aria-expanded")).toBe("false");
			expect(screen.queryByText("Locked answer")).toBeNull();
		});
	});

	it("renders a single rotating caret icon in the trigger", () => {
		const screen = render(<Fixture />);
		const trigger = screen.getByRole("button", { name: "First question" });
		const icons = trigger.querySelectorAll(
			"[data-slot=accordion-trigger-icon]",
		);
		expect(icons.length).toBe(1);
	});

	it("merges className into the outermost panel slot", async () => {
		const screen = render(
			<Accordion defaultValue={["styled"]}>
				<AccordionItem value="styled">
					<AccordionTrigger>Styled question</AccordionTrigger>
					<AccordionContent className="custom-panel-class">
						<p>Styled answer</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>,
		);
		const panel = screen.container.querySelector(
			"[data-slot=accordion-content]",
		);
		expect(panel).not.toBeNull();
		expect(panel?.classList.contains("custom-panel-class")).toBe(true);
	});
});
