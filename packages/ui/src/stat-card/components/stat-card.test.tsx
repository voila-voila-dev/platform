// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StatCard } from "#/stat-card/components/stat-card.tsx";

afterEach(cleanup);

function querySlot(screen: ReturnType<typeof render>, slot: string) {
	return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("StatCard", () => {
	it("renders a card surface tagged as a stat card", () => {
		const screen = render(<StatCard.Root>content</StatCard.Root>);
		const card = querySlot(screen, "stat-card");
		expect(card).not.toBeNull();
		expect(card?.textContent).toBe("content");
		expect(card?.classList.contains("bg-card")).toBe(true);
	});

	it("tightens the card gap but keeps className overridable", () => {
		const screen = render(
			<StatCard.Root className="gap-4">content</StatCard.Root>,
		);
		const card = querySlot(screen, "stat-card");
		expect(card?.classList.contains("gap-4")).toBe(true);
		expect(card?.classList.contains("gap-1.5")).toBe(false);
	});

	it("follows the card size through the sm padding variants", () => {
		const screen = render(
			<StatCard.Root size="sm">
				<StatCard.Header>
					<StatCard.Label>Projects</StatCard.Label>
				</StatCard.Header>
				<StatCard.Value>42</StatCard.Value>
			</StatCard.Root>,
		);
		expect(querySlot(screen, "stat-card")?.getAttribute("data-size")).toBe(
			"sm",
		);
		expect(
			querySlot(screen, "stat-card-value")?.classList.contains(
				"group-data-[size=sm]/card:px-3",
			),
		).toBe(true);
	});

	it("composes header, label, value, delta and chart slots", () => {
		const screen = render(
			<StatCard.Root>
				<StatCard.Header>
					<StatCard.Label>Projects published</StatCard.Label>
					<StatCard.Delta trend="up">+12%</StatCard.Delta>
				</StatCard.Header>
				<StatCard.Value>1 284</StatCard.Value>
				<StatCard.Chart>
					<svg role="img" aria-label="sparkline" />
				</StatCard.Chart>
			</StatCard.Root>,
		);
		expect(querySlot(screen, "stat-card-label")?.textContent).toBe(
			"Projects published",
		);
		expect(querySlot(screen, "stat-card-value")?.textContent).toBe("1 284");
		expect(querySlot(screen, "stat-card-delta")?.textContent).toBe("+12%");
		expect(
			querySlot(screen, "stat-card-chart")?.querySelector("svg"),
		).not.toBeNull();
	});
});

describe("StatCard.Root status", () => {
	it("renders no data-status and the default frame without one", () => {
		const screen = render(<StatCard.Root>content</StatCard.Root>);
		const card = querySlot(screen, "stat-card");
		expect(card?.getAttribute("data-status")).toBeNull();
		expect(card?.classList.contains("bg-card")).toBe(true);
		expect(card?.classList.contains("ring-1")).toBe(true);
	});

	it("keeps the default frame for on-track", () => {
		const screen = render(
			<StatCard.Root status="on-track">content</StatCard.Root>,
		);
		const card = querySlot(screen, "stat-card");
		expect(card?.getAttribute("data-status")).toBe("on-track");
		expect(card?.classList.contains("bg-card")).toBe(true);
		expect(card?.classList.contains("ring-1")).toBe(true);
		expect(card?.classList.contains("border-warning/50")).toBe(false);
		expect(card?.classList.contains("border-destructive/50")).toBe(false);
	});

	it("tints the frame with the warning tokens for below-objective", () => {
		const screen = render(
			<StatCard.Root status="below-objective">content</StatCard.Root>,
		);
		const card = querySlot(screen, "stat-card");
		expect(card?.getAttribute("data-status")).toBe("below-objective");
		expect(card?.classList.contains("border-warning/50")).toBe(true);
		expect(card?.classList.contains("bg-warning/5")).toBe(true);
		expect(card?.classList.contains("ring-1")).toBe(false);
	});

	it("tints the frame with the destructive tokens for alerting", () => {
		const screen = render(
			<StatCard.Root status="alerting">content</StatCard.Root>,
		);
		const card = querySlot(screen, "stat-card");
		expect(card?.getAttribute("data-status")).toBe("alerting");
		expect(card?.classList.contains("border-destructive/50")).toBe(true);
		expect(card?.classList.contains("bg-destructive/5")).toBe(true);
		expect(card?.classList.contains("ring-1")).toBe(false);
	});
});

describe("StatCard.Target", () => {
	it("renders a quiet objective line with copy left to the caller", () => {
		const screen = render(
			<StatCard.Root>
				<StatCard.Value>92%</StatCard.Value>
				<StatCard.Target>Target: 90%</StatCard.Target>
			</StatCard.Root>,
		);
		const target = querySlot(screen, "stat-card-target");
		expect(target?.textContent).toBe("Target: 90%");
		expect(target?.classList.contains("text-xs")).toBe(true);
		expect(target?.classList.contains("text-muted-foreground")).toBe(true);
	});

	it("follows the card size through the sm padding variant", () => {
		const screen = render(<StatCard.Target>Target: 90%</StatCard.Target>);
		expect(
			querySlot(screen, "stat-card-target")?.classList.contains(
				"group-data-[size=sm]/card:px-3",
			),
		).toBe(true);
	});
});

describe("StatCard.Delta", () => {
	it("maps up to the success color with a trend-up icon", () => {
		const screen = render(<StatCard.Delta trend="up">+12%</StatCard.Delta>);
		const delta = querySlot(screen, "stat-card-delta");
		expect(delta?.getAttribute("data-trend")).toBe("up");
		expect(delta?.classList.contains("text-success")).toBe(true);
		expect(delta?.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
			"true",
		);
	});

	it("maps down to the destructive color with a trend-down icon", () => {
		const screen = render(<StatCard.Delta trend="down">-5%</StatCard.Delta>);
		const delta = querySlot(screen, "stat-card-delta");
		expect(delta?.getAttribute("data-trend")).toBe("down");
		expect(delta?.classList.contains("text-destructive")).toBe(true);
		expect(delta?.querySelector("svg")).not.toBeNull();
	});

	it("defaults to neutral with no icon and muted color", () => {
		const screen = render(<StatCard.Delta>0%</StatCard.Delta>);
		const delta = querySlot(screen, "stat-card-delta");
		expect(delta?.getAttribute("data-trend")).toBe("neutral");
		expect(delta?.classList.contains("text-muted-foreground")).toBe(true);
		expect(delta?.querySelector("svg")).toBeNull();
	});

	it("lets className invert the trend color for down-is-good metrics", () => {
		const screen = render(
			<StatCard.Delta trend="down" className="text-success">
				-5%
			</StatCard.Delta>,
		);
		const delta = querySlot(screen, "stat-card-delta");
		expect(delta?.classList.contains("text-success")).toBe(true);
		expect(delta?.classList.contains("text-destructive")).toBe(false);
	});
});

describe("StatCard.Chart", () => {
	it("bleeds to the card's bottom edge by cancelling its padding", () => {
		const screen = render(
			<StatCard.Root>
				<StatCard.Chart>chart</StatCard.Chart>
			</StatCard.Root>,
		);
		const chart = querySlot(screen, "stat-card-chart");
		expect(chart?.classList.contains("-mb-4")).toBe(true);
		expect(chart?.classList.contains("mt-auto")).toBe(true);
	});
});
