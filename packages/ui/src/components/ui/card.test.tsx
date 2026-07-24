// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
	return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

function FullCard(props: { size?: "default" | "sm" }) {
	return (
		<Card size={props.size}>
			<CardHeader>
				<CardTitle>Product designer</CardTitle>
				<CardDescription>Northwind Labs</CardDescription>
				<CardAction>Open</CardAction>
			</CardHeader>
			<CardContent>Pitch-side coverage</CardContent>
			<CardFooter>Apply</CardFooter>
		</Card>
	);
}

describe("Card", () => {
	it("renders a card div tagged with data-slot and the default size", () => {
		const screen = render(<Card>Project</Card>);
		const card = queryBySlot(screen, "card");
		expect(card?.tagName).toBe("DIV");
		expect(card?.getAttribute("data-size")).toBe("default");
		expect(card?.textContent).toBe("Project");
	});

	it("exposes size sm as a data attribute that cascades via group/card", () => {
		const screen = render(<Card size="sm">Project</Card>);
		const card = queryBySlot(screen, "card");
		expect(card?.getAttribute("data-size")).toBe("sm");
		// The group marker is what lets group-data-[size=sm]/card:* reach children.
		expect(card?.classList.contains("group/card")).toBe(true);
	});

	it("renders every subcomponent with its data-slot intact", () => {
		const screen = render(<FullCard />);
		for (const slot of [
			"card-header",
			"card-title",
			"card-description",
			"card-action",
			"card-content",
			"card-footer",
		]) {
			expect(queryBySlot(screen, slot)).not.toBeNull();
		}
	});

	it("keeps the structural slots the padding contracts key off", () => {
		// Card's has-data-[slot=card-footer]:pb-0 and the header's
		// has-data-[slot=card-action] grid both depend on these attributes.
		const screen = render(<FullCard />);
		expect(queryBySlot(screen, "card-footer")?.getAttribute("data-slot")).toBe(
			"card-footer",
		);
		expect(queryBySlot(screen, "card-action")?.getAttribute("data-slot")).toBe(
			"card-action",
		);
	});

	it("lets CardTitle become a semantic heading via the render prop", () => {
		const screen = render(<CardTitle render={<h2>Launch day</h2>} />);
		const title = queryBySlot(screen, "card-title");
		expect(title?.tagName).toBe("H2");
		expect(title?.textContent).toBe("Launch day");
	});

	it("lets the card root render as a different element via render", () => {
		const screen = render(<Card render={<article />}>Project</Card>);
		const card = queryBySlot(screen, "card");
		expect(card?.tagName).toBe("ARTICLE");
		expect(card?.getAttribute("data-size")).toBe("default");
	});

	it("merges a consumer className over the base classes", () => {
		const screen = render(<Card className="custom-card">Project</Card>);
		const card = queryBySlot(screen, "card");
		expect(card?.classList.contains("custom-card")).toBe(true);
		expect(card?.classList.contains("rounded-xl")).toBe(true);
	});
});
