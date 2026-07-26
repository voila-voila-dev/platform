// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Accordion } from "#/accordion/components/accordion.tsx";

function Fixture(props: React.ComponentProps<typeof Accordion.Root>) {
	return (
		<Accordion.Root {...props}>
			<Accordion.Item value="first">
				<Accordion.Trigger>First question</Accordion.Trigger>
				<Accordion.Content>
					<p>First answer</p>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="second">
				<Accordion.Trigger>Second question</Accordion.Trigger>
				<Accordion.Content>
					<p>Second answer</p>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
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
			<Accordion.Root>
				<Accordion.Item value="locked" disabled>
					<Accordion.Trigger>Locked question</Accordion.Trigger>
					<Accordion.Content>
						<p>Locked answer</p>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>,
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
			<Accordion.Root defaultValue={["styled"]}>
				<Accordion.Item value="styled">
					<Accordion.Trigger>Styled question</Accordion.Trigger>
					<Accordion.Content className="custom-panel-class">
						<p>Styled answer</p>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>,
		);
		const panel = screen.container.querySelector(
			"[data-slot=accordion-content]",
		);
		expect(panel).not.toBeNull();
		expect(panel?.classList.contains("custom-panel-class")).toBe(true);
	});
});
