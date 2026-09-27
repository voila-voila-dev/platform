import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { ContentEditor } from "#/content-editor/components/namespace.ts";
import { createContentFeatures } from "#/content-editor/features/create-content-features.ts";
import type { ContentEditorAppearance } from "#/content-editor/theme.ts";

afterEach(cleanup);

const FEATURES = createContentFeatures();

function renderCanvas(appearance: ContentEditorAppearance) {
	render(
		<ContentEditor.Root
			features={FEATURES}
			value={[
				{ type: "p", children: [{ text: "One" }] },
				{ type: "p", children: [{ text: "Two" }] },
			]}
			onChange={() => {}}
			appearance={appearance}
			theme={{
				color: { card: "rgb(255, 250, 240)", canvas: "rgb(1, 2, 3)" },
				font: "Georgia",
				previewWidth: { desktop: 520 },
			}}
		>
			<ContentEditor.Canvas />
		</ContentEditor.Root>,
	);
	const canvas = page.getByRole("textbox").element() as HTMLElement;
	return {
		canvas: getComputedStyle(canvas),
		gap: getComputedStyle(
			page
				.getByText("Two")
				.element()
				.closest('[data-slate-node="element"]') as Element,
		).marginTop,
	};
}

describe("appearance", () => {
	it("draws the email card in the theme's width, colours and font, on its backdrop", async () => {
		const { canvas, gap } = renderCanvas("email");
		expect(canvas.maxWidth).toBe("520px");
		expect(canvas.backgroundColor).toBe("rgb(255, 250, 240)");
		expect(canvas.fontFamily).toBe("Georgia");
		expect(gap).not.toBe("0px");
		const backdrop = document.querySelector(
			'[data-slot="content-editor-email-backdrop"]',
		) as HTMLElement;
		expect(getComputedStyle(backdrop).backgroundColor).toBe("rgb(1, 2, 3)");
	});

	it("stacks a plain mail's lines with no gap, in the theme's font", async () => {
		const { canvas, gap } = renderCanvas("plain");
		expect(canvas.fontFamily).toBe("Georgia");
		expect(gap).toBe("0px");
		expect(
			document.querySelector('[data-slot="content-editor-email-backdrop"]'),
		).toBeNull();
	});

	it("keeps a document in the kit's font and prose width", async () => {
		const { canvas } = renderCanvas("document");
		expect(canvas.fontFamily).not.toBe("Georgia");
		expect(canvas.maxWidth).toBe("768px");
	});
});
