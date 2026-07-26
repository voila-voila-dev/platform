// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Skeleton } from "#/skeleton/components/skeleton.tsx";

afterEach(cleanup);

function querySkeleton(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector("[data-slot=skeleton]");
}

describe("Skeleton", () => {
	it("renders a div with its slot attribute", () => {
		const screen = render(<Skeleton />);
		const skeleton = querySkeleton(screen);
		expect(skeleton?.tagName).toBe("DIV");
	});

	it("applies the pulse animation with its reduced-motion escape", () => {
		const screen = render(<Skeleton />);
		const skeleton = querySkeleton(screen);
		expect(skeleton?.classList.contains("animate-pulse")).toBe(true);
		expect(skeleton?.classList.contains("motion-reduce:animate-none")).toBe(
			true,
		);
	});

	it("applies the placeholder surface classes", () => {
		const screen = render(<Skeleton />);
		const skeleton = querySkeleton(screen);
		expect(skeleton?.classList.contains("bg-muted")).toBe(true);
		expect(skeleton?.classList.contains("rounded-md")).toBe(true);
	});

	it("merges className over the defaults", () => {
		const screen = render(<Skeleton className="rounded-full" />);
		const skeleton = querySkeleton(screen);
		expect(skeleton?.classList.contains("rounded-full")).toBe(true);
		expect(skeleton?.classList.contains("rounded-md")).toBe(false);
		expect(skeleton?.classList.contains("animate-pulse")).toBe(true);
	});

	it("passes native div props through", () => {
		const screen = render(
			<Skeleton aria-hidden data-testid="avatar-skeleton" />,
		);
		const skeleton = querySkeleton(screen);
		expect(skeleton?.getAttribute("aria-hidden")).toBe("true");
		expect(skeleton?.getAttribute("data-testid")).toBe("avatar-skeleton");
	});

	it("renders children when composing larger placeholders", () => {
		const screen = render(
			<Skeleton>
				<span>hidden content</span>
			</Skeleton>,
		);
		expect(querySkeleton(screen)?.textContent).toBe("hidden content");
	});
});
