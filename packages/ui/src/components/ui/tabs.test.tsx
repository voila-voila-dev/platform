// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "#/components/ui/tabs.tsx";

afterEach(cleanup);

function Fixture(props: React.ComponentProps<typeof Tabs>) {
	return (
		<Tabs defaultValue="projects" {...props}>
			<TabsList>
				<TabsTrigger value="projects">Projects</TabsTrigger>
				<TabsTrigger value="freelancers">Freelancers</TabsTrigger>
				<TabsTrigger value="billing" disabled>
					Billing
				</TabsTrigger>
			</TabsList>
			<TabsContent value="projects">Projects panel</TabsContent>
			<TabsContent value="freelancers">Freelancers panel</TabsContent>
			<TabsContent value="billing">Billing panel</TabsContent>
		</Tabs>
	);
}

describe("Tabs", () => {
	it("marks the default tab active and shows only its panel", () => {
		const screen = render(<Fixture />);
		const projects = screen.getByRole("tab", { name: "Projects" });
		expect(projects.getAttribute("aria-selected")).toBe("true");
		expect(projects.hasAttribute("data-active")).toBe(true);
		expect(screen.getByText("Projects panel")).toBeTruthy();
		expect(screen.queryByText("Freelancers panel")).toBeNull();
	});

	it("switches the active panel on trigger click", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("tab", { name: "Freelancers" }));
		await waitFor(() => {
			expect(screen.getByText("Freelancers panel")).toBeTruthy();
			expect(screen.queryByText("Projects panel")).toBeNull();
		});
	});

	it("does not activate a disabled trigger", async () => {
		const screen = render(<Fixture />);
		const billing = screen.getByRole("tab", { name: "Billing" });
		// Base UI emits data-disabled/aria-disabled, never the native attribute.
		expect(billing.hasAttribute("data-disabled")).toBe(true);
		expect(billing.getAttribute("aria-disabled")).toBe("true");
		fireEvent.click(billing);
		await waitFor(() => {
			expect(screen.queryByText("Billing panel")).toBeNull();
			expect(screen.getByText("Projects panel")).toBeTruthy();
		});
	});

	it("forwards orientation to Base UI instead of faking the attribute", () => {
		const screen = render(<Fixture orientation="vertical" />);
		const root = screen.baseElement.querySelector("[data-slot=tabs]");
		expect(root?.getAttribute("data-orientation")).toBe("vertical");
		expect(screen.getByRole("tablist").getAttribute("aria-orientation")).toBe(
			"vertical",
		);
	});

	it("emits the horizontal orientation from the primitive by default", () => {
		const screen = render(<Fixture />);
		const root = screen.baseElement.querySelector("[data-slot=tabs]");
		expect(root?.getAttribute("data-orientation")).toBe("horizontal");
	});

	it("exposes the list variant as a data attribute", () => {
		const screen = render(
			<Tabs defaultValue="one">
				<TabsList variant="line">
					<TabsTrigger value="one">One</TabsTrigger>
				</TabsList>
				<TabsContent value="one">One panel</TabsContent>
			</Tabs>,
		);
		expect(screen.getByRole("tablist").getAttribute("data-variant")).toBe(
			"line",
		);
	});

	it("merges className across all slots", () => {
		const screen = render(
			<Tabs defaultValue="one" className="custom-root">
				<TabsList className="custom-list">
					<TabsTrigger value="one" className="custom-trigger">
						One
					</TabsTrigger>
				</TabsList>
				<TabsContent value="one" className="custom-content">
					One panel
				</TabsContent>
			</Tabs>,
		);
		expect(
			screen.baseElement
				.querySelector("[data-slot=tabs]")
				?.classList.contains("custom-root"),
		).toBe(true);
		expect(screen.getByRole("tablist").classList.contains("custom-list")).toBe(
			true,
		);
		expect(
			screen
				.getByRole("tab", { name: "One" })
				.classList.contains("custom-trigger"),
		).toBe(true);
		expect(
			screen.getByText("One panel").classList.contains("custom-content"),
		).toBe(true);
	});
});
