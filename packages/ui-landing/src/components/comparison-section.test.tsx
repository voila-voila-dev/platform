// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ComparisonSection } from "#/components/comparison-section.tsx";

afterEach(cleanup);

describe("ComparisonSection", () => {
	it("styles the panels by variant and tone", () => {
		const screen = render(
			<ComparisonSection.Root tone="highlight">
				<ComparisonSection.Content>
					<ComparisonSection.Panels>
						<ComparisonSection.Panel variant="without">
							<ComparisonSection.PanelTitle>
								Hiring the old way
							</ComparisonSection.PanelTitle>
							<ComparisonSection.PanelList>
								<ComparisonSection.PanelItem>
									Kickoff without a team
								</ComparisonSection.PanelItem>
							</ComparisonSection.PanelList>
						</ComparisonSection.Panel>
						<ComparisonSection.Panel variant="with">
							<ComparisonSection.PanelTitle>
								With Acme
							</ComparisonSection.PanelTitle>
							<ComparisonSection.PanelList>
								<ComparisonSection.PanelItem>
									A vetted freelancer ready to start
								</ComparisonSection.PanelItem>
							</ComparisonSection.PanelList>
						</ComparisonSection.Panel>
					</ComparisonSection.Panels>
				</ComparisonSection.Content>
			</ComparisonSection.Root>,
		);

		const panels = screen.container.querySelectorAll(
			"[data-slot=comparison-panel]",
		);
		expect(panels[0]?.classList.contains("bg-muted/50")).toBe(true);
		expect(panels[1]?.classList.contains("bg-highlight/5")).toBe(true);
		expect(panels[1]?.classList.contains("border-highlight/20")).toBe(true);

		const titles = screen.container.querySelectorAll(
			"[data-slot=comparison-panel-title]",
		);
		expect(titles[0]?.classList.contains("text-muted-foreground")).toBe(true);
		expect(titles[1]?.classList.contains("text-highlight")).toBe(true);
	});

	it("renders the default cross/check marks per panel", () => {
		const screen = render(
			<ComparisonSection.Root tone="brand">
				<ComparisonSection.Content>
					<ComparisonSection.Panels>
						<ComparisonSection.Panel variant="without">
							<ComparisonSection.PanelList>
								<ComparisonSection.PanelItem>
									Without
								</ComparisonSection.PanelItem>
							</ComparisonSection.PanelList>
						</ComparisonSection.Panel>
						<ComparisonSection.Panel variant="with">
							<ComparisonSection.PanelList>
								<ComparisonSection.PanelItem>With</ComparisonSection.PanelItem>
							</ComparisonSection.PanelList>
						</ComparisonSection.Panel>
					</ComparisonSection.Panels>
				</ComparisonSection.Content>
			</ComparisonSection.Root>,
		);

		const items = screen.container.querySelectorAll(
			"[data-slot=comparison-panel-item]",
		);
		expect(
			items[0]?.querySelector("svg")?.classList.contains("text-destructive"),
		).toBe(true);
		expect(
			items[1]?.querySelector("svg")?.classList.contains("text-success"),
		).toBe(true);
	});
});
