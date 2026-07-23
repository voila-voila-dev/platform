// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	StatCard,
	StatCardChart,
	StatCardDelta,
	StatCardHeader,
	StatCardLabel,
	StatCardValue,
} from "#/components/ui/stat-card.tsx";

afterEach(cleanup);

function querySlot(screen: ReturnType<typeof render>, slot: string) {
	return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("StatCard", () => {
	it("renders a card surface tagged as a stat card", () => {
		const screen = render(<StatCard>content</StatCard>);
		const card = querySlot(screen, "stat-card");
		expect(card).not.toBeNull();
		expect(card?.textContent).toBe("content");
		expect(card?.classList.contains("bg-card")).toBe(true);
	});

	it("tightens the card gap but keeps className overridable", () => {
		const screen = render(<StatCard className="gap-4">content</StatCard>);
		const card = querySlot(screen, "stat-card");
		expect(card?.classList.contains("gap-4")).toBe(true);
		expect(card?.classList.contains("gap-1.5")).toBe(false);
	});

	it("follows the card size through the sm padding variants", () => {
		const screen = render(
			<StatCard size="sm">
				<StatCardHeader>
					<StatCardLabel>Missions</StatCardLabel>
				</StatCardHeader>
				<StatCardValue>42</StatCardValue>
			</StatCard>,
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
			<StatCard>
				<StatCardHeader>
					<StatCardLabel>Missions publiées</StatCardLabel>
					<StatCardDelta trend="up">+12%</StatCardDelta>
				</StatCardHeader>
				<StatCardValue>1 284</StatCardValue>
				<StatCardChart>
					<svg role="img" aria-label="sparkline" />
				</StatCardChart>
			</StatCard>,
		);
		expect(querySlot(screen, "stat-card-label")?.textContent).toBe(
			"Missions publiées",
		);
		expect(querySlot(screen, "stat-card-value")?.textContent).toBe("1 284");
		expect(querySlot(screen, "stat-card-delta")?.textContent).toBe("+12%");
		expect(
			querySlot(screen, "stat-card-chart")?.querySelector("svg"),
		).not.toBeNull();
	});
});

describe("StatCardDelta", () => {
	it("maps up to the success color with a trend-up icon", () => {
		const screen = render(<StatCardDelta trend="up">+12%</StatCardDelta>);
		const delta = querySlot(screen, "stat-card-delta");
		expect(delta?.getAttribute("data-trend")).toBe("up");
		expect(delta?.classList.contains("text-success")).toBe(true);
		expect(delta?.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
			"true",
		);
	});

	it("maps down to the destructive color with a trend-down icon", () => {
		const screen = render(<StatCardDelta trend="down">-5%</StatCardDelta>);
		const delta = querySlot(screen, "stat-card-delta");
		expect(delta?.getAttribute("data-trend")).toBe("down");
		expect(delta?.classList.contains("text-destructive")).toBe(true);
		expect(delta?.querySelector("svg")).not.toBeNull();
	});

	it("defaults to neutral with no icon and muted color", () => {
		const screen = render(<StatCardDelta>0%</StatCardDelta>);
		const delta = querySlot(screen, "stat-card-delta");
		expect(delta?.getAttribute("data-trend")).toBe("neutral");
		expect(delta?.classList.contains("text-muted-foreground")).toBe(true);
		expect(delta?.querySelector("svg")).toBeNull();
	});

	it("lets className invert the trend color for down-is-good metrics", () => {
		const screen = render(
			<StatCardDelta trend="down" className="text-success">
				-5%
			</StatCardDelta>,
		);
		const delta = querySlot(screen, "stat-card-delta");
		expect(delta?.classList.contains("text-success")).toBe(true);
		expect(delta?.classList.contains("text-destructive")).toBe(false);
	});
});

describe("StatCardChart", () => {
	it("bleeds to the card's bottom edge by cancelling its padding", () => {
		const screen = render(
			<StatCard>
				<StatCardChart>chart</StatCardChart>
			</StatCard>,
		);
		const chart = querySlot(screen, "stat-card-chart");
		expect(chart?.classList.contains("-mb-4")).toBe(true);
		expect(chart?.classList.contains("mt-auto")).toBe(true);
	});
});
