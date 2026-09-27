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
import { highlightFeature } from "#/content-editor/features/highlight/feature.tsx";
import { contentToHtml } from "#/content-editor/reader/content-to-html.ts";

afterEach(cleanup);

const FEATURES = [...createContentFeatures(), highlightFeature];

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

describe("highlight feature", () => {
	it("turns the block into a highlight, aligns it from the inspector, and Enter leaves it", async () => {
		render(<Composer />);
		await page.getByRole("textbox", { name: "Content editor" }).click();
		await userEvent.keyboard("/highl");
		await expect
			.element(page.getByRole("option", { name: "Highlight" }))
			.toBeVisible();
		await userEvent.keyboard("{Enter}");
		await expect
			.poll(() => nodeAt(0))
			.toMatchObject({ type: "highlight", align: "center" });

		await userEvent.keyboard("10% off with LAUNCH10");
		await expect
			.poll(() => JSON.stringify(nodeAt(0).children))
			.toContain("10% off with LAUNCH10");

		await page.getByRole("combobox", { name: "Alignment" }).click();
		await page.getByRole("option", { name: "Left" }).click();
		await expect.poll(() => nodeAt(0).align).toBe("left");

		await page.getByText("10% off with LAUNCH10").click();
		await expect
			.poll(() => document.activeElement?.getAttribute("data-slot"))
			.toBe("content-editor-canvas");
		await userEvent.keyboard("{End}");
		await expect
			.poll(() => window.getSelection()?.anchorOffset)
			.toBe("10% off with LAUNCH10".length);
		await userEvent.keyboard("{Enter}");
		await expect.poll(() => nodeAt(1)?.type).toBe("p");
		await userEvent.keyboard("Body");
		await expect
			.poll(() => contentToHtml(latest, { features: FEATURES }))
			.toBe(
				'<p class="highlight" style="text-align:left"><strong>10% off with LAUNCH10</strong></p><p>Body</p>',
			);
	});
});
