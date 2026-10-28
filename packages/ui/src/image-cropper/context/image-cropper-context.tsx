import * as React from "react";
import type {
	ImageCropperCropArea,
	ImageCropperPoint,
	ImageCropperSize,
} from "#/image-cropper/lib/image-cropper-geometry.ts";

export type ImageCropperCropToBlobOptions = {
	/** Output width in pixels; defaults to the natural crop width. */
	width?: number;
	/** Output height in pixels; defaults to `width / aspectRatio`. */
	height?: number;
	/** Canvas encoding MIME type, e.g. "image/jpeg" or "image/webp". */
	type?: string;
	/** Encoding quality between 0 and 1 for lossy types. */
	quality?: number;
};

export type ImageCropperContextValue = {
	accept: string;
	aspectRatio: number;
	disabled: boolean;
	minZoom: number;
	maxZoom: number;
	/** Source URL of the selected image, or null while nothing is selected. */
	imageSource: string | null;
	/** CORS mode applied to remote images so the export canvas stays untainted. */
	imageCrossOrigin: React.ComponentProps<"img">["crossOrigin"];
	/** Screen transform of the image; null until the image and viewport are measured. */
	imageTransform: { x: number; y: number; scale: number } | null;
	zoom: number;
	/** Zoom to an absolute level, keeping the focal point (viewport-center relative) stationary. */
	zoomTo: (zoom: number, focalPoint?: ImageCropperPoint) => void;
	/** Multiply the current zoom, keeping the focal point stationary. */
	zoomBy: (factor: number, focalPoint?: ImageCropperPoint) => void;
	panBy: (deltaX: number, deltaY: number) => void;
	resetCrop: () => void;
	openFilePicker: () => void;
	selectFile: (file: File) => void;
	removeImage: () => void;
	getCropArea: () => ImageCropperCropArea | null;
	/** Renders the crop to an offscreen canvas and encodes it. */
	cropToBlob: (options?: ImageCropperCropToBlobOptions) => Promise<Blob>;
	imageElementRef: React.RefObject<HTMLImageElement | null>;
	reportImageLoad: (element: HTMLImageElement) => void;
	reportViewportSize: React.Dispatch<
		React.SetStateAction<ImageCropperSize | null>
	>;
};

export const ImageCropperContext =
	React.createContext<ImageCropperContextValue | null>(null);

export function useImageCropperContext(part: string): ImageCropperContextValue {
	const context = React.use(ImageCropperContext);
	if (context === null) {
		throw new Error(`${part} must be used within <ImageCropper.Root>`);
	}
	return context;
}

/** Access cropper state and actions (cropToBlob, removeImage, …) below <ImageCropper.Root>. */
export function useImageCropper(): ImageCropperContextValue {
	return useImageCropperContext("useImageCropper");
}
