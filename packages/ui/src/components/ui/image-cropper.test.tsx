// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	ImageCropper,
	ImageCropperArea,
	ImageCropperDropzone,
	useImageCropper,
} from "#/components/ui/image-cropper.tsx";

const VIEWPORT_SIZE = 400;
const NATURAL_WIDTH = 800;
const NATURAL_HEIGHT = 600;

let objectUrlCounter = 0;

beforeEach(() => {
	objectUrlCounter = 0;
	vi.stubGlobal(
		"ResizeObserver",
		class {
			observe() {}
			unobserve() {}
			disconnect() {}
		},
	);
	// jsdom implements neither blob URLs nor layout; the crop area measures
	// itself through clientWidth/clientHeight, so stub both.
	URL.createObjectURL = vi.fn(() => {
		objectUrlCounter += 1;
		return `blob:mock-${objectUrlCounter}`;
	});
	URL.revokeObjectURL = vi.fn();
	Object.defineProperty(HTMLElement.prototype, "clientWidth", {
		configurable: true,
		get(this: HTMLElement) {
			return this.dataset.slot === "image-cropper-area" ? VIEWPORT_SIZE : 0;
		},
	});
	Object.defineProperty(HTMLElement.prototype, "clientHeight", {
		configurable: true,
		get(this: HTMLElement) {
			return this.dataset.slot === "image-cropper-area" ? VIEWPORT_SIZE : 0;
		},
	});
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
	Reflect.deleteProperty(HTMLElement.prototype, "clientWidth");
	Reflect.deleteProperty(HTMLElement.prototype, "clientHeight");
});

function queryDropzone(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector<HTMLDivElement>(
		"[data-slot=image-cropper-dropzone]",
	);
}

function queryArea(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector<HTMLDivElement>(
		"[data-slot=image-cropper-area]",
	);
}

function queryImage(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector<HTMLImageElement>(
		"[data-slot=image-cropper-image]",
	);
}

function queryFileInput(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector<HTMLInputElement>(
		"[data-slot=image-cropper-input]",
	);
}

function selectImageFile(screen: ReturnType<typeof render>) {
	const input = queryFileInput(screen);
	if (input === null) throw new Error("file input not found");
	const file = new File(["image-bytes"], "photo.png", { type: "image/png" });
	fireEvent.change(input, { target: { files: [file] } });
	return file;
}

function loadImage(
	screen: ReturnType<typeof render>,
	width = NATURAL_WIDTH,
	height = NATURAL_HEIGHT,
) {
	const image = queryImage(screen);
	if (image === null) throw new Error("image element not found");
	Object.defineProperty(image, "naturalWidth", {
		configurable: true,
		value: width,
	});
	Object.defineProperty(image, "naturalHeight", {
		configurable: true,
		value: height,
	});
	fireEvent.load(image);
	return image;
}

function Cropper(props: React.ComponentProps<typeof ImageCropper>) {
	return (
		<ImageCropper {...props}>
			<ImageCropperDropzone />
			<ImageCropperArea />
		</ImageCropper>
	);
}

