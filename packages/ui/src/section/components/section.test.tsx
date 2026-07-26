// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Section } from "#/section/components/section.tsx";

afterEach(cleanup);

function querySection(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector("[data-slot=section]");
}

describe("Section", () => {
	it("renders a section landmark by default", () => {
		const screen = render(<Section.Root>content</Section.Root>);
		const section = querySection(screen);
		expect(section?.tagName).toBe("SECTION");
		expect(section?.textContent).toBe("content");
	});

	it("stacks its children on the vertical rhythm", () => {
		const screen = render(<Section.Root>content</Section.Root>);
		const section = querySection(screen);
		expect(section?.classList.contains("flex")).toBe(true);
		expect(section?.classList.contains("flex-col")).toBe(true);
		expect(section?.classList.contains("gap-4")).toBe(true);
	});

	it("renders as another element via the render prop", () => {
		const screen = render(
			<Section.Root render={<div />}>content</Section.Root>,
		);
		expect(querySection(screen)?.tagName).toBe("DIV");
	});

	it("lets className win over the layout defaults", () => {
		const screen = render(
			<Section.Root className="gap-8">content</Section.Root>,
		);
		const section = querySection(screen);
		expect(section?.classList.contains("gap-8")).toBe(true);
		expect(section?.classList.contains("gap-4")).toBe(false);
	});

	it("composes header, heading, title, description and actions", () => {
		const screen = render(
			<Section.Root>
				<Section.Header>
					<Section.Heading>
						<Section.Title>Upcoming projects</Section.Title>
						<Section.Description>Cette semaine</Section.Description>
					</Section.Heading>
					<Section.Actions>
						<button type="button">Voir tout</button>
					</Section.Actions>
				</Section.Header>
				<div>content</div>
			</Section.Root>,
		);
		const title = screen.baseElement.querySelector("[data-slot=section-title]");
		expect(title?.tagName).toBe("H2");
		expect(title?.textContent).toBe("Upcoming projects");
		const description = screen.baseElement.querySelector(
			"[data-slot=section-description]",
		);
		expect(description?.tagName).toBe("P");
		expect(description?.textContent).toBe("Cette semaine");
		const actions = screen.baseElement.querySelector(
			"[data-slot=section-actions]",
		);
		expect(actions?.querySelector("button")?.textContent).toBe("Voir tout");
	});

	it("renders the title at another heading level via the render prop", () => {
		const screen = render(
			// biome-ignore lint/a11y/useHeadingContent: Base UI's render prop nests the Section.Title children inside the heading.
			<Section.Title render={<h3 />}>Documents</Section.Title>,
		);
		const title = screen.baseElement.querySelector("[data-slot=section-title]");
		expect(title?.tagName).toBe("H3");
		expect(title?.classList.contains("font-semibold")).toBe(true);
	});

	it("keeps the heading shrinkable for truncated titles", () => {
		const screen = render(
			<Section.Heading>
				<Section.Title>Projects</Section.Title>
			</Section.Heading>,
		);
		const heading = screen.baseElement.querySelector(
			"[data-slot=section-heading]",
		);
		expect(heading?.classList.contains("min-w-0")).toBe(true);
	});

	it("passes native props through", () => {
		const screen = render(
			<Section.Root aria-label="Projects">content</Section.Root>,
		);
		expect(querySection(screen)?.getAttribute("aria-label")).toBe("Projects");
	});
});
