// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ComparisonSection } from "#/components/comparison-section.tsx";

afterEach(cleanup);

describe("ComparisonSection", () => {
	it("styles the panels by variant and tone", () => {
		const screen = render(
			<ComparisonSection.Root tone="organization">
				<ComparisonSection.Content>
					<ComparisonSection.Panels>
						<ComparisonSection.Panel variant="without">
							<ComparisonSection.PanelTitle>
								Déplacement classique
							</ComparisonSection.PanelTitle>
							<ComparisonSection.PanelList>
								<ComparisonSection.PanelItem>
									Départ sans staff médical
								</ComparisonSection.PanelItem>
							</ComparisonSection.PanelList>
						</ComparisonSection.Panel>
						<ComparisonSection.Panel variant="with">
							<ComparisonSection.PanelTitle>
								Avec Acme
							</ComparisonSection.PanelTitle>
							<ComparisonSection.PanelList>
								<ComparisonSection.PanelItem>
									Un professionnel vérifié vous attend
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
		expect(panels[1]?.classList.contains("bg-organization/5")).toBe(true);
		expect(panels[1]?.classList.contains("border-organization/20")).toBe(true);

		const titles = screen.container.querySelectorAll(
			"[data-slot=comparison-panel-title]",
		);
		expect(titles[0]?.classList.contains("text-muted-foreground")).toBe(true);
		expect(titles[1]?.classList.contains("text-organization")).toBe(true);
	});

	it("renders the default cross/check marks per panel", () => {
		const screen = render(
			<ComparisonSection.Root tone="provider">
				<ComparisonSection.Content>
					<ComparisonSection.Panels>
						<ComparisonSection.Panel variant="without">
							<ComparisonSection.PanelList>
								<ComparisonSection.PanelItem>Sans</ComparisonSection.PanelItem>
							</ComparisonSection.PanelList>
						</ComparisonSection.Panel>
						<ComparisonSection.Panel variant="with">
							<ComparisonSection.PanelList>
								<ComparisonSection.PanelItem>Avec</ComparisonSection.PanelItem>
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
