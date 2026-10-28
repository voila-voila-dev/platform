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
import type { ContentEditorAppearance } from "#/content-editor/theme.ts";

afterEach(cleanup);

const FEATURES = createContentFeatures({ headings: ["h1", "h2"] });

let latest: ContentValue = [];

function Composer({
	appearance = "document",
	initial = [{ type: "p", children: [{ text: "" }] }],
}: {
	readonly appearance?: ContentEditorAppearance;
	readonly initial?: ContentValue;
}) {
	const [value, setValue] = useState<ContentValue | null>(initial);
	latest = value ?? [];
	return (
		<ContentEditor.Root
			features={FEATURES}
			value={value}
			onChange={setValue}
			appearance={appearance}
			theme={{ color: { brand: "rgb(15, 118, 110)" } }}
		>
			<ContentEditor.Canvas />
		</ContentEditor.Root>
	);
}

const first = () => latest[0] as ContentNodeLike;

describe("heading feature", () => {
	it("turns `# ` into an h1 and `## ` into an h2", async () => {
		render(<Composer />);
		await page.getByRole("textbox", { name: "Content editor" }).click();
		await userEvent.keyboard("# ");
		await expect.poll(() => first().type).toBe("h1");
		await userEvent.keyboard("Welcome");
		await expect
			.poll(() => JSON.stringify(first().children))
			.toContain("Welcome");

		await userEvent.keyboard("{Enter}");
		await expect.poll(() => latest.length).toBe(2);
		await userEvent.keyboard("## ");
		await expect.poll(() => (latest[1] as ContentNodeLike).type).toBe("h2");
	});

	it("draws a heading in the brand colour and the theme's size in the email appearance", async () => {
		render(
			<Composer
				appearance="email"
				initial={[
					{ type: "h1", children: [{ text: "Title" }] },
					{ type: "h2", children: [{ text: "Section" }] },
				]}
			/>,
		);
		const title = page.getByRole("heading", { level: 1 });
		await expect.element(title).toHaveStyle({
			color: "rgb(15, 118, 110)",
			fontSize: "22px",
		});
		await expect
			.element(page.getByRole("heading", { level: 2 }))
			.toHaveStyle({ fontSize: "17px" });
	});
});
