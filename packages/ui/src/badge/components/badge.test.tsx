// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Badge } from "#/badge/components/badge.tsx";
import {
	badgeColors,
	badgeVariantOptions,
	badgeVariants,
} from "#/badge/components/badge-variants.ts";

afterEach(cleanup);

function queryBadge(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector("[data-slot=badge]");
}

describe("Badge", () => {
	it("renders its children in a span by default", () => {
		const screen = render(<Badge>Open</Badge>);
		const badge = queryBadge(screen);
		expect(badge?.tagName).toBe("SPAN");
		expect(badge?.textContent).toBe("Open");
	});

	it("exposes the default variant and size as data attributes", () => {
		const screen = render(<Badge>Open</Badge>);
		const badge = queryBadge(screen);
		expect(badge?.getAttribute("data-variant")).toBe("default");
		expect(badge?.getAttribute("data-size")).toBe("default");
		expect(badge?.getAttribute("data-color")).toBeNull();
	});

	it.each(
		badgeVariantOptions,
	)("exposes variant %s as a data attribute", (variant) => {
		const screen = render(<Badge variant={variant}>Open</Badge>);
		expect(queryBadge(screen)?.getAttribute("data-variant")).toBe(variant);
	});

	it.each(badgeColors)("exposes color %s as a data attribute", (color) => {
		const screen = render(<Badge color={color}>Open</Badge>);
		const badge = queryBadge(screen);
		expect(badge?.getAttribute("data-color")).toBe(color);
		expect(badge?.classList.contains(`bg-badge-${color}`)).toBe(true);
	});

	it("exposes the sm size as a data attribute with its classes", () => {
		const screen = render(<Badge size="sm">Open</Badge>);
		const badge = queryBadge(screen);
		expect(badge?.getAttribute("data-size")).toBe("sm");
		expect(badge?.classList.contains("h-4")).toBe(true);
		expect(badge?.classList.contains("h-5")).toBe(false);
	});

	it("lets the color axis win over the variant background", () => {
		const screen = render(
			<Badge variant="default" color="blue">
				Open
			</Badge>,
		);
		const badge = queryBadge(screen);
		expect(badge?.classList.contains("bg-badge-blue")).toBe(true);
		expect(badge?.classList.contains("bg-primary")).toBe(false);
		expect(badge?.classList.contains("text-badge-blue-foreground")).toBe(true);
		expect(badge?.classList.contains("text-primary-foreground")).toBe(false);
	});

	it("merges className over the variant classes", () => {
		const screen = render(<Badge className="custom-badge-class">Open</Badge>);
		expect(queryBadge(screen)?.classList.contains("custom-badge-class")).toBe(
			true,
		);
	});

	it("renders as an anchor via the render prop", () => {
		const screen = render(
			<Badge render={<a href="/projects">Open projects</a>} />,
		);
		const badge = queryBadge(screen);
		expect(badge?.tagName).toBe("A");
		expect(badge?.getAttribute("href")).toBe("/projects");
		expect(badge?.textContent).toBe("Open projects");
		expect(badge?.classList.contains("rounded-4xl")).toBe(true);
	});
});

describe("badge exports", () => {
	it("keeps badgeColors in sync with the color axis", () => {
		for (const color of badgeColors) {
			expect(badgeVariants({ color })).toContain(`bg-badge-${color}`);
		}
		expect(badgeColors.length).toBe(20);
	});

	it("keeps badgeVariantOptions in sync with the variant axis", () => {
		for (const variant of badgeVariantOptions) {
			expect(badgeVariants({ variant }).length).toBeGreaterThan(0);
		}
		expect(badgeVariantOptions.length).toBe(8);
	});
});

describe("badge soft appearance", () => {
	it("defaults to the solid appearance", () => {
		const screen = render(<Badge color="emerald">Vérifié</Badge>);
		const badge = queryBadge(screen);
		expect(badge?.getAttribute("data-appearance")).toBe("solid");
		expect(badge?.classList.contains("bg-badge-emerald")).toBe(true);
	});

	it("tints the background and mixes the text tone when soft", () => {
		const screen = render(
			<Badge color="emerald" appearance="soft">
				Vérifié
			</Badge>,
		);
		const badge = queryBadge(screen);
		expect(badge?.getAttribute("data-appearance")).toBe("soft");
		expect(badge?.className).toContain("bg-badge-emerald/15");
		expect(badge?.className).toContain("color-mix");
	});

	it("keeps every palette color covered by a soft compound", () => {
		for (const color of badgeColors) {
			const classes = badgeVariants({ color, appearance: "soft" });
			expect(classes).toContain(`bg-badge-${color}/15`);
			expect(classes).toContain(`--color-badge-${color}`);
		}
	});
});
