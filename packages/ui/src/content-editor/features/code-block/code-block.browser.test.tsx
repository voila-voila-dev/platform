import { cleanup, render } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { ContentEditor } from "#/content-editor/components/namespace.ts";
import type { ContentValue } from "#/content-editor/features/content-value.ts";
import { createContentFeatures } from "#/content-editor/features/create-content-features.ts";
import { contentToHtml } from "#/content-editor/reader/content-to-html.ts";

afterEach(cleanup);

const FEATURES = createContentFeatures();

let latest: ContentValue = [];

const withoutIds = (value: ContentValue): ContentValue =>
	JSON.parse(
		JSON.stringify(value, (key, item) => (key === "id" ? undefined : item)),
	);

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

describe("code block", () => {
	it("is picked from the slash menu, takes a line per Enter and renders as one <pre>", async () => {
		render(<Composer />);
		await page.getByRole("textbox", { name: "Content editor" }).click();
		await userEvent.keyboard("/code");
		await expect
			.element(page.getByRole("option", { name: "Code block" }))
			.toBeVisible();
		await userEvent.keyboard("{Enter}");
		await expect.poll(() => latest[0]?.type).toBe("code_block");

		await userEvent.keyboard("if (a < b) {{");
		await userEvent.keyboard("{Enter}");
		await userEvent.keyboard("  go();");
		await expect
			.poll(() => contentToHtml(withoutIds(latest), { features: FEATURES }))
			.toBe("<pre><code>if (a &lt; b) {\n  go();</code></pre><p></p>");
		expect(document.querySelector("pre")?.textContent).toContain("go();");
	});
});
