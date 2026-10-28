// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Container } from "#/landing/components/container.tsx";
import { Heading } from "#/landing/components/heading.tsx";
import { Section } from "#/landing/components/section.tsx";
import { Text } from "#/landing/components/text.tsx";

afterEach(cleanup);

describe("Section", () => {
	it("renders a section landmark with the default rhythm", () => {
		const screen = render(<Section>Band</Section>);
		const section = screen.container.querySelector("section");
		expect(section).not.toBeNull();
		expect(section?.classList.contains("py-16")).toBe(true);
		expect(section?.classList.contains("bg-background")).toBe(true);
	});

	it("applies spacing and background variants", () => {
		const screen = render(
			<Section spacing="lg" background="muted">
				Band
			</Section>,
		);
		const section = screen.container.querySelector("section");
		expect(section?.classList.contains("py-24")).toBe(true);
		expect(section?.classList.contains("bg-muted")).toBe(true);
	});

	it("swaps the tag through the render prop", () => {
		const screen = render(<Section render={<div />}>Band</Section>);
		expect(screen.container.querySelector("section")).toBeNull();
		expect(screen.container.querySelector("div")?.textContent).toBe("Band");
	});
});

describe("Container", () => {
	it("applies the size variant and merges className", () => {
		const screen = render(
			<Container size="md" className="custom">
				Content
			</Container>,
		);
		const container = screen.container.firstElementChild;
		expect(container?.classList.contains("max-w-5xl")).toBe(true);
		expect(container?.classList.contains("custom")).toBe(true);
	});
});

describe("Heading", () => {
	it("renders the tag matching the level", () => {
		const screen = render(<Heading level="h1">Titre</Heading>);
		expect(screen.container.querySelector("h1")?.textContent).toBe("Titre");
	});

	it("defaults to h2 with the heading font", () => {
		const screen = render(<Heading>Titre</Heading>);
		const heading = screen.container.querySelector("h2");
		expect(heading?.classList.contains("font-heading")).toBe(true);
	});
});

describe("Text", () => {
	it("applies the lead variant", () => {
		const screen = render(<Text variant="lead">Sous-titre</Text>);
		const text = screen.container.querySelector("p");
		expect(text?.classList.contains("text-muted-foreground")).toBe(true);
		// Deliberate quirk kept for backwards compatibility: the default
		// `size: "base"` wins the tailwind-merge conflict over lead's `text-xl`.
		expect(text?.classList.contains("text-base")).toBe(true);
		expect(text?.classList.contains("text-xl")).toBe(false);
	});

	it("keeps the lead size when size is explicit", () => {
		const screen = render(
			<Text variant="lead" size="xl">
				Sous-titre
			</Text>,
		);
		expect(
			screen.container.querySelector("p")?.classList.contains("text-xl"),
		).toBe(true);
	});
});