describe("ImageCropper selection", () => {
	it("shows the dropzone with its default labels while nothing is selected", () => {
		const screen = render(<Cropper />);
		const dropzone = queryDropzone(screen);
		expect(dropzone?.textContent).toContain("Choose an image");
		expect(dropzone?.textContent).toContain("Click to browse or drag and drop");
		expect(queryArea(screen)).toBeNull();
	});

	it("opens the file picker when the dropzone is clicked", () => {
		const screen = render(<Cropper />);
		const input = queryFileInput(screen);
		if (input === null) throw new Error("file input not found");
		const click = vi.spyOn(input, "click");
		const dropzone = queryDropzone(screen);
		if (dropzone === null) throw new Error("dropzone not found");
		fireEvent.click(dropzone);
		expect(click).toHaveBeenCalledTimes(1);
	});

	it("swaps the dropzone for the crop area once a file is selected", () => {
		const onImageChange = vi.fn();
		const screen = render(<Cropper onImageChange={onImageChange} />);
		const file = selectImageFile(screen);
		expect(onImageChange).toHaveBeenCalledWith(file);
		expect(queryDropzone(screen)).toBeNull();
		expect(queryImage(screen)?.src).toContain("blob:mock-");
	});

	it("accepts a file dropped on the dropzone", () => {
		const onImageChange = vi.fn();
		const screen = render(<Cropper onImageChange={onImageChange} />);
		const dropzone = queryDropzone(screen);
		if (dropzone === null) throw new Error("dropzone not found");
		const file = new File(["image-bytes"], "photo.jpg", {
			type: "image/jpeg",
		});
		fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
		expect(onImageChange).toHaveBeenCalledWith(file);
		expect(queryArea(screen)).not.toBeNull();
	});

	it("ignores dropped files that are not images", () => {
		const onImageChange = vi.fn();
		const screen = render(<Cropper onImageChange={onImageChange} />);
		const dropzone = queryDropzone(screen);
		if (dropzone === null) throw new Error("dropzone not found");
		const file = new File(["plain text"], "notes.txt", {
			type: "text/plain",
		});
		fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
		expect(onImageChange).not.toHaveBeenCalled();
		expect(queryDropzone(screen)).not.toBeNull();
	});

	it("starts on the crop area when defaultImage is provided", () => {
		const screen = render(<Cropper defaultImage="https://example.com/a.png" />);
		expect(queryDropzone(screen)).toBeNull();
		expect(queryImage(screen)?.src).toBe("https://example.com/a.png");
	});
});

describe("ImageCropper transform", () => {
	it("centers the image at cover scale once it loads", () => {
		const screen = render(<Cropper />);
		selectImageFile(screen);
		loadImage(screen);
		// Cover scale for 800x600 in a 400x400 viewport is 400 / 600.
		expect(queryImage(screen)?.style.transform).toBe(
			`translate3d(0px, 0px, 0) translate(-50%, -50%) scale(${VIEWPORT_SIZE / NATURAL_HEIGHT})`,
		);
	});

	it("pans with arrow keys and clamps at the image edge", () => {
		const screen = render(<Cropper />);
		selectImageFile(screen);
		loadImage(screen);
		const area = queryArea(screen);
		if (area === null) throw new Error("area not found");
		fireEvent.keyDown(area, { key: "ArrowRight" });
		expect(queryImage(screen)?.style.transform).toContain(
			"translate3d(16px, 0px, 0)",
		);
		// The displayed image is 533.33x400, so the horizontal travel limit is
		// (533.33 - 400) / 2 ≈ 66.67 — five more steps must clamp there.
		for (let step = 0; step < 5; step += 1) {
			fireEvent.keyDown(area, { key: "ArrowRight" });
		}
		const transform = queryImage(screen)?.style.transform ?? "";
		expect(transform).toContain("translate3d(66.66");
	});

	it("never pans vertically when the image already fits that axis", () => {
		const screen = render(<Cropper />);
		selectImageFile(screen);
		loadImage(screen);
		const area = queryArea(screen);
		if (area === null) throw new Error("area not found");
		fireEvent.keyDown(area, { key: "ArrowDown" });
		expect(queryImage(screen)?.style.transform).toContain(
			"translate3d(0px, 0px, 0)",
		);
	});

	it("zooms with the keyboard and resets with the 0 key", () => {
		const screen = render(<Cropper />);
		selectImageFile(screen);
		loadImage(screen);
		const area = queryArea(screen);
		if (area === null) throw new Error("area not found");
		fireEvent.keyDown(area, { key: "+" });
		expect(queryImage(screen)?.style.transform).toContain(
			`scale(${(VIEWPORT_SIZE / NATURAL_HEIGHT) * 1.2})`,
		);
		fireEvent.keyDown(area, { key: "0" });
		expect(queryImage(screen)?.style.transform).toContain(
			`scale(${VIEWPORT_SIZE / NATURAL_HEIGHT})`,
		);
	});

	it("pans while dragging with a pointer", () => {
		const screen = render(<Cropper />);
		selectImageFile(screen);
		loadImage(screen);
		const area = queryArea(screen);
		if (area === null) throw new Error("area not found");
		fireEvent.pointerDown(area, { pointerId: 1, clientX: 100, clientY: 100 });
		expect(area.dataset.dragging).toBe("true");
		fireEvent.pointerMove(area, { pointerId: 1, clientX: 130, clientY: 100 });
		expect(queryImage(screen)?.style.transform).toContain(
			"translate3d(30px, 0px, 0)",
		);
		fireEvent.pointerUp(area, { pointerId: 1, clientX: 130, clientY: 100 });
		expect(area.dataset.dragging).toBeUndefined();
	});
});

