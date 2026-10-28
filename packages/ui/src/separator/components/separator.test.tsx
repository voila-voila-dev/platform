// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Separator } from "#/separator/components/separator.tsx";

afterEach(cleanup);

function querySeparator(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector("[data-slot=separator]");
}

describe("Separator", () => {
	it("renders with separator semantics", () => {
		const screen = render(<Separator />);
		const separator = querySeparator(screen);
		expect(separator?.getAttribute("role")).toBe("separator");
	});

	it("is horizontal by default", () => {
		const screen = render(<Separator />);
		const separator = querySeparator(screen);
		expect(separator?.getAttribute("data-orientation")).toBe("horizontal");
		expect(separator?.getAttribute("aria-orientation")).toBe("horizontal");
	});

	it("renders vertical orientation", () => {
		const screen = render(<Separator orientation="vertical" />);
		const separator = querySeparator(screen);
		expect(separator?.getAttribute("data-orientation")).toBe("vertical");
		expect(separator?.getAttribute("aria-orientation")).toBe("vertical");
	});

	it("sizes via data-orientation attribute variants matching the emitted DOM", () => {
		// Regression: `data-horizontal:`/`data-vertical:` presence variants never
		// matched Base UI's `data-orientation` attribute, collapsing every
		// separator to a zero-area box.
		const screen = render(<Separator />);
		const separator = querySeparator(screen);
		expect(
			separator?.classList.contains("data-[orientation=horizontal]:h-px"),
		).toBe(true);
		expect(
			separator?.classList.contains("data-[orientation=horizontal]:w-full"),
		).toBe(true);
		expect(
			separator?.classList.contains("data-[orientation=vertical]:w-px"),
		).toBe(true);
		expect(
			separator?.classList.contains("data-[orientation=vertical]:self-stretch"),
		).toBe(true);
		for (const sizingClass of separator?.classList ?? []) {
			expect(sizingClass).not.toMatch(/^data-(horizontal|vertical):/);
		}
	});

	it("matches its own orientation attribute selectors in both orientations", () => {
		const horizontal = render(<Separator />);
		expect(
			horizontal.container
				.querySelector("[data-slot=separator]")
				?.matches('[data-orientation="horizontal"]'),
		).toBe(true);
		const vertical = render(<Separator orientation="vertical" />);
		expect(
			vertical.container
				.querySelector("[data-slot=separator]")
				?.matches('[data-orientation="vertical"]'),
		).toBe(true);
	});

	it("merges className over the defaults", () => {
		const screen = render(<Separator className="my-4 bg-border/50" />);
		const separator = querySeparator(screen);
		expect(separator?.classList.contains("my-4")).toBe(true);
		expect(separator?.classList.contains("bg-border/50")).toBe(true);
		expect(separator?.classList.contains("bg-border")).toBe(false);
		expect(separator?.classList.contains("shrink-0")).toBe(true);
	});

	it("passes native props through", () => {
		const screen = render(<Separator data-testid="nav-divider" />);
		const separator = querySeparator(screen);
		expect(separator?.getAttribute("data-testid")).toBe("nav-divider");
	});

	describe("with label", () => {
		it("keeps separator semantics on the labeled wrapper", () => {
			const screen = render(<Separator>OU</Separator>);
			const separator = querySeparator(screen);
			expect(separator?.getAttribute("role")).toBe("separator");
			expect(separator?.getAttribute("data-orientation")).toBe("horizontal");
			expect(
				separator?.querySelector("[data-slot=separator-label]")?.textContent,
			).toBe("OU");
		});

		it("exposes exactly one separator to assistive tech", () => {
			const screen = render(<Separator>OU</Separator>);
			expect(
				screen.baseElement.querySelectorAll("[role=separator]"),
			).toHaveLength(1);
		});

		it("flanks the label with two decorative lines", () => {
			const screen = render(<Separator>OU</Separator>);
			const lines = screen.baseElement.querySelectorAll(
				"[data-slot=separator-line]",
			);
			expect(lines).toHaveLength(2);
			for (const line of lines) {
				expect(line.getAttribute("aria-hidden")).toBe("true");
				expect(line.classList.contains("h-px")).toBe(true);
				expect(line.classList.contains("flex-1")).toBe(true);
			}
		});

		it("stacks vertically when orientation is vertical", () => {
			const screen = render(<Separator orientation="vertical">OU</Separator>);
			const separator = querySeparator(screen);
			expect(separator?.getAttribute("data-orientation")).toBe("vertical");
			expect(separator?.getAttribute("aria-orientation")).toBe("vertical");
			const lines = screen.baseElement.querySelectorAll(
				"[data-slot=separator-line]",
			);
			for (const line of lines) {
				expect(line.classList.contains("w-px")).toBe(true);
				expect(line.classList.contains("h-px")).toBe(false);
			}
		});

		it("merges className over the labeled defaults", () => {
			const screen = render(<Separator className="my-6 text-xs">OU</Separator>);
			const separator = querySeparator(screen);
			expect(separator?.classList.contains("my-6")).toBe(true);
			expect(separator?.classList.contains("text-xs")).toBe(true);
			expect(separator?.classList.contains("text-sm")).toBe(false);
		});
	});
});
