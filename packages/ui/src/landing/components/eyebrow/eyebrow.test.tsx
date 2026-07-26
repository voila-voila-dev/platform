// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Eyebrow } from "#/landing/components/eyebrow/index.ts";

afterEach(cleanup);

describe("Eyebrow", () => {
	it("tints the pill and label with the tone", () => {
		const screen = render(
			<Eyebrow.Root tone="highlight">
				<Eyebrow.Label>For clients</Eyebrow.Label>
			</Eyebrow.Root>,
		);
		const root = screen.container.querySelector("[data-slot=eyebrow]");
		expect(root?.classList.contains("bg-highlight/10")).toBe(true);
		expect(
			screen.container
				.querySelector("[data-slot=eyebrow-label]")
				?.classList.contains("text-highlight"),
		).toBe(true);
	});

	it("renders a pulsing dot when asked", () => {
		const screen = render(
			<Eyebrow.Root tone="brand">
				<Eyebrow.Dot pulse />
				<Eyebrow.Label>New platform</Eyebrow.Label>
			</Eyebrow.Root>,
		);
		const dot = screen.container.querySelector("[data-slot=eyebrow-dot]");
		expect(dot?.classList.contains("animate-pulse")).toBe(true);
		expect(dot?.classList.contains("bg-brand")).toBe(true);
	});
});
