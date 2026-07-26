// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Badge } from "#/badge/components/badge.tsx";
import { Button } from "#/button/components/button.tsx";
import { ProfileHeader } from "#/profile-header/components/profile-header.tsx";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
	return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("ProfileHeader", () => {
	it("renders the name and theme as data attributes", () => {
		const screen = render(<ProfileHeader.Root name="Camille Dubois" />);
		const root = queryBySlot(screen, "profile-header");
		expect(root?.getAttribute("data-theme")).toBe("brand");
		expect(queryBySlot(screen, "profile-header-name")?.textContent).toBe(
			"Camille Dubois",
		);
	});

	it("renders the headline when provided", () => {
		const screen = render(
			<ProfileHeader.Root name="Camille Dubois" headline="Product designer" />,
		);
		expect(queryBySlot(screen, "profile-header-headline")?.textContent).toBe(
			"Product designer",
		);
	});

	it("omits the headline slot when not provided", () => {
		const screen = render(<ProfileHeader.Root name="Camille Dubois" />);
		expect(queryBySlot(screen, "profile-header-headline")).toBeNull();
	});

	it("falls back to a themed gradient cover when no coverImage is given", () => {
		const screen = render(
			<ProfileHeader.Root name="Northwind Agency" theme="highlight" />,
		);
		const fallback = queryBySlot(screen, "profile-header-cover-fallback");
		expect(fallback).not.toBeNull();
		expect(fallback?.className).toContain("from-highlight");
	});

	it("renders a string coverImage as an img", () => {
		const screen = render(
			<ProfileHeader.Root
				name="Camille Dubois"
				coverImage="https://acme.dev/cover.jpg"
			/>,
		);
		const image = queryBySlot(screen, "profile-header-cover-image");
		expect(image?.tagName).toBe("IMG");
		expect(image?.getAttribute("src")).toBe("https://acme.dev/cover.jpg");
		expect(queryBySlot(screen, "profile-header-cover-fallback")).toBeNull();
	});

	it("derives avatar initials from the name by default", () => {
		const screen = render(<ProfileHeader.Root name="Camille Dubois" />);
		expect(queryBySlot(screen, "profile-header-avatar")?.textContent).toBe(
			"CD",
		);
	});

	it("accepts an avatar descriptor and derives initials from its name", () => {
		const screen = render(
			<ProfileHeader.Root
				name="Camille Dubois"
				// A descriptor (not a ReactNode) should take the built-in Avatar path,
				// deriving its fallback initials from the descriptor's own name.
				avatar={{ src: "https://acme.dev/avatar.png", name: "Nathan Guyot" }}
			/>,
		);
		const avatarSlot = queryBySlot(screen, "profile-header-avatar");
		expect(avatarSlot?.querySelector("[data-slot=avatar]")).not.toBeNull();
		expect(avatarSlot?.textContent).toBe("NG");
	});

	it("renders a custom avatar node verbatim", () => {
		const screen = render(
			<ProfileHeader.Root
				name="Camille Dubois"
				avatar={<span data-slot="custom-avatar">★</span>}
			/>,
		);
		expect(queryBySlot(screen, "custom-avatar")?.textContent).toBe("★");
	});

	it("renders the badges and actions slots", () => {
		const screen = render(
			<ProfileHeader.Root
				name="Camille Dubois"
				badges={<Badge>Verified</Badge>}
				actions={<Button>Contacter</Button>}
			/>,
		);
		expect(queryBySlot(screen, "profile-header-badges")?.textContent).toBe(
			"Verified",
		);
		expect(queryBySlot(screen, "profile-header-actions")?.textContent).toBe(
			"Contacter",
		);
	});

	it("merges a consumer className into the root", () => {
		const screen = render(
			<ProfileHeader.Root name="Camille Dubois" className="custom-header" />,
		);
		expect(
			queryBySlot(screen, "profile-header")?.classList.contains(
				"custom-header",
			),
		).toBe(true);
	});
});

describe("ProfileHeader.Cover", () => {
	it("renders standalone with a themed gradient fallback", () => {
		const screen = render(<ProfileHeader.Cover theme="brand" />);
		const cover = queryBySlot(screen, "profile-header-cover");
		expect(cover?.getAttribute("data-theme")).toBe("brand");
		expect(
			queryBySlot(screen, "profile-header-cover-fallback")?.className,
		).toContain("from-brand");
	});
});
