// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Breadcrumb } from "#/breadcrumb/components/breadcrumb.tsx";

afterEach(cleanup);

function Fixture() {
	return (
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Ellipsis />
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Launch week coverage</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	);
}

describe("Breadcrumb", () => {
	it("renders a labelled navigation landmark with an ordered list", () => {
		const screen = render(<Fixture />);
		const nav = screen.getByRole("navigation", { name: "breadcrumb" });
		expect(nav.getAttribute("data-slot")).toBe("breadcrumb");
		const list = nav.querySelector("[data-slot=breadcrumb-list]");
		expect(list?.tagName).toBe("OL");
		expect(list?.querySelectorAll("[data-slot=breadcrumb-item]").length).toBe(
			3,
		);
	});

	it("merges className on the root nav", () => {
		const screen = render(
			<Breadcrumb.Root className="custom-nav-class">
				<Breadcrumb.List />
			</Breadcrumb.Root>,
		);
		const nav = screen.getByRole("navigation", { name: "breadcrumb" });
		expect(nav.classList.contains("custom-nav-class")).toBe(true);
	});
});

describe("Breadcrumb.Link", () => {
	it("renders an anchor by default", () => {
		const screen = render(<Fixture />);
		const link = screen.getByRole("link", { name: "Dashboard" });
		expect(link.tagName).toBe("A");
		expect(link.getAttribute("href")).toBe("/dashboard");
		expect(link.getAttribute("data-slot")).toBe("breadcrumb-link");
	});

	it("renders a custom element via the render prop", () => {
		function RouterLink({
			to,
			...props
		}: React.ComponentProps<"a"> & { to: string }) {
			return <a href={to} {...props} />;
		}
		const screen = render(
			<Breadcrumb.Link render={<RouterLink to="/projects" />}>
				Projects
			</Breadcrumb.Link>,
		);
		const link = screen.getByRole("link", { name: "Projects" });
		expect(link.getAttribute("href")).toBe("/projects");
		expect(link.getAttribute("data-slot")).toBe("breadcrumb-link");
		expect(link.classList.contains("transition-colors")).toBe(true);
	});
});

describe("Breadcrumb.Page", () => {
	it("marks the current page without disabling it", () => {
		const screen = render(<Fixture />);
		const page = screen.getByText("Launch week coverage");
		expect(page.tagName).toBe("SPAN");
		expect(page.getAttribute("aria-current")).toBe("page");
		expect(page.getAttribute("aria-disabled")).toBeNull();
	});
});

describe("Breadcrumb.Separator", () => {
	it("is presentational and hidden from the accessibility tree", () => {
		const screen = render(<Fixture />);
		const separators = screen.baseElement.querySelectorAll(
			"[data-slot=breadcrumb-separator]",
		);
		expect(separators.length).toBe(2);
		for (const separator of separators) {
			expect(separator.getAttribute("role")).toBe("presentation");
			expect(separator.getAttribute("aria-hidden")).toBe("true");
			expect(separator.querySelector("svg")).not.toBeNull();
		}
	});

	it("renders custom children instead of the default caret", () => {
		const screen = render(
			<Breadcrumb.List>
				<Breadcrumb.Separator>/</Breadcrumb.Separator>
			</Breadcrumb.List>,
		);
		const separator = screen.baseElement.querySelector(
			"[data-slot=breadcrumb-separator]",
		);
		expect(separator?.textContent).toBe("/");
		expect(separator?.querySelector("svg")).toBeNull();
	});
});

describe("Breadcrumb.Ellipsis", () => {
	it("exposes its label to the accessibility tree", () => {
		const screen = render(<Fixture />);
		const ellipsis = screen.baseElement.querySelector(
			"[data-slot=breadcrumb-ellipsis]",
		);
		expect(ellipsis?.getAttribute("aria-hidden")).toBeNull();
		expect(screen.getByText("More")).toBeTruthy();
	});

	it("renders as a button via the render prop", () => {
		const screen = render(
			<Breadcrumb.Ellipsis render={<button type="button" />} />,
		);
		const trigger = screen.getByRole("button", { name: "More" });
		expect(trigger.getAttribute("data-slot")).toBe("breadcrumb-ellipsis");
		expect(trigger.querySelector("svg")).not.toBeNull();
	});

	it("lets consumers replace the default children", () => {
		const screen = render(<Breadcrumb.Ellipsis>…</Breadcrumb.Ellipsis>);
		const ellipsis = screen.baseElement.querySelector(
			"[data-slot=breadcrumb-ellipsis]",
		);
		expect(ellipsis?.textContent).toBe("…");
		expect(ellipsis?.querySelector("svg")).toBeNull();
	});
});
