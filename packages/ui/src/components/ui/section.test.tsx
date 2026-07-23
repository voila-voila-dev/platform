// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	Section,
	SectionActions,
	SectionDescription,
	SectionHeader,
	SectionHeading,
	SectionTitle,
} from "#/components/ui/section.tsx";

afterEach(cleanup);

function querySection(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector("[data-slot=section]");
}

describe("Section", () => {
	it("renders a section landmark by default", () => {
		const screen = render(<Section>content</Section>);
		const section = querySection(screen);
		expect(section?.tagName).toBe("SECTION");
		expect(section?.textContent).toBe("content");
	});

	it("stacks its children on the vertical rhythm", () => {
		const screen = render(<Section>content</Section>);
		const section = querySection(screen);
		expect(section?.classList.contains("flex")).toBe(true);
		expect(section?.classList.contains("flex-col")).toBe(true);
		expect(section?.classList.contains("gap-4")).toBe(true);
	});

	it("renders as another element via the render prop", () => {
		const screen = render(<Section render={<div />}>content</Section>);
		expect(querySection(screen)?.tagName).toBe("DIV");
	});

	it("lets className win over the layout defaults", () => {
		const screen = render(<Section className="gap-8">content</Section>);
		const section = querySection(screen);
		expect(section?.classList.contains("gap-8")).toBe(true);
		expect(section?.classList.contains("gap-4")).toBe(false);
	});

	it("composes header, heading, title, description and actions", () => {
		const screen = render(
			<Section>
				<SectionHeader>
					<SectionHeading>
						<SectionTitle>Prochaines missions</SectionTitle>
						<SectionDescription>Cette semaine</SectionDescription>
					</SectionHeading>
					<SectionActions>
						<button type="button">Voir tout</button>
					</SectionActions>
				</SectionHeader>
				<div>content</div>
			</Section>,
		);
		const title = screen.baseElement.querySelector("[data-slot=section-title]");
		expect(title?.tagName).toBe("H2");
		expect(title?.textContent).toBe("Prochaines missions");
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
			// biome-ignore lint/a11y/useHeadingContent: Base UI's render prop nests the SectionTitle children inside the heading.
			<SectionTitle render={<h3 />}>Documents</SectionTitle>,
		);
		const title = screen.baseElement.querySelector("[data-slot=section-title]");
		expect(title?.tagName).toBe("H3");
		expect(title?.classList.contains("font-semibold")).toBe(true);
	});

	it("keeps the heading shrinkable for truncated titles", () => {
		const screen = render(
			<SectionHeading>
				<SectionTitle>Missions</SectionTitle>
			</SectionHeading>,
		);
		const heading = screen.baseElement.querySelector(
			"[data-slot=section-heading]",
		);
		expect(heading?.classList.contains("min-w-0")).toBe(true);
	});

	it("passes native props through", () => {
		const screen = render(<Section aria-label="Missions">content</Section>);
		expect(querySection(screen)?.getAttribute("aria-label")).toBe("Missions");
	});
});
