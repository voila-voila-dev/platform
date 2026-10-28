// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SiteHeader } from "#/landing/components/site-header/index.ts";

afterEach(cleanup);

function renderHeader() {
	return render(
		<SiteHeader.Root>
			<SiteHeader.Bar>
				<SiteHeader.Brand href="/">acme.dev</SiteHeader.Brand>
				<SiteHeader.Nav>
					<SiteHeader.NavList>
						<SiteHeader.NavItem href="/#how-it-works">
							How it works
						</SiteHeader.NavItem>
					</SiteHeader.NavList>
				</SiteHeader.Nav>
				<SiteHeader.MobileToggle aria-label="Ouvrir ou fermer le menu" />
			</SiteHeader.Bar>
			<SiteHeader.MobileMenu>
				<SiteHeader.MobileNavItem href="/#how-it-works">
					How it works
				</SiteHeader.MobileNavItem>
			</SiteHeader.MobileMenu>
		</SiteHeader.Root>,
	);
}

describe("SiteHeader", () => {
	it("renders the menu closed and toggles it from the button", () => {
		const screen = renderHeader();
		const menu = screen.container.querySelector(
			"[data-slot=site-header-mobile-menu]",
		);
		const toggle = screen.getByRole("button", {
			name: "Ouvrir ou fermer le menu",
		});

		expect(menu?.classList.contains("hidden")).toBe(true);
		expect(toggle.getAttribute("aria-expanded")).toBe("false");

		fireEvent.click(toggle);
		expect(menu?.classList.contains("hidden")).toBe(false);
		expect(toggle.getAttribute("aria-expanded")).toBe("true");

		fireEvent.click(toggle);
		expect(menu?.classList.contains("hidden")).toBe(true);
	});

	it("renders nav items as anchors by default and supports render overrides", () => {
		const screen = renderHeader();
		// The label appears twice: desktop nav + mobile menu.
		const links = screen.getAllByRole("link", { name: "How it works" });
		expect(links.length).toBe(2);
		for (const link of links) {
			expect(link.getAttribute("href")).toBe("/#how-it-works");
		}

		cleanup();

		const custom = render(
			<SiteHeader.Root>
				<SiteHeader.Bar>
					<SiteHeader.Nav>
						<SiteHeader.NavList>
							<SiteHeader.NavItem
								render={<button type="button">Action</button>}
							/>
						</SiteHeader.NavList>
					</SiteHeader.Nav>
				</SiteHeader.Bar>
			</SiteHeader.Root>,
		);
		const button = custom.getByRole("button", { name: "Action" });
		expect(button.classList.contains("text-muted-foreground")).toBe(true);
	});
});
