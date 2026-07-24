// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ItemContent, ItemTitle } from "#/components/ui/item.tsx";
import { List, ListItem, ListSeparator } from "#/components/ui/list.tsx";

afterEach(cleanup);

function querySlot(screen: ReturnType<typeof render>, slot: string) {
	return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("List", () => {
	it("renders a ul with an explicit list role and its own data-slot", () => {
		const screen = render(<List />);
		const list = querySlot(screen, "list");
		expect(list?.tagName).toBe("UL");
		expect(list?.getAttribute("role")).toBe("list");
	});

	it("keeps the ItemGroup recipe and strips list bullets", () => {
		const screen = render(<List />);
		const className = querySlot(screen, "list")?.className ?? "";
		expect(className).toContain("group/item-group");
		expect(className).toContain("flex-col");
		expect(className).toContain("list-none");
	});

	it("merges a consumer className over the base", () => {
		const screen = render(<List className="gap-0" />);
		const className = querySlot(screen, "list")?.className ?? "";
		expect(className).toContain("gap-0");
		expect(className).not.toContain("gap-4");
	});
});

describe("ListItem", () => {
	it("renders an li carrying the Item recipe", () => {
		const screen = render(
			<List>
				<ListItem>Project</ListItem>
			</List>,
		);
		const item = querySlot(screen, "list-item");
		expect(item?.tagName).toBe("LI");
		expect(item?.className).toContain("group/item");
		expect(item?.parentElement?.tagName).toBe("UL");
	});

	it("supports the Item variant and size props", () => {
		const screen = render(
			<List>
				<ListItem variant="outline" size="sm">
					Project
				</ListItem>
			</List>,
		);
		const item = querySlot(screen, "list-item");
		expect(item?.getAttribute("data-variant")).toBe("outline");
		expect(item?.getAttribute("data-size")).toBe("sm");
		expect(item?.className).toContain("border-border");
	});

	it("composes with the Item child components", () => {
		const screen = render(
			<List>
				<ListItem>
					<ItemContent>
						<ItemTitle>Dr Dupont</ItemTitle>
					</ItemContent>
				</ListItem>
			</List>,
		);
		const title = querySlot(screen, "item-title");
		expect(title?.textContent).toBe("Dr Dupont");
		expect(title?.closest("li")).toBe(querySlot(screen, "list-item"));
	});

	it("exposes list semantics to the accessibility tree", () => {
		const screen = render(
			<List aria-label="Projects">
				<ListItem>First</ListItem>
				<ListItem>Second</ListItem>
			</List>,
		);
		const list = screen.getByRole("list", { name: "Projects" });
		expect(screen.getAllByRole("listitem")).toHaveLength(2);
		expect(list.querySelectorAll("li")).toHaveLength(2);
	});
});

describe("ListSeparator", () => {
	it("renders inside a presentational li hidden from assistive tech", () => {
		const screen = render(
			<List>
				<ListItem>First</ListItem>
				<ListSeparator />
				<ListItem>Second</ListItem>
			</List>,
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
