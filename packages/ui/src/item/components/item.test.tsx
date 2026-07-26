// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Item } from "#/item/components/item.tsx";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
	return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("Item", () => {
	it("renders its children in a div by default", () => {
		const screen = render(<Item.Root>Project</Item.Root>);
		const item = queryBySlot(screen, "item");
		expect(item?.tagName).toBe("DIV");
		expect(item?.textContent).toBe("Project");
	});

	it("exposes the default variant and size as data attributes", () => {
		const screen = render(<Item.Root>Project</Item.Root>);
		const item = queryBySlot(screen, "item");
		expect(item?.getAttribute("data-variant")).toBe("default");
		expect(item?.getAttribute("data-size")).toBe("default");
	});

	it.each([
		"default",
		"outline",
		"muted",
	] as const)("exposes variant %s as a data attribute", (variant) => {
		const screen = render(<Item.Root variant={variant}>Project</Item.Root>);
		expect(queryBySlot(screen, "item")?.getAttribute("data-variant")).toBe(
			variant,
		);
	});

	it.each([
		"default",
		"sm",
		"xs",
	] as const)("exposes size %s as a data attribute", (size) => {
		const screen = render(<Item.Root size={size}>Project</Item.Root>);
		expect(queryBySlot(screen, "item")?.getAttribute("data-size")).toBe(size);
	});

	it("gives each size distinct paddings", () => {
		const defaultItem = render(
			<Item.Root>Project</Item.Root>,
		).container.querySelector("[data-slot=item]");
		const smallItem = render(
			<Item.Root size="sm">Project</Item.Root>,
		).container.querySelector("[data-slot=item]");
		const extraSmallItem = render(
			<Item.Root size="xs">Project</Item.Root>,
		).container.querySelector("[data-slot=item]");
		expect(defaultItem?.classList.contains("py-2.5")).toBe(true);
		expect(smallItem?.classList.contains("py-2")).toBe(true);
		expect(smallItem?.classList.contains("px-3")).toBe(true);
		expect(extraSmallItem?.classList.contains("py-2")).toBe(true);
		expect(extraSmallItem?.classList.contains("px-2.5")).toBe(true);
	});

	it("uses the kit-standard ring-3 focus spelling", () => {
		const screen = render(<Item.Root>Project</Item.Root>);
		const item = queryBySlot(screen, "item");
		expect(item?.classList.contains("focus-visible:ring-3")).toBe(true);
		for (const itemClass of item?.classList ?? []) {
			expect(itemClass).not.toContain("ring-[3px]");
		}
	});

	it("renders as an anchor via the render prop", () => {
		const screen = render(
			<Item.Root render={<a href="/projects">Project</a>} />,
		);
		const item = queryBySlot(screen, "item");
		expect(item?.tagName).toBe("A");
		expect(item?.getAttribute("href")).toBe("/projects");
		expect(item?.getAttribute("data-variant")).toBe("default");
	});

	it("merges className over the variant classes", () => {
		const screen = render(
			<Item.Root className="custom-item-class">Project</Item.Root>,
		);
		const item = queryBySlot(screen, "item");
		expect(item?.classList.contains("custom-item-class")).toBe(true);
		expect(item?.classList.contains("rounded-lg")).toBe(true);
	});
});

describe("Item.Group", () => {
	it("renders a div with the group scope class", () => {
		const screen = render(
			<Item.Group>
				<Item.Root>Project</Item.Root>
			</Item.Group>,
		);
		const group = queryBySlot(screen, "item-group");
		expect(group?.tagName).toBe("DIV");
		expect(group?.classList.contains("group/item-group")).toBe(true);
	});
});

describe("Item.Separator", () => {
	it("renders a horizontal separator with sizing classes that match the emitted DOM", () => {
		const screen = render(<Item.Separator />);
		const separator = queryBySlot(screen, "item-separator");
		expect(separator?.getAttribute("data-orientation")).toBe("horizontal");
		expect(separator?.classList.contains("my-2")).toBe(true);
		expect(
			separator?.classList.contains("data-[orientation=horizontal]:h-px"),
		).toBe(true);
		expect(separator?.matches('[data-orientation="horizontal"]')).toBe(true);
	});
});

describe("Item.Media", () => {
	it("exposes the default variant as a data attribute", () => {
		const screen = render(<Item.Media />);
		const media = queryBySlot(screen, "item-media");
		expect(media?.tagName).toBe("DIV");
		expect(media?.getAttribute("data-variant")).toBe("default");
	});

	it.each([
		"default",
		"icon",
		"image",
	] as const)("exposes variant %s as a data attribute", (variant) => {
		const screen = render(<Item.Media variant={variant} />);
		expect(
			queryBySlot(screen, "item-media")?.getAttribute("data-variant"),
		).toBe(variant);
	});

	it("renders through the render prop like Item", () => {
		const screen = render(
			<Item.Media variant="icon" render={<span />}>
				media
			</Item.Media>,
		);
		const media = queryBySlot(screen, "item-media");
		expect(media?.tagName).toBe("SPAN");
		expect(media?.getAttribute("data-variant")).toBe("icon");
	});

	it("merges className over the variant classes", () => {
		const screen = render(<Item.Media className="custom-media-class" />);
		const media = queryBySlot(screen, "item-media");
		expect(media?.classList.contains("custom-media-class")).toBe(true);
		expect(media?.classList.contains("shrink-0")).toBe(true);
	});
});

describe("Item content slots", () => {
	it("renders Item.Title as a span and Item.Description as a paragraph", () => {
		const screen = render(
			<Item.Root>
				<Item.Content>
					<Item.Title>Q3 brand refresh</Item.Title>
					<Item.Description>Designer needed.</Item.Description>
				</Item.Content>
			</Item.Root>,
		);
		expect(queryBySlot(screen, "item-content")?.tagName).toBe("DIV");
		expect(queryBySlot(screen, "item-title")?.tagName).toBe("SPAN");
		expect(queryBySlot(screen, "item-description")?.tagName).toBe("P");
	});

	it("renders actions, header and footer slots", () => {
		const screen = render(
			<Item.Root>
				<Item.Header>Header</Item.Header>
				<Item.Actions>Actions</Item.Actions>
				<Item.Footer>Footer</Item.Footer>
			</Item.Root>,
		);
		expect(queryBySlot(screen, "item-header")?.textContent).toBe("Header");
		expect(queryBySlot(screen, "item-actions")?.textContent).toBe("Actions");
		expect(queryBySlot(screen, "item-footer")?.textContent).toBe("Footer");
	});
});
