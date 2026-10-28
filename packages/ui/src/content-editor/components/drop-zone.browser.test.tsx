import { type PlateEditor, useEditorRef } from "platejs/react";
import { useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContentEditor } from "#/content-editor/components/namespace.ts";
import type { ContentValue } from "#/content-editor/features/content-value.ts";
import { createContentFeatures } from "#/content-editor/features/create-content-features.ts";

const FEATURES = createContentFeatures();

const photo = new File(["png"], "photo.png", { type: "image/png" });
const invoice = new File(["pdf"], "invoice.pdf", { type: "application/pdf" });

let editor: PlateEditor | null = null;
function CaptureEditor() {
	editor = useEditorRef();
	return null;
}

interface Host {
	readonly upload?: (file: File) => Promise<{ url: string }>;
	readonly onDropFiles?: (files: ReadonlyArray<File>) => void;
	readonly readOnly?: boolean;
}

function Composer({ upload, onDropFiles, readOnly }: Host) {
	const [value, setValue] = useState<ContentValue | null>([
		{ type: "p", children: [{ text: "Hello" }] },
	]);
	return (
		<ContentEditor.Root
			features={FEATURES}
			value={value}
			onChange={setValue}
			onUploadImage={upload}
			onDropFiles={onDropFiles}
			readOnly={readOnly}
		>
			<CaptureEditor />
			<ContentEditor.DropZone>
				<ContentEditor.Layout>
					<ContentEditor.Canvas />
				</ContentEditor.Layout>
				<footer data-testid="tray">Attachments</footer>
			</ContentEditor.DropZone>
		</ContentEditor.Root>
	);
}

let root: Root | null = null;
afterEach(() => {
	root?.unmount();
	root = null;
	editor = null;
	document.body.innerHTML = "";
});

async function mount(host: Host) {
	const container = document.createElement("div");
	document.body.append(container);
	root = createRoot(container);
	root.render(<Composer {...host} />);
	await vi.waitFor(() => expect(editor).not.toBeNull());
	return {
		canvas: container.querySelector(
			'[data-slot="content-editor-canvas"]',
		) as HTMLElement,
		zone: container.querySelector(
			'[data-slot="content-editor-drop-zone"]',
		) as HTMLElement,
		tray: container.querySelector('[data-testid="tray"]') as HTMLElement,
	};
}

function transferOf(files: ReadonlyArray<File>): DataTransfer {
	const transfer = new DataTransfer();
	for (const file of files) {
		transfer.items.add(file);
	}
	return transfer;
}

function drop(target: HTMLElement, files: ReadonlyArray<File>): DragEvent {
	const dataTransfer = transferOf(files);
	for (const type of ["dragenter", "dragover"]) {
		target.dispatchEvent(
			new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer }),
		);
	}
	const event = new DragEvent("drop", {
		bubbles: true,
		cancelable: true,
		dataTransfer,
	});
	target.dispatchEvent(event);
	return event;
}

function paste(target: HTMLElement, files: ReadonlyArray<File>) {
	target.dispatchEvent(
		new ClipboardEvent("paste", {
			bubbles: true,
			cancelable: true,
			clipboardData: transferOf(files),
		}),
	);
}

const imageUrls = () =>
	(editor as PlateEditor).children
		.filter((node) => node.type === "image")
		.map((node) => node.url);

const uploadToCdn = async (file: File) => ({ url: `https://cdn/${file.name}` });

