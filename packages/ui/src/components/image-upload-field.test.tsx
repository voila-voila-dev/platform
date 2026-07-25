// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ImageUploadField } from "#/components/image-upload-field.tsx";

beforeEach(() => {
	vi.stubGlobal(
		"ResizeObserver",
		class {
			observe() {}
			unobserve() {}
			disconnect() {}
		},
	);
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
	return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("ImageUploadField", () => {
	it("starts in the edit state with a dropzone when there is no value", () => {
		const screen = render(<ImageUploadField onFileCropped={() => {}} />);
		const root = queryBySlot(screen, "image-upload-field");
		expect(root?.getAttribute("data-state")).toBe("edit");
		expect(queryBySlot(screen, "image-cropper-dropzone")).not.toBeNull();
	});

	it("starts in the view state showing the current image when a value is set", () => {
		const screen = render(
			<ImageUploadField
				value="https://acme.dev/avatar.png"
				onFileCropped={() => {}}
			/>,
		);
		const root = queryBySlot(screen, "image-upload-field");
		expect(root?.getAttribute("data-state")).toBe("view");
		const preview = queryBySlot(screen, "image-upload-field-preview");
		expect(preview?.getAttribute("src")).toBe("https://acme.dev/avatar.png");
	});

	it("reflects the shape via data attribute", () => {
		const screen = render(
			<ImageUploadField shape="rectangle" onFileCropped={() => {}} />,
		);
		expect(
			queryBySlot(screen, "image-upload-field")?.getAttribute("data-shape"),
		).toBe("rectangle");
	});

	it("switches to the edit state when Replace is clicked", () => {
		const screen = render(
			<ImageUploadField
				value="https://acme.dev/avatar.png"
				replaceLabel="Remplacer"
				onFileCropped={() => {}}
			/>,
		);
		fireEvent.click(screen.getByText("Remplacer"));
		expect(
			queryBySlot(screen, "image-upload-field")?.getAttribute("data-state"),
		).toBe("edit");
	});

	it("calls onRemove when Remove is clicked", () => {
		const onRemove = vi.fn();
		const screen = render(
			<ImageUploadField
				value="https://acme.dev/avatar.png"
				removeLabel="Supprimer"
				onFileCropped={() => {}}
				onRemove={onRemove}
			/>,
		);
		fireEvent.click(screen.getByText("Supprimer"));
		expect(onRemove).toHaveBeenCalledTimes(1);
	});

	it("hides the Remove button when no onRemove is given", () => {
		const screen = render(
			<ImageUploadField
				value="https://acme.dev/avatar.png"
				removeLabel="Supprimer"
				onFileCropped={() => {}}
			/>,
		);
		expect(screen.queryByText("Supprimer")).toBeNull();
	});

	it("shows a progress bar instead of actions while uploading (view state)", () => {
		const screen = render(
			<ImageUploadField
				value="https://acme.dev/avatar.png"
				isUploading
				replaceLabel="Remplacer"
				onFileCropped={() => {}}
			/>,
		);
		expect(queryBySlot(screen, "image-upload-field-progress")).not.toBeNull();
		expect(screen.queryByText("Remplacer")).toBeNull();
	});

	it("returns to the view state when a new value arrives after editing", () => {
		const screen = render(<ImageUploadField onFileCropped={() => {}} />);
		expect(
			queryBySlot(screen, "image-upload-field")?.getAttribute("data-state"),
		).toBe("edit");
		screen.rerender(
			<ImageUploadField
				value="https://acme.dev/new.png"
				onFileCropped={() => {}}
			/>,
		);
		expect(
			queryBySlot(screen, "image-upload-field")?.getAttribute("data-state"),
		).toBe("view");
	});
});
