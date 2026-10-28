// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	NavigationMenu,
	navigationMenuTriggerStyle,
} from "#/navigation-menu/components/navigation-menu.tsx";

afterEach(cleanup);

function renderMenu(
	rootProps: React.ComponentProps<typeof NavigationMenu.Root> = {},
) {
	return render(
		<NavigationMenu.Root {...rootProps}>
			<NavigationMenu.List>
				<NavigationMenu.Item value="projects">
					<NavigationMenu.Trigger>Projects</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<NavigationMenu.Link href="#">Open projects</NavigationMenu.Link>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link
						href="#"
						className={navigationMenuTriggerStyle()}
					>
						Billing
					</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>,
	);
}

describe("NavigationMenu", () => {
	it("renders the nav landmark with list, item, and trigger slots", () => {
		const screen = renderMenu();
		expect(
			document.querySelector("nav[data-slot=navigation-menu]"),
		).not.toBeNull();
		expect(
			document.querySelector("[data-slot=navigation-menu-list]"),
		).not.toBeNull();
		expect(
			document.querySelector("[data-slot=navigation-menu-item]"),
		).not.toBeNull();
		expect(screen.getByText("Projects").getAttribute("data-slot")).toBe(
			"navigation-menu-trigger",
		);
	});

	it("keeps panel content out of the DOM while closed", () => {
		const screen = renderMenu();
		expect(screen.queryByText("Open projects")).toBeNull();
	});

	it("opens the panel when the trigger is clicked", () => {
		const screen = renderMenu();
		fireEvent.click(screen.getByText("Projects"));
		expect(screen.getByText("Open projects")).toBeTruthy();
		expect(
			document.querySelector("[data-slot=navigation-menu-content]"),
		).not.toBeNull();
	});

	it("only highlights focused triggers for keyboard users, not after clicks", () => {
		const screen = renderMenu();
		const trigger = screen.getByText("Projects");
		expect(trigger.className).toContain("focus-visible:bg-muted");
		expect(trigger.className).not.toMatch(/(?<!-visible):?\bfocus:bg-muted/);
	});

	it("styles a plain link as a trigger through navigationMenuTriggerStyle", () => {
		const screen = renderMenu();
		const billing = screen.getByText("Billing");
		expect(billing.getAttribute("data-slot")).toBe("navigation-menu-link");
		expect(billing.className).toContain("hover:bg-muted");
	});

	it("resolves focus with ring only, without an outline", () => {
		expect(navigationMenuTriggerStyle()).not.toContain(
			"focus-visible:outline-1",
		);
		expect(navigationMenuTriggerStyle()).toContain("focus-visible:ring-3");
	});

	it("merges className onto the root and the link", () => {
		const screen = render(
			<NavigationMenu.Root className="custom-nav">
				<NavigationMenu.List>
					<NavigationMenu.Item>
						<NavigationMenu.Link href="#" className="custom-link">
							Billing
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				</NavigationMenu.List>
			</NavigationMenu.Root>,
		);
		const nav = document.querySelector("nav[data-slot=navigation-menu]");
		expect(nav?.classList.contains("custom-nav")).toBe(true);
		expect(screen.getByText("Billing").classList.contains("custom-link")).toBe(
			true,
		);
	});

	it("rotates the trigger caret while its popup is open", () => {
		const screen = renderMenu();
		const caret = screen.getByText("Projects").querySelector("svg");
		expect(
			caret?.classList.contains(
				"group-data-popup-open/navigation-menu-trigger:rotate-180",
			),
		).toBe(true);
	});
});