describe("files dropped and pasted", () => {
	it("puts a pasted image inline and hands the other files to the host", async () => {
		const onDropFiles = vi.fn();
		const { canvas } = await mount({ upload: uploadToCdn, onDropFiles });
		(editor as PlateEditor).tf.select({ path: [0, 0], offset: 5 });

		paste(canvas, [photo, invoice]);

		await vi.waitFor(() =>
			expect(imageUrls()).toEqual(["https://cdn/photo.png"]),
		);
		expect(onDropFiles).toHaveBeenCalledTimes(1);
		expect(
			onDropFiles.mock.calls[0]?.[0].map((file: File) => file.name),
		).toEqual(["invoice.pdf"]);
	});

	it("shows one placeholder per dropped image, each filled as its upload lands", async () => {
		const pending = new Map<string, (url: string) => void>();
		const upload = (file: File) =>
			new Promise<{ url: string }>((resolve) => {
				pending.set(file.name, (url) => resolve({ url }));
			});
		const second = new File(["png"], "second.png", { type: "image/png" });
		const { canvas } = await mount({ upload, onDropFiles: vi.fn() });
		(editor as PlateEditor).tf.select({ path: [0, 0], offset: 5 });

		drop(canvas, [photo, second]);

		await vi.waitFor(() => {
			expect(imageUrls()).toEqual(["", ""]);
			expect(canvas.textContent?.match(/Uploading…/g)).toHaveLength(2);
		});
		pending.get("second.png")?.("https://cdn/second.png");
		await vi.waitFor(() =>
			expect(imageUrls()).toEqual(["", "https://cdn/second.png"]),
		);
		pending.get("photo.png")?.("https://cdn/photo.png");
		await vi.waitFor(() =>
			expect(imageUrls()).toEqual([
				"https://cdn/photo.png",
				"https://cdn/second.png",
			]),
		);
	});

	it("says why the upload of a dropped image failed, and keeps its node", async () => {
		const upload = async (): Promise<{ url: string }> => {
			throw new Error("too big");
		};
		const { canvas } = await mount({ upload });

		drop(canvas, [photo]);

		await vi.waitFor(() =>
			expect(canvas.textContent).toContain("Upload failed: too big"),
		);
		expect(imageUrls()).toEqual([""]);
	});

	it("takes a drop anywhere in the zone, with an overlay while files are over it", async () => {
		const onDropFiles = vi.fn();
		const { zone, tray } = await mount({ upload: uploadToCdn, onDropFiles });
		const dataTransfer = transferOf([invoice]);

		tray.dispatchEvent(
			new DragEvent("dragenter", { bubbles: true, dataTransfer }),
		);
		await vi.waitFor(() =>
			expect(
				zone.querySelector('[data-slot="content-editor-drop-overlay"]'),
			).not.toBeNull(),
		);
		expect(zone.hasAttribute("data-dragging")).toBe(true);

		const event = drop(tray, [photo, invoice]);

		expect(event.defaultPrevented).toBe(true);
		await vi.waitFor(() =>
			expect(imageUrls()).toEqual(["https://cdn/photo.png"]),
		);
		expect(
			onDropFiles.mock.calls[0]?.[0].map((file: File) => file.name),
		).toEqual(["invoice.pdf"]);
		await vi.waitFor(() =>
			expect(
				zone.querySelector('[data-slot="content-editor-drop-overlay"]'),
			).toBeNull(),
		);
	});

	it("hides the overlay once the drag leaves the zone, not when it crosses a child", async () => {
		const { zone, canvas, tray } = await mount({ onDropFiles: vi.fn() });
		const dataTransfer = transferOf([invoice]);
		const fire = (target: HTMLElement, type: string) =>
			target.dispatchEvent(
				new DragEvent(type, { bubbles: true, dataTransfer }),
			);

		fire(tray, "dragenter");
		fire(canvas, "dragenter");
		fire(tray, "dragleave");
		await vi.waitFor(() =>
			expect(zone.hasAttribute("data-dragging")).toBe(true),
		);
		fire(canvas, "dragleave");
		await vi.waitFor(() =>
			expect(zone.hasAttribute("data-dragging")).toBe(false),
		);
	});

	it("hands every file to the host when no upload is wired, images included", async () => {
		const onDropFiles = vi.fn();
		const { canvas } = await mount({ onDropFiles });

		drop(canvas, [photo, invoice]);

		expect(
			onDropFiles.mock.calls[0]?.[0].map((file: File) => file.name),
		).toEqual(["photo.png", "invoice.pdf"]);
		expect(imageUrls()).toEqual([]);
	});

	it("ignores the files no feature takes when the host wired no onDropFiles", async () => {
		const { canvas, tray } = await mount({ upload: uploadToCdn });

		const onCanvas = drop(canvas, [invoice]);
		const onTray = drop(tray, [invoice]);

		expect(onCanvas.defaultPrevented).toBe(true);
		expect(onTray.defaultPrevented).toBe(true);
		expect((editor as PlateEditor).children).toMatchObject([
			{ type: "p", children: [{ text: "Hello" }] },
		]);
	});

	it("takes nothing while read-only", async () => {
		const onDropFiles = vi.fn();
		const { zone, tray } = await mount({ onDropFiles, readOnly: true });

		const event = drop(tray, [invoice]);

		expect(event.defaultPrevented).toBe(false);
		expect(zone.hasAttribute("data-dragging")).toBe(false);
		expect(onDropFiles).not.toHaveBeenCalled();
	});
});
