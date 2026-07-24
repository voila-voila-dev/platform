// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	Button,
	buttonSizeOptions,
	buttonVariantOptions,
	buttonVariants,
} from "#/components/ui/button.tsx";

afterEach(cleanup);

function queryButton(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector("[data-slot=button]");
}

describe("Button", () => {
	it("renders its children in a button by default", () => {
		const screen = render(<Button>Publish</Button>);
		const button = queryButton(screen);
		expect(button?.tagName).toBe("BUTTON");
		expect(button?.textContent).toBe("Publish");
	});

	it("exposes the default variant and size as data attributes", () => {
		const screen = render(<Button>Publish</Button>);
		const button = queryButton(screen);
		expect(button?.getAttribute("data-variant")).toBe("default");
		expect(button?.getAttribute("data-size")).toBe("default");
	});

	it.each(
		buttonVariantOptions,
	)("exposes variant %s as a data attribute", (variant) => {
		const screen = render(<Button variant={variant}>Publish</Button>);
		expect(queryButton(screen)?.getAttribute("data-variant")).toBe(variant);
	});

	it.each(buttonSizeOptions)("exposes size %s as a data attribute", (size) => {
		const screen = render(<Button size={size}>Publish</Button>);
		expect(queryButton(screen)?.getAttribute("data-size")).toBe(size);
	});

	it("applies the size classes (lg is taller than default)", () => {
		const screen = render(<Button size="lg">Publish</Button>);
		const button = queryButton(screen);
		expect(button?.classList.contains("h-11")).toBe(true);
		expect(button?.classList.contains("h-8")).toBe(false);
	});

	it("merges className over the variant classes", () => {
		const screen = render(
			<Button className="custom-button-class">Publish</Button>,
		);
		expect(queryButton(screen)?.classList.contains("custom-button-class")).toBe(
			true,
		);
	});

	it("renders as an anchor via the render prop", () => {
		const screen = render(
			<Button render={<a href="/projects">Open projects</a>} />,
		);
		const button = queryButton(screen);
		expect(button?.tagName).toBe("A");
		expect(button?.getAttribute("href")).toBe("/projects");
		expect(button?.textContent).toBe("Open projects");
		expect(button?.classList.contains("bg-primary")).toBe(true);
	});

	it("disables the button when disabled is set", () => {
		const screen = render(<Button disabled>Publish</Button>);
		const button = queryButton(screen) as HTMLButtonElement | null;
		expect(button?.disabled).toBe(true);
	});

	it("shows a spinner, busies and disables the button while loading", () => {
		const screen = render(<Button loading>Saving</Button>);
		const button = queryButton(screen) as HTMLButtonElement | null;
		expect(button?.getAttribute("aria-busy")).toBe("true");
		expect(button?.disabled).toBe(true);
		expect(
			screen.baseElement.querySelector("[data-slot=spinner]"),
		).not.toBeNull();
	});

	it("renders no spinner and is not busy when not loading", () => {
		const screen = render(<Button>Publish</Button>);
		const button = queryButton(screen);
		expect(button?.getAttribute("aria-busy")).toBeNull();
		expect(screen.baseElement.querySelector("[data-slot=spinner]")).toBeNull();
	});
});

describe("button exports", () => {
	it("keeps buttonVariantOptions in sync with the variant axis", () => {
		for (const variant of buttonVariantOptions) {
			expect(buttonVariants({ variant }).length).toBeGreaterThan(0);
		}
		expect(buttonVariantOptions.length).toBe(9);
	});

	it("keeps buttonSizeOptions in sync with the size axis", () => {
		for (const size of buttonSizeOptions) {
			expect(buttonVariants({ size }).length).toBeGreaterThan(0);
		}
		expect(buttonSizeOptions.length).toBe(8);
	});
});
