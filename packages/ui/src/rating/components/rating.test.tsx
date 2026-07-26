// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Rating } from "#/rating/components/rating.tsx";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
	return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

function allBySlot(screen: ReturnType<typeof render>, slot: string) {
	return screen.baseElement.querySelectorAll(`[data-slot=${slot}]`);
}

describe("Rating", () => {
	it("renders five stars by default", () => {
		const screen = render(<Rating.Root value={3} />);
		expect(allBySlot(screen, "rating-star").length).toBe(5);
	});

	it("fills the rounded number of stars", () => {
		const screen = render(<Rating.Root value={3} />);
		const filled = screen.baseElement.querySelectorAll(
			"[data-slot=rating-star][data-filled]",
		);
		expect(filled.length).toBe(3);
	});

	it("rounds fractional values for the fill count", () => {
		const screen = render(<Rating.Root value={3.6} />);
		const filled = screen.baseElement.querySelectorAll(
			"[data-slot=rating-star][data-filled]",
		);
		expect(filled.length).toBe(4);
	});

	it("clamps values above the maximum", () => {
		const screen = render(<Rating.Root value={9} />);
		const filled = screen.baseElement.querySelectorAll(
			"[data-slot=rating-star][data-filled]",
		);
		expect(filled.length).toBe(5);
	});

	it("exposes an accessible label", () => {
		const screen = render(<Rating.Root value={4} />);
		expect(queryBySlot(screen, "rating")?.getAttribute("aria-label")).toBe(
			"4 out of 5 stars",
		);
	});

	it("renders the review count when provided", () => {
		const screen = render(<Rating.Root value={4} count={128} />);
		expect(queryBySlot(screen, "rating-count")?.textContent).toBe("(128)");
	});

	it("omits the count when not provided", () => {
		const screen = render(<Rating.Root value={4} />);
		expect(queryBySlot(screen, "rating-count")).toBeNull();
	});
});

describe("Rating.Input", () => {
	it("renders a radiogroup with one radio per star", () => {
		const screen = render(<Rating.Input value={0} onChange={() => {}} />);
		const group = queryBySlot(screen, "rating-input");
		expect(group?.getAttribute("role")).toBe("radiogroup");
		expect(allBySlot(screen, "rating-input-star").length).toBe(5);
	});

	it("marks the selected star as checked", () => {
		const screen = render(<Rating.Input value={3} onChange={() => {}} />);
		const stars = allBySlot(screen, "rating-input-star");
		expect(stars[2]?.getAttribute("aria-checked")).toBe("true");
		expect(stars[0]?.getAttribute("aria-checked")).toBe("false");
	});

	it("calls onChange with the clicked star value", () => {
		const onChange = vi.fn();
		const screen = render(<Rating.Input value={0} onChange={onChange} />);
		const stars = allBySlot(screen, "rating-input-star");
		fireEvent.click(stars[3] as Element);
		expect(onChange).toHaveBeenCalledWith(4);
	});

	it("emits a hidden input when name is set", () => {
		const screen = render(
			<Rating.Input value={2} onChange={() => {}} name="score" />,
		);
		const hidden = screen.baseElement.querySelector(
			"input[type=hidden][name=score]",
		);
		expect((hidden as HTMLInputElement | null)?.value).toBe("2");
	});
});

describe("Rating.ReviewItem", () => {
	it("renders the author, rating and body", () => {
		const screen = render(
			<Rating.ReviewItem
				authorName="Nathan Guyot"
				rating={5}
				date="12 juin 2026"
			>
				Service impeccable.
			</Rating.ReviewItem>,
		);
		const item = queryBySlot(screen, "review-item");
		expect(item?.textContent).toContain("Nathan Guyot");
		expect(queryBySlot(screen, "review-item-date")?.textContent).toBe(
			"12 juin 2026",
		);
		expect(queryBySlot(screen, "review-item-body")?.textContent).toBe(
			"Service impeccable.",
		);
		// The embedded Rating renders its own stars.
		expect(allBySlot(screen, "rating-star").length).toBe(5);
	});

	it("omits the body when there is no children", () => {
		const screen = render(
			<Rating.ReviewItem authorName="Nathan Guyot" rating={4} />,
		);
		expect(queryBySlot(screen, "review-item-body")).toBeNull();
	});
});
