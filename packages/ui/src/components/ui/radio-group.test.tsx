// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	RadioGroup,
	RadioGroupCard,
	RadioGroupItem,
} from "#/components/ui/radio-group.tsx";

afterEach(cleanup);

function queryGroup(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector("[data-slot=radio-group]");
}

function queryItems(screen: ReturnType<typeof render>) {
	return Array.from(
		screen.baseElement.querySelectorAll("[data-slot=radio-group-item]"),
	);
}

function renderGroup(props?: React.ComponentProps<typeof RadioGroup>) {
	return render(
		<RadioGroup {...props}>
			<RadioGroupItem value="a" />
			<RadioGroupItem value="b" />
		</RadioGroup>,
	);
}

describe("RadioGroup", () => {
	it("renders a radiogroup with its radio items", () => {
		const screen = renderGroup();
		const group = queryGroup(screen);
		expect(group?.getAttribute("role")).toBe("radiogroup");
		const items = queryItems(screen);
		expect(items).toHaveLength(2);
		for (const item of items) {
			expect(item.getAttribute("role")).toBe("radio");
		}
	});

	it("marks the defaultValue item as checked", () => {
		const screen = renderGroup({ defaultValue: "a" });
		const [first, second] = queryItems(screen);
		expect(first?.getAttribute("aria-checked")).toBe("true");
		expect(first?.hasAttribute("data-checked")).toBe(true);
		expect(second?.getAttribute("aria-checked")).toBe("false");
	});

	it("defaults to a vertical grid layout", () => {
		const screen = renderGroup();
		const group = queryGroup(screen);
		expect(group?.getAttribute("data-orientation")).toBe("vertical");
		expect(group?.classList.contains("grid")).toBe(true);
		expect(group?.classList.contains("flex")).toBe(false);
	});

	it("lays items out in a row when orientation is horizontal", () => {
		const screen = renderGroup({ orientation: "horizontal" });
		const group = queryGroup(screen);
		expect(group?.getAttribute("data-orientation")).toBe("horizontal");
		expect(group?.classList.contains("flex")).toBe(true);
		expect(group?.classList.contains("grid")).toBe(false);
	});

	it("selects an item on click", () => {
		const screen = renderGroup();
		const [, second] = queryItems(screen);
		if (!second) throw new Error("missing radio item");
		fireEvent.click(second);
		expect(second.getAttribute("aria-checked")).toBe("true");
	});

	it("calls onValueChange with the clicked value", () => {
		const onValueChange = vi.fn();
		const screen = renderGroup({ onValueChange });
		const [, second] = queryItems(screen);
		if (!second) throw new Error("missing radio item");
		fireEvent.click(second);
		expect(onValueChange).toHaveBeenCalledWith("b", expect.anything());
	});

	it("blocks selection while the group is disabled", () => {
		const screen = renderGroup({ defaultValue: "a", disabled: true });
		const [first, second] = queryItems(screen);
		if (!second) throw new Error("missing radio item");
		expect(first?.hasAttribute("data-disabled")).toBe(true);
		expect(second.hasAttribute("data-disabled")).toBe(true);
		fireEvent.click(second);
		expect(second.getAttribute("aria-checked")).toBe("false");
		expect(first?.getAttribute("aria-checked")).toBe("true");
	});

	it("blocks selection for a single disabled item", () => {
		const screen = render(
			<RadioGroup defaultValue="a">
				<RadioGroupItem value="a" />
				<RadioGroupItem value="b" disabled />
			</RadioGroup>,
		);
		const [, second] = queryItems(screen);
		if (!second) throw new Error("missing radio item");
		expect(second.hasAttribute("data-disabled")).toBe(true);
		fireEvent.click(second);
		expect(second.getAttribute("aria-checked")).toBe("false");
	});

	it("forwards aria-invalid to the item", () => {
		const screen = render(
			<RadioGroup>
				<RadioGroupItem value="a" aria-invalid />
			</RadioGroup>,
		);
		const [item] = queryItems(screen);
		expect(item?.getAttribute("aria-invalid")).toBe("true");
	});

	it("merges className over the group classes", () => {
		const screen = renderGroup({ className: "custom-group-class" });
		expect(queryGroup(screen)?.classList.contains("custom-group-class")).toBe(
			true,
		);
	});

	it("merges className over the item classes", () => {
		const screen = render(
			<RadioGroup>
				<RadioGroupItem value="a" className="custom-item-class" />
			</RadioGroup>,
		);
		const [item] = queryItems(screen);
		expect(item?.classList.contains("custom-item-class")).toBe(true);
		expect(item?.classList.contains("rounded-full")).toBe(true);
	});
});

