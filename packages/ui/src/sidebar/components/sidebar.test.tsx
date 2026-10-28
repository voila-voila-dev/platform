// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import type * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Sidebar, useSidebar } from "#/sidebar/components/sidebar.tsx";

const DESKTOP_WIDTH = 1024;
const MOBILE_WIDTH = 500;

function setViewportWidth(width: number) {
	Object.defineProperty(window, "innerWidth", {
		configurable: true,
		writable: true,
		value: width,
	});
}

beforeEach(() => {
	setViewportWidth(DESKTOP_WIDTH);
	vi.stubGlobal(
		"matchMedia",
		vi.fn().mockImplementation((query: string) => ({
			matches: window.innerWidth < 768,
			media: query,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		})),
	);
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

function Fixture(props: React.ComponentProps<typeof Sidebar.Root>) {
	return (
		<Sidebar.Provider>
			<Sidebar.Root {...props}>
				<Sidebar.Header>Acme Studio</Sidebar.Header>
				<Sidebar.Content>
					<Sidebar.Group>
						<Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								<Sidebar.MenuItem>
									<Sidebar.MenuButton isActive>
										<span>Dashboard</span>
									</Sidebar.MenuButton>
									<Sidebar.MenuBadge>12</Sidebar.MenuBadge>
								</Sidebar.MenuItem>
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Sidebar.Group>
				</Sidebar.Content>
			</Sidebar.Root>
			<Sidebar.Inset>
				<Sidebar.Trigger />
			</Sidebar.Inset>
		</Sidebar.Provider>
	);
}

function querySidebar() {
	return document.querySelector("[data-slot=sidebar]");
}

describe("Sidebar.Provider", () => {
	it("exposes the width CSS variables on the wrapper", () => {
		const screen = render(<Fixture />);
		const wrapper = screen.baseElement.querySelector(
			"[data-slot=sidebar-wrapper]",
		) as HTMLElement;
		expect(wrapper.style.getPropertyValue("--sidebar-width")).toBe("16rem");
		expect(wrapper.style.getPropertyValue("--sidebar-width-icon")).toBe("3rem");
	});

	it("lets style override the default width variable", () => {
		const screen = render(
			<Sidebar.Provider
				style={{ "--sidebar-width": "20rem" } as React.CSSProperties}
			>
				<Sidebar.Root />
			</Sidebar.Provider>,
		);
		const wrapper = screen.baseElement.querySelector(
			"[data-slot=sidebar-wrapper]",
		) as HTMLElement;
		expect(wrapper.style.getPropertyValue("--sidebar-width")).toBe("20rem");
	});

	it("throws a descriptive error when useSidebar is used outside the provider", () => {
		function Orphan() {
			useSidebar();
			return null;
		}
		expect(() => render(<Orphan />)).toThrowError(
			"useSidebar must be used within a SidebarProvider.",
		);
	});

	it("supports controlled open state", () => {
		const onOpenChange = vi.fn();
		const screen = render(
			<Sidebar.Provider open={false} onOpenChange={onOpenChange}>
				<Sidebar.Root />
				<Sidebar.Trigger />
			</Sidebar.Provider>,
		);
		expect(querySidebar()?.getAttribute("data-state")).toBe("collapsed");
		fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it("toggles with the default Cmd/Ctrl+B shortcut", () => {
		render(<Fixture />);
		expect(querySidebar()?.getAttribute("data-state")).toBe("expanded");
		fireEvent.keyDown(window, { key: "b", metaKey: true });
		expect(querySidebar()?.getAttribute("data-state")).toBe("collapsed");
	});

	it("supports a custom keyboard shortcut", () => {
		render(
			<Sidebar.Provider keyboardShortcut="m">
				<Sidebar.Root />
			</Sidebar.Provider>,
		);
		fireEvent.keyDown(window, { key: "b", metaKey: true });
		expect(querySidebar()?.getAttribute("data-state")).toBe("expanded");
		fireEvent.keyDown(window, { key: "m", metaKey: true });
		expect(querySidebar()?.getAttribute("data-state")).toBe("collapsed");
	});

	it("disables the keyboard shortcut with keyboardShortcut={false}", () => {
		render(
			<Sidebar.Provider keyboardShortcut={false}>
				<Sidebar.Root />
			</Sidebar.Provider>,
		);
		fireEvent.keyDown(window, { key: "b", metaKey: true });
		expect(querySidebar()?.getAttribute("data-state")).toBe("expanded");
	});
});

describe("Sidebar (desktop)", () => {
	it("stamps state, side, variant and collapsible data attributes", () => {
		render(<Fixture side="right" variant="floating" collapsible="icon" />);
		const sidebar = querySidebar();
		expect(sidebar?.getAttribute("data-state")).toBe("expanded");
		expect(sidebar?.getAttribute("data-side")).toBe("right");
		expect(sidebar?.getAttribute("data-variant")).toBe("floating");
		// collapsible is only stamped while collapsed
		expect(sidebar?.getAttribute("data-collapsible")).toBe("");
	});

	it("stamps the collapsible mode once collapsed", () => {
		const screen = render(<Fixture collapsible="icon" />);
		fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
		expect(querySidebar()?.getAttribute("data-collapsible")).toBe("icon");
	});

	it("applies className and dir to the container", () => {
		const screen = render(<Fixture className="custom-sidebar" dir="rtl" />);
		const container = screen.baseElement.querySelector(
			"[data-slot=sidebar-container]",
		);
		expect(container?.classList.contains("custom-sidebar")).toBe(true);
		expect(container?.getAttribute("dir")).toBe("rtl");
	});

	it("renders a plain styled div with collapsible none", () => {
		const screen = render(
			<Sidebar.Provider>
				<Sidebar.Root collapsible="none" className="custom-sidebar" />
			</Sidebar.Provider>,
		);
		const sidebar = screen.baseElement.querySelector("[data-slot=sidebar]");
		expect(sidebar?.getAttribute("data-state")).toBeNull();
		expect(sidebar?.classList.contains("custom-sidebar")).toBe(true);
	});
});

describe("Sidebar (mobile)", () => {
	beforeEach(() => {
		setViewportWidth(MOBILE_WIDTH);
	});

	it("renders inside a sheet and keeps className and sr-only labels", async () => {
		const screen = render(<Fixture className="custom-sidebar" />);
		expect(querySidebar()).toBeNull();
		fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
		await waitFor(() => {
			const sheet = querySidebar();
			expect(sheet?.getAttribute("data-mobile")).toBe("true");
			// the mobile branch must not drop the consumer className
			expect(sheet?.classList.contains("custom-sidebar")).toBe(true);
		});
		expect(screen.getByText("Sidebar")).toBeTruthy();
		expect(screen.getByText("Displays the mobile sidebar.")).toBeTruthy();
	});

	it("lets consumers localize the sheet title and description", async () => {
		const screen = render(
			<Fixture
				sheetTitle="Sidebar"
				sheetDescription="Shows the mobile sidebar."
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
		await waitFor(() => {
			expect(screen.getByText("Sidebar")).toBeTruthy();
			expect(screen.getByText("Shows the mobile sidebar.")).toBeTruthy();
		});
	});
});

describe("Sidebar.Trigger", () => {
	it("toggles the sidebar and keeps a consumer onClick", () => {
		const onClick = vi.fn();
		const screen = render(
			<Sidebar.Provider>
				<Sidebar.Root />
				<Sidebar.Trigger onClick={onClick} />
			</Sidebar.Provider>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(querySidebar()?.getAttribute("data-state")).toBe("collapsed");
	});

	it("lets consumers replace the default icon and label", () => {
		const screen = render(
			<Sidebar.Provider>
				<Sidebar.Root />
				<Sidebar.Trigger>Open the menu</Sidebar.Trigger>
			</Sidebar.Provider>,
		);
		expect(screen.getByRole("button", { name: "Open the menu" })).toBeTruthy();
		expect(screen.queryByText("Toggle Sidebar")).toBeNull();
	});
});

describe("Sidebar.MenuButton", () => {
	it("stamps active state and size as data attributes", () => {
		const screen = render(<Fixture />);
		const button = screen.getByRole("button", { name: "Dashboard" });
		// Base UI stamps boolean state as a bare attribute
		expect(button.hasAttribute("data-active")).toBe(true);
		expect(button.getAttribute("data-size")).toBe("default");
		expect(button.getAttribute("data-slot")).toBe("sidebar-menu-button");
	});

	it("renders a custom element via the render prop", () => {
		function RouterLink({
			to,
			...props
		}: React.ComponentProps<"a"> & { to: string }) {
			return <a href={to} {...props} />;
		}
		const screen = render(
			<Sidebar.Provider>
				<Sidebar.Root>
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton render={<RouterLink to="/projects" />}>
								Projects
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					</Sidebar.Menu>
				</Sidebar.Root>
			</Sidebar.Provider>,
		);
		const link = screen.getByRole("link", { name: "Projects" });
		expect(link.getAttribute("href")).toBe("/projects");
		expect(link.getAttribute("data-slot")).toBe("sidebar-menu-button");
	});

	it("wraps the button in a tooltip when tooltip is provided", async () => {
		const screen = render(
			<Sidebar.Provider defaultOpen={false}>
				<Sidebar.Root>
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton tooltip="Dashboard">
								<span>Dashboard</span>
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					</Sidebar.Menu>
				</Sidebar.Root>
			</Sidebar.Provider>,
		);
		const button = screen.getByRole("button", { name: "Dashboard" });
		fireEvent.focus(button);
		await waitFor(() => {
			expect(
				document.querySelector("[data-slot=tooltip-content]"),
			).not.toBeNull();
		});
	});
});

describe("Sidebar.MenuSub", () => {
	it("renders sub menu items with size and active attributes", () => {
		const screen = render(
			<Sidebar.Provider>
				<Sidebar.Root>
					<Sidebar.MenuSub>
						<Sidebar.MenuSubItem>
							<Sidebar.MenuSubButton href="/reports" size="sm" isActive>
								Reports
							</Sidebar.MenuSubButton>
						</Sidebar.MenuSubItem>
					</Sidebar.MenuSub>
				</Sidebar.Root>
			</Sidebar.Provider>,
		);
		const link = screen.getByRole("link", { name: "Reports" });
		expect(link.getAttribute("data-size")).toBe("sm");
		expect(link.hasAttribute("data-active")).toBe(true);
	});
});

describe("Sidebar.MenuSkeleton", () => {
	it("derives a stable width within 50-90% instead of a random one", async () => {
		const { renderToString } = await import("react-dom/server");
		function Skeletons() {
			return (
				<Sidebar.Provider>
					<Sidebar.Root>
						<Sidebar.MenuSkeleton showIcon />
					</Sidebar.Root>
				</Sidebar.Provider>
			);
		}
		const extractWidth = (html: string) =>
			html.match(/--skeleton-width:\s*(\d+%)/)?.[1];
		// renderToString restarts the useId sequence per call: two server passes
		// (and therefore server + hydrating client) must agree on the width,
		// which Math.random() did not.
		const width = extractWidth(renderToString(<Skeletons />));
		expect(width).toMatch(/^(5\d|6\d|7\d|8\d|90)%$/);
		expect(extractWidth(renderToString(<Skeletons />))).toBe(width);
	});
});