function RemoveButton() {
	const { removeImage } = useImageCropper();
	return (
		<button type="button" data-testid="remove" onClick={removeImage}>
			Remove
		</button>
	);
}

function CropAreaReadout() {
	const { getCropArea } = useImageCropper();
	const cropArea = getCropArea();
	return (
		<output data-testid="crop-area">
			{cropArea === null
				? "none"
				: [cropArea.x, cropArea.y, cropArea.width, cropArea.height]
						.map(Math.round)
						.join(",")}
		</output>
	);
}

describe("ImageCropper cross-origin export", () => {
	it("marks remote images as anonymous so the export canvas stays untainted", () => {
		const screen = render(<Cropper defaultImage="https://example.com/a.png" />);
		expect(queryImage(screen)?.getAttribute("crossorigin")).toBe("anonymous");
	});

	it("honors a custom crossOrigin mode", () => {
		const screen = render(
			<Cropper
				defaultImage="https://example.com/a.png"
				crossOrigin="use-credentials"
			/>,
		);
		expect(queryImage(screen)?.getAttribute("crossorigin")).toBe(
			"use-credentials",
		);
	});

	it("leaves picked files without a crossorigin attribute", () => {
		const screen = render(<Cropper />);
		selectImageFile(screen);
		expect(queryImage(screen)?.getAttribute("crossorigin")).toBeNull();
	});
});

describe("ImageCropper composition", () => {
	it("exposes the visible crop rectangle in natural pixels", () => {
		const screen = render(
			<ImageCropper>
				<ImageCropperDropzone />
				<ImageCropperArea />
				<CropAreaReadout />
			</ImageCropper>,
		);
		expect(screen.getByTestId("crop-area").textContent).toBe("none");
		selectImageFile(screen);
		loadImage(screen);
		// Zoom 1 over 800x600 in a square viewport shows the centered 600x600.
		expect(screen.getByTestId("crop-area").textContent).toBe("100,0,600,600");
	});

	it("removes the image, revokes its object URL and reports null", () => {
		const onImageChange = vi.fn();
		const screen = render(
			<ImageCropper onImageChange={onImageChange}>
				<ImageCropperDropzone />
				<ImageCropperArea />
				<RemoveButton />
			</ImageCropper>,
		);
		selectImageFile(screen);
		fireEvent.click(screen.getByTestId("remove"));
		expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-1");
		expect(onImageChange).toHaveBeenLastCalledWith(null);
		expect(queryDropzone(screen)).not.toBeNull();
	});

	it("keeps the dropzone inert when disabled", () => {
		const screen = render(<Cropper disabled />);
		const input = queryFileInput(screen);
		if (input === null) throw new Error("file input not found");
		const click = vi.spyOn(input, "click");
		const dropzone = queryDropzone(screen);
		if (dropzone === null) throw new Error("dropzone not found");
		expect(dropzone.getAttribute("aria-disabled")).toBe("true");
		fireEvent.click(dropzone);
		expect(click).not.toHaveBeenCalled();
	});

	it("throws when cropper parts are used outside <ImageCropper>", () => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});
		expect(() => render(<ImageCropperArea />)).toThrow(
			"ImageCropperArea must be used within <ImageCropper>",
		);
		consoleError.mockRestore();
	});
});
