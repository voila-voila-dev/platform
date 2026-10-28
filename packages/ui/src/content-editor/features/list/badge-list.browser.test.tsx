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
import { badgeListFeature } from "#/content-editor/features/list/feature.tsx";
import { contentToHtml } from "#/content-editor/reader/content-to-html.ts";

afterEach(cleanup);

const FEATURES = [...createContentFeatures(), badgeListFeature];

let latest: ContentValue = [];

function Composer() {
	const [value, setValue] = useState<ContentValue | null>([
		{ type: "p", children: [{ text: "" }] },
	]);
	latest = value ?? [];
	return (
		<ContentEditor.Root features={FEATURES} value={value} onChange={setValue}>
			<ContentEditor.Canvas />
		</ContentEditor.Root>
	);
}

const item = (index: number) => latest[index] as ContentNodeLike;

describe("badge list", () => {
	it("is picked from the slash menu, numbers its items and leaves on an empty Enter", async () => {
		render(<Composer />);
		await page.getByRole("textbox", { name: "Content editor" }).click();
		await userEvent.keyboard("/badge");
		await expect
			.element(page.getByRole("option", { name: "Badge list" }))
			.toBeVisible();
		await userEvent.keyboard("{Enter}");
		await expect.poll(() => item(0).listStyleType).toBe("badge");

		await userEvent.keyboard("Sign up");
		await expect
			.poll(() => JSON.stringify(item(0).children))
			.toContain("Sign up");
		await userEvent.keyboard("{Enter}");
		await expect.poll(() => item(1)?.listStyleType).toBe("badge");
		await userEvent.keyboard("Pick a slot");
		await expect.poll(() => item(1).listStart).toBe(2);

		const badges = document.querySelectorAll(
			'[data-list-style="badge"] [aria-hidden]',
		);
		expect([...badges].map((badge) => badge.textContent)).toEqual(["1", "2"]);

		await userEvent.keyboard("{Enter}{Enter}");
		await expect.poll(() => item(2)?.listStyleType).toBeUndefined();
		await expect
			.poll(() => contentToHtml(latest, { features: FEATURES }))
			.toContain(
				'<ol data-list-style="badge"><li>Sign up</li><li>Pick a slot</li></ol>',
			);
	});
});