function queryCards(screen: ReturnType<typeof render>) {
	return Array.from(
		screen.baseElement.querySelectorAll("[data-slot=radio-group-card]"),
	);
}

function renderCards(props?: React.ComponentProps<typeof RadioGroup>) {
	return render(
		<RadioGroup {...props}>
			<RadioGroupCard value="starter">Starter</RadioGroupCard>
			<RadioGroupCard value="pro">Pro</RadioGroupCard>
		</RadioGroup>,
	);
}

describe("RadioGroupCard", () => {
	it("renders radio-role cards with their free-form content", () => {
		const screen = renderCards();
		const cards = queryCards(screen);
		expect(cards).toHaveLength(2);
		for (const card of cards) {
			expect(card.getAttribute("role")).toBe("radio");
		}
		expect(cards[0]?.textContent).toBe("Starter");
	});

	it("selects a card on click and reports the value", () => {
		const onValueChange = vi.fn();
		const screen = renderCards({ onValueChange });
		const [, pro] = queryCards(screen);
		if (!pro) throw new Error("missing radio card");
		fireEvent.click(pro);
		expect(pro.getAttribute("aria-checked")).toBe("true");
		expect(onValueChange).toHaveBeenCalledWith("pro", expect.anything());
	});

	it("marks the checked card with the primary border and ring", () => {
		const screen = renderCards({ defaultValue: "pro" });
		const [starter, pro] = queryCards(screen);
		expect(pro?.hasAttribute("data-checked")).toBe(true);
		expect(starter?.hasAttribute("data-checked")).toBe(false);
		for (const cls of ["data-checked:border-primary", "data-checked:ring-1"]) {
			expect(pro?.classList.contains(cls)).toBe(true);
		}
	});

	it("only mounts the corner indicator on the checked card", () => {
		const screen = renderCards({ defaultValue: "starter" });
		const [starter, pro] = queryCards(screen);
		expect(
			starter?.querySelector("[data-slot=radio-group-card-indicator]"),
		).toBeTruthy();
		expect(
			pro?.querySelector("[data-slot=radio-group-card-indicator]"),
		).toBeNull();
	});

	it("hides the corner indicator and its reserved padding via showIndicator", () => {
		const screen = render(
			<RadioGroup defaultValue="starter">
				<RadioGroupCard value="starter" showIndicator={false}>
					Starter
				</RadioGroupCard>
			</RadioGroup>,
		);
		const [card] = queryCards(screen);
		expect(
			card?.querySelector("[data-slot=radio-group-card-indicator]"),
		).toBeNull();
		expect(card?.classList.contains("pr-9")).toBe(false);
	});

	it("blocks selection while disabled", () => {
		const screen = render(
			<RadioGroup defaultValue="starter">
				<RadioGroupCard value="starter">Starter</RadioGroupCard>
				<RadioGroupCard value="pro" disabled>
					Pro
				</RadioGroupCard>
			</RadioGroup>,
		);
		const [, pro] = queryCards(screen);
		if (!pro) throw new Error("missing radio card");
		expect(pro.hasAttribute("data-disabled")).toBe(true);
		fireEvent.click(pro);
		expect(pro.getAttribute("aria-checked")).toBe("false");
	});

	it("merges className over the card classes", () => {
		const screen = render(
			<RadioGroup>
				<RadioGroupCard value="starter" className="custom-card-class">
					Starter
				</RadioGroupCard>
			</RadioGroup>,
		);
		const [card] = queryCards(screen);
		expect(card?.classList.contains("custom-card-class")).toBe(true);
		expect(card?.classList.contains("rounded-lg")).toBe(true);
	});
});
