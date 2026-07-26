// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Pagination } from "#/pagination/components/pagination.tsx";

afterEach(cleanup);

describe("Pagination", () => {
	it("renders a sentence-cased pagination nav", () => {
		const screen = render(<Pagination.Root />);
		const nav = screen.baseElement.querySelector("[data-slot=pagination]");
		expect(nav?.tagName).toBe("NAV");
		expect(nav?.getAttribute("aria-label")).toBe("Pagination");
	});

	it("renders content as a list of items", () => {
		const screen = render(
			<Pagination.Content>
				<Pagination.Item />
				<Pagination.Item />
			</Pagination.Content>,
		);
		const list = screen.baseElement.querySelector(
			"[data-slot=pagination-content]",
		);
		expect(list?.tagName).toBe("UL");
		expect(
			screen.baseElement.querySelectorAll("[data-slot=pagination-item]"),
		).toHaveLength(2);
	});
});

describe("Pagination.Link", () => {
	function queryLink(screen: ReturnType<typeof render>) {
		return screen.baseElement.querySelector("[data-slot=pagination-link]");
	}

	it("renders as a real anchor", () => {
		const screen = render(<Pagination.Link href="/page/2">2</Pagination.Link>);
		const link = queryLink(screen);
		expect(link?.tagName).toBe("A");
		expect(link?.getAttribute("href")).toBe("/page/2");
		expect(link?.textContent).toBe("2");
	});

	it("marks the active link with aria-current and the outline variant", () => {
		const screen = render(
			<Pagination.Link href="#" isActive>
				2
			</Pagination.Link>,
		);
		const link = queryLink(screen);
		expect(link?.getAttribute("aria-current")).toBe("page");
		expect(link?.getAttribute("data-active")).toBe("true");
		expect(link?.classList.contains("border-border")).toBe(true);
	});

	it("renders inactive links with the ghost variant and no aria-current", () => {
		const screen = render(<Pagination.Link href="#">2</Pagination.Link>);
		const link = queryLink(screen);
		expect(link?.getAttribute("aria-current")).toBeNull();
		expect(link?.hasAttribute("data-active")).toBe(false);
	});

	it("lets a variant override the active/inactive default", () => {
		const screen = render(
			<Pagination.Link href="#" isActive variant="secondary">
				2
			</Pagination.Link>,
		);
		const link = queryLink(screen);
		expect(link?.classList.contains("bg-secondary")).toBe(true);
		expect(link?.classList.contains("border-border")).toBe(false);
	});

	it("disables the link: aria-disabled, out of tab order, dimmed", () => {
		const screen = render(
			<Pagination.Link href="#" isDisabled>
				2
			</Pagination.Link>,
		);
		const link = queryLink(screen);
		expect(link?.getAttribute("aria-disabled")).toBe("true");
		expect(link?.getAttribute("tabindex")).toBe("-1");
		expect(link?.classList.contains("aria-disabled:opacity-50")).toBe(true);
	});

	it("is interactive (no aria-disabled) by default", () => {
		const screen = render(<Pagination.Link href="#">2</Pagination.Link>);
		const link = queryLink(screen);
		expect(link?.getAttribute("aria-disabled")).toBeNull();
	});
});

describe("Pagination.Previous / Pagination.Next", () => {
	it("labels and renders the previous control", () => {
		const screen = render(<Pagination.Previous href="#" />);
		const link = screen.baseElement.querySelector(
			"[data-slot=pagination-link]",
		);
		expect(link?.getAttribute("aria-label")).toBe("Go to previous page");
		expect(link?.textContent).toContain("Previous");
	});

	it("accepts overridden label text (i18n)", () => {
		const screen = render(<Pagination.Next href="#" text="Suivant" />);
		const link = screen.baseElement.querySelector(
			"[data-slot=pagination-link]",
		);
		expect(link?.textContent).toContain("Suivant");
	});

	it("forwards isDisabled through to the link", () => {
		const screen = render(<Pagination.Previous href="#" isDisabled />);
		const link = screen.baseElement.querySelector(
			"[data-slot=pagination-link]",
		);
		expect(link?.getAttribute("aria-disabled")).toBe("true");
	});
});

describe("Pagination.Ellipsis", () => {
	it("is decorative and carries no unreachable sr-only text", () => {
		const screen = render(<Pagination.Ellipsis />);
		const ellipsis = screen.baseElement.querySelector(
			"[data-slot=pagination-ellipsis]",
		);
		expect(ellipsis?.getAttribute("aria-hidden")).toBe("true");
		expect(ellipsis?.querySelector(".sr-only")).toBeNull();
		expect(ellipsis?.textContent).toBe("");
	});
});
