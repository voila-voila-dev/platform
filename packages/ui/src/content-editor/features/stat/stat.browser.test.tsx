import { cleanup, render } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { ContentEditor } from "#/content-editor/components/namespace.ts";
import type {
	ContentNodeLike,
	ContentValue,
} from "#/content-editor/features/content-value.ts";
import { createContentFeatures } from "#/content-editor/features/create-content-features.ts";
import { statFeature } from "#/content-editor/features/stat/feature.tsx";
import { contentToHtml } from "#/content-editor/reader/content-to-html.ts";

afterEach(cleanup);

const FEATURES = [...createContentFeatures(), statFeature];

let latest: ContentValue = [];

function Composer() {
	const [value, setValue] = useState<ContentValue | null>([
		{ type: "p", children: [{ text: "" }] },
	]);
	latest = value ?? [];
	return (
		<ContentEditor.Root
			features={FEATURES}
			value={value}
			onChange={setValue}
			appearance="email"
		>
			<ContentEditor.Canvas />
			<ContentEditor.Inspector />
		</ContentEditor.Root>
	);
}

const nodeAt = (index: number) => latest[index] as ContentNodeLike;

describe("stat feature", () => {
	it("is inserted from the slash menu and filled in from the inspector", async () => {
		render(<Composer />);
		await page.getByRole("textbox", { name: "Content editor" }).click();
		await userEvent.keyboard("/key");
		await expect
			.element(page.getByRole("option", { name: "Key figure" }))
			.toBeVisible();
		await userEvent.keyboard("{Enter}");
		await expect
			.poll(() => nodeAt(0))
			.toMatchObject({
				type: "stat",
				value: "",
				label: "",
				description: "",
				align: "center",
			});

		await page.getByRole("textbox", { name: "Figure" }).fill("128");
		await page
			.getByRole("textbox", { name: "Label", exact: true })
			.fill("Projects delivered");
		await page
			.getByRole("textbox", { name: "Description (optional)" })
			.fill("Since 2019");
		await page.getByRole("combobox", { name: "Alignment" }).click();
		await page.getByRole("option", { name: "Left" }).click();

		await expect
			.poll(() => nodeAt(0))
			.toMatchObject({
				value: "128",
				label: "Projects delivered",
				description: "Since 2019",
				align: "left",
			});
		await expect
			.element(
				page
					.getByRole("textbox", { name: "Content editor" })
					.getByText("Since 2019", { exact: true }),
			)
			.toBeVisible();
		expect(contentToHtml(latest, { features: FEATURES })).toContain(
			'style="text-align:left"><p class="stat-value"><strong>128</strong></p><p class="stat-label">Projects delivered</p><p class="stat-description">Since 2019</p></div>',
		);
	});
});
