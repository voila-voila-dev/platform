// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AspectRatio } from "#/components/aspect-ratio.tsx";

afterEach(cleanup);

function getRoot(container: HTMLElement): HTMLElement {
	const root = container.querySelector<HTMLElement>("[data-slot=aspect-ratio]");
	expect(root).not.toBeNull();
	return root as HTMLElement;
}

describe("AspectRatio", () => {
	it("renders a div exposing the numeric ratio through the --ratio variable", () => {
		const screen = render(<AspectRatio ratio={16 / 9} />);
		const root = getRoot(screen.container);
		expect(root.tagName).toBe("DIV");
		expect(root.style.getPropertyValue("--ratio")).toBe(String(16 / 9));
	});

	it("defaults the ratio to 1 when none is given", () => {
		const screen = render(<AspectRatio />);
		const root = getRoot(screen.container);
		expect(root.style.getPropertyValue("--ratio")).toBe("1");
	});

	it("accepts a string ratio as CSS aspect-ratio does", () => {
		const screen = render(<AspectRatio ratio="3/4" />);
		const root = getRoot(screen.container);
		expect(root.style.getPropertyValue("--ratio")).toBe("3/4");
	});

	it("renders its children inside the container", () => {
		const screen = render(
			<AspectRatio ratio={1}>
				<img src="/cover.jpg" alt="Stadium cover" />
			</AspectRatio>,
		);
		const root = getRoot(screen.container);
		expect(root.contains(screen.getByAltText("Stadium cover"))).toBe(true);
	});

	it("merges className with the base classes", () => {
		const screen = render(
			<AspectRatio ratio={1} className="custom-ratio-class" />,
		);
		const root = getRoot(screen.container);
		expect(root.classList.contains("custom-ratio-class")).toBe(true);
		expect(root.classList.contains("relative")).toBe(true);
	});

	it("keeps --ratio when a consumer passes its own style", () => {
		const screen = render(
			<AspectRatio ratio={16 / 9} style={{ maxWidth: "20rem" }} />,
		);
		const root = getRoot(screen.container);
		expect(root.style.getPropertyValue("--ratio")).toBe(String(16 / 9));
		expect(root.style.maxWidth).toBe("20rem");
	});

	it("renders a custom element through the render prop", () => {
		const screen = render(
			<AspectRatio ratio={16 / 9} render={<figure aria-label="Cover" />} />,
		);
		const root = getRoot(screen.container);
		expect(root.tagName).toBe("FIGURE");
		expect(root.getAttribute("aria-label")).toBe("Cover");
		expect(root.style.getPropertyValue("--ratio")).toBe(String(16 / 9));
	});
});
