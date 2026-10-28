// @vitest-environment jsdom
import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
	within,
} from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { defineChart } from "#/core/define-chart.ts";
import { barY } from "#/core/marks/bar.ts";
import { lineY } from "#/core/marks/line.ts";
import { Chart } from "#/react/chart.tsx";

afterEach(cleanup);

const rows = [
	{ month: "Jan", missions: 12, bookings: 8 },
	{ month: "Feb", missions: 18, bookings: 11 },
	{ month: "Mar", missions: 15, bookings: 14 },
];

const twoLines = defineChart({
	marks: [
		lineY(rows, { x: "month", y: "missions", label: "Missions" }),
		lineY(rows, { x: "month", y: "bookings", label: "Réservations" }),
	],
});

function liveRegion(container: HTMLElement): HTMLElement {
	const region = container.querySelector("[aria-live]");
	if (!(region instanceof HTMLElement)) throw new Error("no live region");
	return region;
}

describe("Chart", () => {
	it("names the chart and describes how to use it", () => {
		render(<Chart definition={twoLines} ariaLabel="Missions par mois" />);
		const chart = screen.getByRole("img", { name: "Missions par mois" });
		expect(chart.getAttribute("aria-roledescription")).toBe("graphique");
		expect(chart.getAttribute("tabindex")).toBe("0");
		const description = document.getElementById(
			chart.getAttribute("aria-describedby") ?? "",
		);
		expect(description?.textContent).toContain("Flèches");
	});

	it("lists every value in a hidden table, one column per series", () => {
		render(<Chart definition={twoLines} ariaLabel="Missions par mois" />);
		const table = screen.getByRole("table", {
			name: "Données : Missions par mois",
		});
		const headers = within(table)
			.getAllByRole("columnheader")
			.map((cell) => cell.textContent);
		expect(headers).toEqual(["month", "Missions", "Réservations"]);
		const cells = within(table).getAllByRole("row")[2].textContent;
		expect(cells).toBe("Feb1811");
	});

	it("walks the values with the arrow keys and reads them out", () => {
		const { container } = render(
			<Chart definition={twoLines} ariaLabel="Missions" />,
		);
		const chart = screen.getByRole("img");
		fireEvent.keyDown(chart, { key: "ArrowRight" });
		expect(liveRegion(container).textContent).toBe(
			"Jan : Missions 12, Réservations 8",
		);
		fireEvent.keyDown(chart, { key: "ArrowRight" });
		expect(liveRegion(container).textContent).toBe(
			"Feb : Missions 18, Réservations 11",
		);
		fireEvent.keyDown(chart, { key: "End" });
		expect(liveRegion(container).textContent).toContain("Mar");
		fireEvent.keyDown(chart, { key: "Home" });
		expect(liveRegion(container).textContent).toContain("Jan");
		fireEvent.keyDown(chart, { key: "Escape" });
		expect(liveRegion(container).textContent).toBe("");
	});

	it("pins a value with Enter and reports it as selected", () => {
		const onSelect = vi.fn();
		render(
			<Chart definition={twoLines} ariaLabel="Missions" onSelect={onSelect} />,
		);
		const chart = screen.getByRole("img");
		fireEvent.keyDown(chart, { key: "ArrowRight" });
		fireEvent.keyDown(chart, { key: "Enter" });
		expect(onSelect).toHaveBeenCalledWith(
			expect.objectContaining({ value: "12" }),
		);
		expect(
			document.querySelector("[data-slot=chart-tooltip][data-pinned]"),
		).not.toBeNull();
	});

	it("toggles a series from the legend without moving the axes", () => {
		render(<Chart definition={twoLines} ariaLabel="Missions" />);
		const ticks = () =>
			[...document.querySelectorAll("[data-role=axis]")].map(
				(node) => node.textContent,
			);
		const before = ticks();
		const toggle = screen.getByRole("button", { name: "Réservations" });
		expect(toggle.getAttribute("aria-pressed")).toBe("true");
		fireEvent.click(toggle);
		expect(toggle.getAttribute("aria-pressed")).toBe("false");
		expect(document.querySelectorAll("path[data-series]").length).toBe(1);
		expect(ticks()).toEqual(before);
	});

	it("hides the legend of a single series", () => {
		render(
			<Chart
				definition={defineChart({
					marks: [barY(rows, { x: "month", y: "missions" })],
				})}
				ariaLabel="Missions"
			/>,
		);
		expect(screen.queryByRole("list", { name: "Légende" })).toBeNull();
	});

	it("hydrates the server markup without a mismatch", async () => {
		const element = (
			<Chart definition={twoLines} ariaLabel="Missions" initialWidth={480} />
		);
		const html = renderToString(element);
		expect(html).toContain('role="img"');
		const host = document.createElement("div");
		host.innerHTML = html;
		document.body.append(host);
		const errors = vi.spyOn(console, "error").mockImplementation(() => {});
		const recoverable = vi.fn();
		await act(async () => {
			hydrateRoot(host, element, { onRecoverableError: recoverable });
		});
		expect(recoverable).not.toHaveBeenCalled();
		expect(errors).not.toHaveBeenCalled();
		errors.mockRestore();
		host.remove();
	});
});
