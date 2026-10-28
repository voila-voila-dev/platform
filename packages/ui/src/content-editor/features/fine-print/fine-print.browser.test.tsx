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
import { finePrintFeature } from "#/content-editor/features/fine-print/feature.tsx";
import { contentToHtml } from "#/content-editor/reader/content-to-html.ts";

afterEach(cleanup);

const FEATURES = [...createContentFeatures(), finePrintFeature];

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

describe("fine print feature", () => {
	it("turns the block into fine print, keeps a soft break, and Enter leaves it", async () => {
		render(<Composer />);
		await page.getByRole("textbox", { name: "Content editor" }).click();
		await userEvent.keyboard("/fine");
		await expect
			.element(page.getByRole("option", { name: "Fine print" }))
			.toBeVisible();
		await userEvent.keyboard("{Enter}");
		await expect.poll(() => nodeAt(0)?.type).toBe("fine-print");

		await userEvent.keyboard("Offer valid until Sunday.");
		await expect
			.poll(() => JSON.stringify(nodeAt(0).children))
			.toContain("Sunday.");
		await userEvent.keyboard("{Shift>}{Enter}{/Shift}");
		await userEvent.keyboard("One per household.");
		await expect
			.poll(() => JSON.stringify(nodeAt(0).children))
			.toContain("Sunday.\\nOne per household.");
		expect(latest).toHaveLength(1);

		await userEvent.keyboard("{Enter}");
		await expect.poll(() => nodeAt(1)?.type).toBe("p");
		await expect
			.poll(() =>
				contentToHtml(latest, { features: FEATURES }).replace(
					/ id="[^"]*"/g,
					"",
				),
			)
			.toContain('<p class="fine-print"><small>Offer valid until Sunday.');
	});
});
