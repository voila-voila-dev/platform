import { cleanup, render } from "@testing-library/react";
import { setReducedMotion } from "@voila.dev/motion";
import { afterEach, describe, expect, it } from "vitest";
import { StatCard } from "#/stat-card/components/stat-card.tsx";

afterEach(() => {
	cleanup();
	setReducedMotion("user");
});

function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function shownText(container: HTMLElement): string {
	return container.querySelector("[aria-hidden=true]")?.textContent ?? "";
}

describe("StatCard.Value with a value", () => {
	it("counts from the previous value and lands exactly on the formatted target", async () => {
		const format = new Intl.NumberFormat("en-US");
		const screen = render(<StatCard.Value value={0} format={format} />);
		expect(shownText(screen.container)).toBe("0");
		screen.rerender(<StatCard.Value value={1280} format={format} />);
		await wait(150);
		const midway = Number(shownText(screen.container).replace(/,/g, ""));
		expect(midway).toBeGreaterThan(0);
		expect(midway).toBeLessThan(1280);
		await wait(2000);
		expect(shownText(screen.container)).toBe("1,280");
	});

	it("gives assistive tech the final value only", async () => {
		const screen = render(<StatCard.Value value={10} />);
		screen.rerender(<StatCard.Value value={20} />);
		await wait(100);
		expect(screen.container.querySelector(".sr-only")?.textContent).toBe("20");
	});

	it("jumps under reduced motion", () => {
		setReducedMotion("always");
		const screen = render(<StatCard.Value value={1} />);
		screen.rerender(<StatCard.Value value={99} />);
		expect(shownText(screen.container)).toBe("99");
	});

	it("keeps children when no value is given", () => {
		const screen = render(<StatCard.Value>1 284</StatCard.Value>);
		expect(screen.container.textContent).toBe("1 284");
	});
});
