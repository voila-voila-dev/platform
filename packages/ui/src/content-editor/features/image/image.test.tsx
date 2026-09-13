// @vitest-environment jsdom
import {
	act,
	cleanup,
	createEvent,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import type { PlateEditor } from "platejs/react";
import { useEditorRef } from "platejs/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContentEditor } from "#/content-editor/components/namespace.ts";
import type { ContentValue } from "#/content-editor/features/content-value.ts";
import { createContentFeatures } from "#/content-editor/features/create-content-features.ts";
import { installContentEditorTestDom } from "#/content-editor/lib/test-dom.ts";

beforeEach(installContentEditorTestDom);
afterEach(cleanup);

const FEATURES = createContentFeatures();

let editorRef: PlateEditor | null = null;
function CaptureEditor() {
	editorRef = useEditorRef();
	return null;
}

const picture = () => new File(["png"], "photo.png", { type: "image/png" });

function EditorUnderTest({
	initial,
	upload,
}: {
	readonly initial: ContentValue;
	readonly upload?: (file: File) => Promise<{ url: string }>;
}) {
	const [value, setValue] = useState<ContentValue | null>(initial);
	return (
		<ContentEditor.Root
			features={FEATURES}
			value={value}
			onChange={setValue}
			onUploadImage={upload}
		>
			<CaptureEditor />
			<ContentEditor.Layout>
				<ContentEditor.Canvas />
			</ContentEditor.Layout>
		</ContentEditor.Root>
	);
}

const emptyImage: ContentValue = [
	{ type: "image", url: "", children: [{ text: "" }] },
];

describe("image feature", () => {
	it("uploads the picked file once and puts its url on the node", async () => {
		const upload = vi.fn(async (_file: File) => ({
			url: "https://cdn/photo.png",
			width: 640,
			height: 480,
		}));
		const { container } = render(
			<EditorUnderTest initial={emptyImage} upload={upload} />,
		);
		const input = container.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		await act(async () => {
			fireEvent.change(input, { target: { files: [picture()] } });
		});
		await waitFor(() => {
			expect((editorRef as PlateEditor).children[0]).toMatchObject({
				type: "image",
				url: "https://cdn/photo.png",
				width: 640,
				height: 480,
			});
		});
		expect(upload).toHaveBeenCalledTimes(1);
		expect(upload.mock.calls[0]?.[0].name).toBe("photo.png");
		expect(container.querySelector("img")?.getAttribute("src")).toBe(
			"https://cdn/photo.png",
		);
	});

	it("keeps the node and says why when the upload fails", async () => {
		const upload = vi.fn(async (_file: File): Promise<{ url: string }> => {
			throw new Error("too big");
		});
		const { container } = render(
			<EditorUnderTest initial={emptyImage} upload={upload} />,
		);
		const input = container.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		await act(async () => {
			fireEvent.change(input, { target: { files: [picture()] } });
		});
		expect(await screen.findByText("Upload failed: too big")).toBeTruthy();
		expect((editorRef as PlateEditor).children[0]).toMatchObject({
			type: "image",
			url: "",
		});
	});

	it("says upload is unavailable when the host wired none", () => {
		render(<EditorUnderTest initial={emptyImage} />);
		expect(
			screen.getByText("Image upload is not available here."),
		).toBeTruthy();
	});

	it("takes pasted image files as new image nodes and fills them as uploads land", async () => {
		const upload = vi.fn(async (file: File) => ({
			url: `https://cdn/${file.name}`,
		}));
		render(
			<EditorUnderTest
				initial={[{ type: "p", children: [{ text: "Hello" }] }]}
				upload={upload}
			/>,
		);
		act(() => {
			(editorRef as PlateEditor).tf.select({ path: [0, 0], offset: 5 });
		});
		await act(async () => {
			const canvas = screen.getByRole("textbox");
			const event = createEvent.paste(canvas);
			Object.defineProperty(event, "clipboardData", {
				value: {
					files: [
						picture(),
						new File(["b"], "second.png", { type: "image/png" }),
					],
					getData: () => "",
				},
			});
			fireEvent(canvas, event);
		});
		await waitFor(() => {
			const urls = (editorRef as PlateEditor).children
				.filter((node) => node.type === "image")
				.map((node) => node.url);
			expect(urls).toEqual(["https://cdn/photo.png", "https://cdn/second.png"]);
		});
		expect(upload).toHaveBeenCalledTimes(2);
	});

	it("swallows dropped files when the host wired no upload", () => {
		render(
			<EditorUnderTest
				initial={[{ type: "p", children: [{ text: "Hello" }] }]}
			/>,
		);
		act(() => {
			const canvas = screen.getByRole("textbox");
			const event = createEvent.drop(canvas);
			Object.defineProperty(event, "dataTransfer", {
				value: { files: [picture()], getData: () => "" },
			});
			fireEvent(canvas, event);
		});
		expect(
			(editorRef as PlateEditor).children.some((node) => node.type === "image"),
		).toBe(false);
	});
});
