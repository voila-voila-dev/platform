// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import type * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSkeleton,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarTrigger,
	useSidebar,
} from "#/components/ui/sidebar.tsx";

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

function Fixture(props: React.ComponentProps<typeof Sidebar>) {
	return (
		<SidebarProvider>
			<Sidebar {...props}>
				<SidebarHeader>Acme Studio</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Platform</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton isActive>
										<span>Dashboard</span>
									</SidebarMenuButton>
									<SidebarMenuBadge>12</SidebarMenuBadge>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
			<SidebarInset>
				<SidebarTrigger />
			</SidebarInset>
		</SidebarProvider>
	);
}

function querySidebar() {
	return document.querySelector("[data-slot=sidebar]");
}

describe("SidebarProvider", () => {
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
			<SidebarProvider
				style={{ "--sidebar-width": "20rem" } as React.CSSProperties}
			>
				<Sidebar />
			</SidebarProvider>,
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
			<SidebarProvider open={false} onOpenChange={onOpenChange}>
				<Sidebar />
				<SidebarTrigger />
			</SidebarProvider>,
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
			<SidebarProvider keyboardShortcut="m">
				<Sidebar />
			</SidebarProvider>,
		);
		fireEvent.keyDown(window, { key: "b", metaKey: true });
		expect(querySidebar()?.getAttribute("data-state")).toBe("expanded");
		fireEvent.keyDown(window, { key: "m", metaKey: true });
		expect(querySidebar()?.getAttribute("data-state")).toBe("collapsed");
	});

	it("disables the keyboard shortcut with keyboardShortcut={false}", () => {
		render(
			<SidebarProvider keyboardShortcut={false}>
				<Sidebar />
			</SidebarProvider>,
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
			<SidebarProvider>
				<Sidebar collapsible="none" className="custom-sidebar" />
			</SidebarProvider>,
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

describe("SidebarTrigger", () => {
	it("toggles the sidebar and keeps a consumer onClick", () => {
		const onClick = vi.fn();
		const screen = render(
			<SidebarProvider>
				<Sidebar />
				<SidebarTrigger onClick={onClick} />
			</SidebarProvider>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(querySidebar()?.getAttribute("data-state")).toBe("collapsed");
	});

	it("lets consumers replace the default icon and label", () => {
		const screen = render(
			<SidebarProvider>
				<Sidebar />
				<SidebarTrigger>Open the menu</SidebarTrigger>
			</SidebarProvider>,
		);
		expect(screen.getByRole("button", { name: "Open the menu" })).toBeTruthy();
		expect(screen.queryByText("Toggle Sidebar")).toBeNull();
	});
});

describe("SidebarMenuButton", () => {
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
			<SidebarProvider>
				<Sidebar>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton render={<RouterLink to="/projects" />}>
								Projects
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</Sidebar>
			</SidebarProvider>,
		);
		const link = screen.getByRole("link", { name: "Projects" });
		expect(link.getAttribute("href")).toBe("/projects");
		expect(link.getAttribute("data-slot")).toBe("sidebar-menu-button");
	});

	it("wraps the button in a tooltip when tooltip is provided", async () => {
		const screen = render(
			<SidebarProvider defaultOpen={false}>
				<Sidebar>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton tooltip="Dashboard">
								<span>Dashboard</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</Sidebar>
			</SidebarProvider>,
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

describe("SidebarMenuSub", () => {
	it("renders sub menu items with size and active attributes", () => {
		const screen = render(
			<SidebarProvider>
				<Sidebar>
					<SidebarMenuSub>
						<SidebarMenuSubItem>
							<SidebarMenuSubButton href="/reports" size="sm" isActive>
								Reports
							</SidebarMenuSubButton>
						</SidebarMenuSubItem>
					</SidebarMenuSub>
				</Sidebar>
			</SidebarProvider>,
		);
		const link = screen.getByRole("link", { name: "Reports" });
		expect(link.getAttribute("data-size")).toBe("sm");
		expect(link.hasAttribute("data-active")).toBe(true);
	});
});

describe("SidebarMenuSkeleton", () => {
	it("derives a stable width within 50-90% instead of a random one", async () => {
		const { renderToString } = await import("react-dom/server");
		function Skeletons() {
			return (
				<SidebarProvider>
					<Sidebar>
						<SidebarMenuSkeleton showIcon />
					</Sidebar>
				</SidebarProvider>
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
