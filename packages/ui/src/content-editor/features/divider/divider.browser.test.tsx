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

afterEach(cleanup);

const FEATURES = createContentFeatures();

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
			theme={{ color: { border: "rgb(1, 2, 3)" } }}
		>
			<ContentEditor.Canvas />
		</ContentEditor.Root>
	);
}

describe("divider in the email appearance", () => {
	it("draws `---` as a rule in the theme's border colour", async () => {
		render(<Composer />);
		await page.getByRole("textbox", { name: "Content editor" }).click();
		await userEvent.keyboard("---");
		await expect
			.poll(() => (latest[0] as ContentNodeLike | undefined)?.type)
			.toBe("hr");
		const rule = document.querySelector(
			'[data-slot="content-editor-canvas"] hr',
		) as HTMLElement;
		expect(getComputedStyle(rule).borderTopColor).toBe("rgb(1, 2, 3)");
		expect(getComputedStyle(rule).borderTopWidth).toBe("1px");
	});
});
