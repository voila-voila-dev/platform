// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Banner } from "#/banner/components/banner.tsx";
import { Button } from "#/button/components/button.tsx";

afterEach(cleanup);

describe("Banner", () => {
	it("renders with the status role and its title", () => {
		const screen = render(
			<Banner.Root>
				<Banner.Title>Maintenance planned on Sunday</Banner.Title>
			</Banner.Root>,
		);
		const banner = screen.getByRole("status");
		expect(banner.getAttribute("data-slot")).toBe("banner");
		expect(banner.querySelector("[data-slot=banner-title]")?.textContent).toBe(
			"Maintenance planned on Sunday",
		);
	});

	it("defaults to the default variant", () => {
		const screen = render(<Banner.Root>Announcement</Banner.Root>);
		expect(screen.getByRole("status").classList.contains("bg-primary")).toBe(
			true,
		);
	});

	it.each([
		["muted", "bg-muted"],
		["success", "bg-success"],
		["warning", "bg-warning"],
		["destructive", "bg-destructive"],
	] as const)("applies the %s variant", (variant, expectedClass) => {
		const screen = render(
			<Banner.Root variant={variant}>Announcement</Banner.Root>,
		);
		expect(screen.getByRole("status").classList.contains(expectedClass)).toBe(
			true,
		);
	});

	it("merges className on the root and sub-components", () => {
		const screen = render(
			<Banner.Root className="custom-banner">
				<Banner.Title className="custom-title">Title</Banner.Title>
				<Banner.Action className="custom-action">Action</Banner.Action>
			</Banner.Root>,
		);
		const banner = screen.getByRole("status");
		expect(banner.classList.contains("custom-banner")).toBe(true);
		expect(
			banner
				.querySelector("[data-slot=banner-title]")
				?.classList.contains("custom-title"),
		).toBe(true);
		expect(
			banner
				.querySelector("[data-slot=banner-action]")
				?.classList.contains("custom-action"),
		).toBe(true);
	});

	it("renders the action slot inside the banner", () => {
		const screen = render(
			<Banner.Root>
				<Banner.Title>New messaging</Banner.Title>
				<Banner.Action>
					<Button variant="outline" size="xs">
						Try it
					</Button>
				</Banner.Action>
			</Banner.Root>,
		);
		expect(screen.getByRole("button", { name: "Try it" })).toBeTruthy();
	});

	it("renders a dismiss button and forwards clicks", () => {
		const onClick = vi.fn();
		const screen = render(
			<Banner.Root>
				<Banner.Title>New feature</Banner.Title>
				<Banner.Close onClick={onClick} />
			</Banner.Root>,
		);
		const close = screen.getByRole("button", { name: "Dismiss" });
		expect(close.getAttribute("data-slot")).toBe("banner-close");
		fireEvent.click(close);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("allows overriding the dismiss button label", () => {
		const screen = render(
			<Banner.Root>
				<Banner.Title>New feature</Banner.Title>
				<Banner.Close aria-label="Fermer" />
			</Banner.Root>,
		);
		expect(screen.getByRole("button", { name: "Fermer" })).toBeTruthy();
	});
});
