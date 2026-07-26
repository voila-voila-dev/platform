// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Item } from "#/item/components/item.tsx";
import { List } from "#/list/components/list.tsx";

afterEach(cleanup);

function querySlot(screen: ReturnType<typeof render>, slot: string) {
	return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("List", () => {
	it("renders a ul with an explicit list role and its own data-slot", () => {
		const screen = render(<List.Root />);
		const list = querySlot(screen, "list");
		expect(list?.tagName).toBe("UL");
		expect(list?.getAttribute("role")).toBe("list");
	});

	it("keeps the Item.Group recipe and strips list bullets", () => {
		const screen = render(<List.Root />);
		const className = querySlot(screen, "list")?.className ?? "";
		expect(className).toContain("group/item-group");
		expect(className).toContain("flex-col");
		expect(className).toContain("list-none");
	});

	it("merges a consumer className over the base", () => {
		const screen = render(<List.Root className="gap-0" />);
		const className = querySlot(screen, "list")?.className ?? "";
		expect(className).toContain("gap-0");
		expect(className).not.toContain("gap-4");
	});
});

describe("List.Item", () => {
	it("renders an li carrying the Item recipe", () => {
		const screen = render(
			<List.Root>
				<List.Item>Project</List.Item>
			</List.Root>,
		);
		const item = querySlot(screen, "list-item");
		expect(item?.tagName).toBe("LI");
		expect(item?.className).toContain("group/item");
		expect(item?.parentElement?.tagName).toBe("UL");
	});

	it("supports the Item variant and size props", () => {
		const screen = render(
			<List.Root>
				<List.Item variant="outline" size="sm">
					Project
				</List.Item>
			</List.Root>,
		);
		const item = querySlot(screen, "list-item");
		expect(item?.getAttribute("data-variant")).toBe("outline");
		expect(item?.getAttribute("data-size")).toBe("sm");
		expect(item?.className).toContain("border-border");
	});

	it("composes with the Item child components", () => {
		const screen = render(
			<List.Root>
				<List.Item>
					<Item.Content>
						<Item.Title>Dr Dupont</Item.Title>
					</Item.Content>
				</List.Item>
			</List.Root>,
		);
		const title = querySlot(screen, "item-title");
		expect(title?.textContent).toBe("Dr Dupont");
		expect(title?.closest("li")).toBe(querySlot(screen, "list-item"));
	});

	it("exposes list semantics to the accessibility tree", () => {
		const screen = render(
			<List.Root aria-label="Projects">
				<List.Item>First</List.Item>
				<List.Item>Second</List.Item>
			</List.Root>,
		);
		const list = screen.getByRole("list", { name: "Projects" });
		expect(screen.getAllByRole("listitem")).toHaveLength(2);
		expect(list.querySelectorAll("li")).toHaveLength(2);
	});
});

describe("List.Separator", () => {
	it("renders inside a presentational li hidden from assistive tech", () => {
		const screen = render(
			<List.Root>
				<List.Item>First</List.Item>
				<List.Separator />
				<List.Item>Second</List.Item>
			</List.Root>,
		);
		const separator = querySlot(screen, "list-separator");
		expect(separator?.tagName).toBe("LI");
		expect(separator?.getAttribute("role")).toBe("presentation");
		expect(separator?.getAttribute("aria-hidden")).toBe("true");
		expect(
			separator?.querySelector("[data-slot=item-separator]"),
		).not.toBeNull();
		// hidden li does not count as a list item
		expect(screen.getAllByRole("listitem")).toHaveLength(2);
	});
});
