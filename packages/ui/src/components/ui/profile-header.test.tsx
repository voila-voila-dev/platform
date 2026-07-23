// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	ProfileHeader,
	ProfileHeaderCover,
} from "#/components/ui/profile-header.tsx";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
	return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("ProfileHeader", () => {
	it("renders the name and theme as data attributes", () => {
		const screen = render(<ProfileHeader name="Camille Dubois" />);
		const root = queryBySlot(screen, "profile-header");
		expect(root?.getAttribute("data-theme")).toBe("provider");
		expect(queryBySlot(screen, "profile-header-name")?.textContent).toBe(
			"Camille Dubois",
		);
	});

	it("renders the headline when provided", () => {
		const screen = render(
			<ProfileHeader name="Camille Dubois" headline="Kinésithérapeute" />,
		);
		expect(queryBySlot(screen, "profile-header-headline")?.textContent).toBe(
			"Kinésithérapeute",
		);
	});

	it("omits the headline slot when not provided", () => {
		const screen = render(<ProfileHeader name="Camille Dubois" />);
		expect(queryBySlot(screen, "profile-header-headline")).toBeNull();
	});

	it("falls back to a themed gradient cover when no coverImage is given", () => {
		const screen = render(
			<ProfileHeader name="Racing Club" theme="organization" />,
		);
		const fallback = queryBySlot(screen, "profile-header-cover-fallback");
		expect(fallback).not.toBeNull();
		expect(fallback?.className).toContain("from-organization");
	});

	it("renders a string coverImage as an img", () => {
		const screen = render(
			<ProfileHeader
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
		const screen = render(<ProfileHeader name="Camille Dubois" />);
		expect(queryBySlot(screen, "profile-header-avatar")?.textContent).toBe(
			"CD",
		);
	});

	it("accepts an avatar descriptor and derives initials from its name", () => {
		const screen = render(
			<ProfileHeader
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
			<ProfileHeader
				name="Camille Dubois"
				avatar={<span data-slot="custom-avatar">★</span>}
			/>,
		);
		expect(queryBySlot(screen, "custom-avatar")?.textContent).toBe("★");
	});

	it("renders the badges and actions slots", () => {
		const screen = render(
			<ProfileHeader
				name="Camille Dubois"
				badges={<Badge>Vérifié</Badge>}
				actions={<Button>Contacter</Button>}
			/>,
		);
		expect(queryBySlot(screen, "profile-header-badges")?.textContent).toBe(
			"Vérifié",
		);
		expect(queryBySlot(screen, "profile-header-actions")?.textContent).toBe(
			"Contacter",
		);
	});

	it("merges a consumer className into the root", () => {
		const screen = render(
			<ProfileHeader name="Camille Dubois" className="custom-header" />,
		);
		expect(
			queryBySlot(screen, "profile-header")?.classList.contains(
				"custom-header",
			),
		).toBe(true);
	});
});

describe("ProfileHeaderCover", () => {
	it("renders standalone with a themed gradient fallback", () => {
		const screen = render(<ProfileHeaderCover theme="provider" />);
		const cover = queryBySlot(screen, "profile-header-cover");
		expect(cover?.getAttribute("data-theme")).toBe("provider");
		expect(
			queryBySlot(screen, "profile-header-cover-fallback")?.className,
		).toContain("from-provider");
	});
});
