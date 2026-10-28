// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InputGroup } from "#/input-group/components/input-group.tsx";

afterEach(cleanup);

describe("InputGroup", () => {
	it("renders a fieldset tagged with data-slot", () => {
		const screen = render(
			<InputGroup.Root>
				<InputGroup.Input placeholder="Search" />
			</InputGroup.Root>,
		);
		const group = screen.baseElement.querySelector("[data-slot=input-group]");
		expect(group?.tagName).toBe("FIELDSET");
	});

	it("merges className onto the fieldset", () => {
		const screen = render(<InputGroup.Root className="custom-group-class" />);
		const group = screen.baseElement.querySelector("[data-slot=input-group]");
		expect(group?.classList.contains("custom-group-class")).toBe(true);
		expect(group?.classList.contains("rounded-lg")).toBe(true);
	});
});

describe("InputGroup.Addon", () => {
	// The fieldset root also carries an implicit `group` role, so the addon is
	// queried by its slot attribute instead of by role.
	function queryAddon(screen: ReturnType<typeof render>) {
		return screen.baseElement.querySelector<HTMLElement>(
			"[data-slot=input-group-addon]",
		);
	}

	it("renders a group role with the inline-start alignment by default", () => {
		const screen = render(
			<InputGroup.Root>
				<InputGroup.Addon>https://</InputGroup.Addon>
				<InputGroup.Input />
			</InputGroup.Root>,
		);
		const addon = queryAddon(screen);
		expect(addon?.getAttribute("role")).toBe("group");
		expect(addon?.getAttribute("data-align")).toBe("inline-start");
	});

	it("exposes an explicit alignment as a data attribute", () => {
		const screen = render(
			<InputGroup.Root>
				<InputGroup.Textarea />
				<InputGroup.Addon align="block-end">Hint</InputGroup.Addon>
			</InputGroup.Root>,
		);
		expect(queryAddon(screen)?.getAttribute("data-align")).toBe("block-end");
	});

	it("focuses the input when the addon is clicked", () => {
		const screen = render(
			<InputGroup.Root>
				<InputGroup.Addon>https://</InputGroup.Addon>
				<InputGroup.Input placeholder="Website" />
			</InputGroup.Root>,
		);
		fireEvent.click(queryAddon(screen) as HTMLElement);
		expect(document.activeElement).toBe(screen.getByPlaceholderText("Website"));
	});

	it("focuses the textarea when the addon is clicked", () => {
		const screen = render(
			<InputGroup.Root>
				<InputGroup.Textarea placeholder="Description" />
				<InputGroup.Addon align="block-end">Hint</InputGroup.Addon>
			</InputGroup.Root>,
		);
		fireEvent.click(queryAddon(screen) as HTMLElement);
		expect(document.activeElement).toBe(
			screen.getByPlaceholderText("Description"),
		);
	});

	it("does not steal focus when a button inside the addon is clicked", () => {
		const screen = render(
			<InputGroup.Root>
				<InputGroup.Input placeholder="Website" />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button>Copy</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Copy" }));
		expect(document.activeElement).not.toBe(
			screen.getByPlaceholderText("Website"),
		);
	});

	it("composes a consumer onClick with the focus forwarding", () => {
		const onClick = vi.fn();
		const screen = render(
			<InputGroup.Root>
				<InputGroup.Addon onClick={onClick}>https://</InputGroup.Addon>
				<InputGroup.Input placeholder="Website" />
			</InputGroup.Root>,
		);
		fireEvent.click(queryAddon(screen) as HTMLElement);
		expect(onClick).toHaveBeenCalledOnce();
		expect(document.activeElement).toBe(screen.getByPlaceholderText("Website"));
	});

	it("lets a consumer onClick cancel the focus forwarding", () => {
		const screen = render(
			<InputGroup.Root>
				<InputGroup.Addon onClick={(event) => event.preventDefault()}>
					https://
				</InputGroup.Addon>
				<InputGroup.Input placeholder="Website" />
			</InputGroup.Root>,
		);
		fireEvent.click(queryAddon(screen) as HTMLElement);
		expect(document.activeElement).not.toBe(
			screen.getByPlaceholderText("Website"),
		);
	});
});

describe("InputGroup.Text", () => {
	it("renders a span tagged with data-slot and its children", () => {
		const screen = render(<InputGroup.Text>https://</InputGroup.Text>);
		const text = screen.baseElement.querySelector(
			"[data-slot=input-group-text]",
		);
		expect(text?.tagName).toBe("SPAN");
		expect(text?.textContent).toBe("https://");
	});
});

describe("InputGroup.Button", () => {
	it("defaults to type=button at the xs size", () => {
		const screen = render(<InputGroup.Button>Copy</InputGroup.Button>);
		const button = screen.getByRole("button", { name: "Copy" });
		expect(button.getAttribute("type")).toBe("button");
		expect(button.classList.contains("h-6")).toBe(true);
	});

	it("forwards an explicit submit type", () => {
		const screen = render(
			<InputGroup.Button type="submit">Send</InputGroup.Button>,
		);
		expect(
			screen.getByRole("button", { name: "Send" }).getAttribute("type"),
		).toBe("submit");
	});
});

describe("InputGroup.Input", () => {
	it("renders an input tagged as the group control", () => {
		const screen = render(<InputGroup.Input placeholder="Search" />);
		const input = screen.getByPlaceholderText("Search");
		expect(input.tagName).toBe("INPUT");
		expect(input.getAttribute("data-slot")).toBe("input-group-control");
	});
});

describe("InputGroup.Textarea", () => {
	it("renders a textarea tagged as the group control", () => {
		const screen = render(<InputGroup.Textarea placeholder="Description" />);
		const textarea = screen.getByPlaceholderText("Description");
		expect(textarea.tagName).toBe("TEXTAREA");
		expect(textarea.getAttribute("data-slot")).toBe("input-group-control");
	});
});
