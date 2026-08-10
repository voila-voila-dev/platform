// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CardGallery } from "#/card-gallery/components/card-gallery.tsx";

afterEach(cleanup);

describe("CardGallery", () => {
	it("renders an adaptive grid with one tile per item", () => {
		const screen = render(
			<CardGallery.Root>
				<CardGallery.Item>
					<CardGallery.Title>Riverside Studio</CardGallery.Title>
				</CardGallery.Item>
				<CardGallery.Item>
					<CardGallery.Title>Northgate Labs</CardGallery.Title>
				</CardGallery.Item>
			</CardGallery.Root>,
		);
		const root = screen.baseElement.querySelector(
			"[data-slot=card-gallery]",
		) as HTMLElement;
		expect(root.style.getPropertyValue("--card-gallery-item-min")).toBe(
			"8.5rem",
		);
		expect(root.querySelectorAll("[data-slot=card-gallery-item]")).toHaveLength(
			2,
		);
	});

	it("takes a custom minimum tile width", () => {
		const screen = render(<CardGallery.Root itemMinWidth="12rem" />);
		const root = screen.baseElement.querySelector(
			"[data-slot=card-gallery]",
		) as HTMLElement;
		expect(root.style.getPropertyValue("--card-gallery-item-min")).toBe(
			"12rem",
		);
	});

	it("renders an item as a button through `render`", () => {
		const onClick = vi.fn();
		const screen = render(
			<CardGallery.Root>
				<CardGallery.Item render={<button type="button" onClick={onClick} />}>
					<CardGallery.Title>Riverside Studio</CardGallery.Title>
				</CardGallery.Item>
			</CardGallery.Root>,
		);
		const item = screen.baseElement.querySelector(
			"[data-slot=card-gallery-item]",
		) as HTMLElement;
		expect(item.tagName).toBe("BUTTON");
		fireEvent.click(item);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("renders an item as a link through `render`", () => {
		const screen = render(
			<CardGallery.Root>
				<CardGallery.Item
					render={
						<a href="#riverside">
							<CardGallery.Title>Riverside Studio</CardGallery.Title>
						</a>
					}
				/>
			</CardGallery.Root>,
		);
		const item = screen.baseElement.querySelector(
			"[data-slot=card-gallery-item]",
		) as HTMLAnchorElement;
		expect(item.tagName).toBe("A");
		expect(item.getAttribute("href")).toBe("#riverside");
	});

	it("shows the logo fallback until an image is supplied", () => {
		const screen = render(<CardGallery.Logo>RS</CardGallery.Logo>);
		expect(
			screen.baseElement.querySelector("[data-slot=avatar-fallback]")
				?.textContent,
		).toBe("RS");
	});

	it("renders title and description text", () => {
		const screen = render(
			<>
				<CardGallery.Title>Riverside Studio</CardGallery.Title>
				<CardGallery.Description>Design studio</CardGallery.Description>
			</>,
		);
		expect(screen.getByText("Riverside Studio")).toBeDefined();
		expect(screen.getByText("Design studio")).toBeDefined();
	});
});
