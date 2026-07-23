// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	Banner,
	BannerAction,
	BannerClose,
	BannerTitle,
} from "#/components/ui/banner.tsx";
import { Button } from "#/components/ui/button.tsx";

afterEach(cleanup);

describe("Banner", () => {
	it("renders with the status role and its title", () => {
		const screen = render(
			<Banner>
				<BannerTitle>Maintenance planned on Sunday</BannerTitle>
			</Banner>,
		);
		const banner = screen.getByRole("status");
		expect(banner.getAttribute("data-slot")).toBe("banner");
		expect(banner.querySelector("[data-slot=banner-title]")?.textContent).toBe(
			"Maintenance planned on Sunday",
		);
	});

	it("defaults to the default variant", () => {
		const screen = render(<Banner>Announcement</Banner>);
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
		const screen = render(<Banner variant={variant}>Announcement</Banner>);
		expect(screen.getByRole("status").classList.contains(expectedClass)).toBe(
			true,
		);
	});

	it("merges className on the root and sub-components", () => {
		const screen = render(
			<Banner className="custom-banner">
				<BannerTitle className="custom-title">Title</BannerTitle>
				<BannerAction className="custom-action">Action</BannerAction>
			</Banner>,
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
			<Banner>
				<BannerTitle>New messaging</BannerTitle>
				<BannerAction>
					<Button variant="outline" size="xs">
						Try it
					</Button>
				</BannerAction>
			</Banner>,
		);
		expect(screen.getByRole("button", { name: "Try it" })).toBeTruthy();
	});

	it("renders a dismiss button and forwards clicks", () => {
		const onClick = vi.fn();
		const screen = render(
			<Banner>
				<BannerTitle>New feature</BannerTitle>
				<BannerClose onClick={onClick} />
			</Banner>,
		);
		const close = screen.getByRole("button", { name: "Dismiss" });
		expect(close.getAttribute("data-slot")).toBe("banner-close");
		fireEvent.click(close);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("allows overriding the dismiss button label", () => {
		const screen = render(
			<Banner>
				<BannerTitle>Nouvelle fonctionnalité</BannerTitle>
				<BannerClose aria-label="Fermer" />
			</Banner>,
		);
		expect(screen.getByRole("button", { name: "Fermer" })).toBeTruthy();
	});
});
