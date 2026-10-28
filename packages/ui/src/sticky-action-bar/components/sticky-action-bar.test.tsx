// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "#/button/components/button.tsx";
import { StickyActionBar } from "#/sticky-action-bar/components/sticky-action-bar.tsx";

afterEach(cleanup);

function queryBar(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector("[data-slot=sticky-action-bar]");
}

describe("StickyActionBar", () => {
	it("renders its children", () => {
		const screen = render(
			<StickyActionBar>
				<Button>Postuler</Button>
			</StickyActionBar>,
		);
		expect(queryBar(screen)?.textContent).toBe("Postuler");
	});

	it("is sticky with a top border and background by default", () => {
		const screen = render(
			<StickyActionBar>
				<Button>Postuler</Button>
			</StickyActionBar>,
		);
		const bar = queryBar(screen);
		expect(bar?.classList.contains("sticky")).toBe(true);
		expect(bar?.classList.contains("bottom-0")).toBe(true);
		expect(bar?.classList.contains("border-t")).toBe(true);
		expect(bar?.classList.contains("bg-background")).toBe(true);
	});

	it("reserves safe-area bottom padding", () => {
		const screen = render(
			<StickyActionBar>
				<Button>Postuler</Button>
			</StickyActionBar>,
		);
		expect(
			queryBar(screen)?.className.includes("env(safe-area-inset-bottom)"),
		).toBe(true);
	});

	it("hides on desktop by default", () => {
		const screen = render(
			<StickyActionBar>
				<Button>Postuler</Button>
			</StickyActionBar>,
		);
		expect(queryBar(screen)?.classList.contains("md:hidden")).toBe(true);
	});

	it("stays visible on desktop when hideOnDesktop is false", () => {
		const screen = render(
			<StickyActionBar hideOnDesktop={false}>
				<Button>Postuler</Button>
			</StickyActionBar>,
		);
		expect(queryBar(screen)?.classList.contains("md:hidden")).toBe(false);
	});

	it("merges a consumer className", () => {
		const screen = render(
			<StickyActionBar className="custom-bar">
				<Button>Postuler</Button>
			</StickyActionBar>,
		);
		expect(queryBar(screen)?.classList.contains("custom-bar")).toBe(true);
	});
});
