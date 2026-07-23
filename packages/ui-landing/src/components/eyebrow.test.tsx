// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Eyebrow } from "#/components/eyebrow.tsx";

afterEach(cleanup);

describe("Eyebrow", () => {
	it("tints the pill and label with the tone", () => {
		const screen = render(
			<Eyebrow.Root tone="organization">
				<Eyebrow.Label>Pour les clubs</Eyebrow.Label>
			</Eyebrow.Root>,
		);
		const root = screen.container.querySelector("[data-slot=eyebrow]");
		expect(root?.classList.contains("bg-organization/10")).toBe(true);
		expect(
			screen.container
				.querySelector("[data-slot=eyebrow-label]")
				?.classList.contains("text-organization"),
		).toBe(true);
	});

	it("renders a pulsing dot when asked", () => {
		const screen = render(
			<Eyebrow.Root tone="provider">
				<Eyebrow.Dot pulse />
				<Eyebrow.Label>Nouvelle plateforme</Eyebrow.Label>
			</Eyebrow.Root>,
		);
		const dot = screen.container.querySelector("[data-slot=eyebrow-dot]");
		expect(dot?.classList.contains("animate-pulse")).toBe(true);
		expect(dot?.classList.contains("bg-provider")).toBe(true);
	});
});
