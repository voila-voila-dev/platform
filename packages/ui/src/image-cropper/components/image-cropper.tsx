import { ImageCropperArea } from "#/image-cropper/components/image-cropper-area.tsx";
import { ImageCropperDropzone } from "#/image-cropper/components/image-cropper-dropzone.tsx";
import { ImageCropperRoot } from "#/image-cropper/components/image-cropper-root.tsx";

export { useImageCropper } from "#/image-cropper/context/image-cropper-context.tsx";

// Composable image selection + cropping. <ImageCropper.Root> fixes the crop format
// (aspectRatio prop) and owns the picked file plus the crop transform (pan
// offset + zoom relative to "cover" fit); <ImageCropper.Dropzone> handles
// click / drag-and-drop selection, <ImageCropper.Area> renders the crop
// viewport where all zooming happens through gestures — pinch, wheel,
// double-tap and keyboard — and `useImageCropper` exposes actions
// (cropToBlob, removeImage, …) so consumers can compose their own controls.

/**
 * The ImageCropper parts as one namespace.
 */
export const ImageCropper = {
	Root: ImageCropperRoot,
	Area: ImageCropperArea,
	Dropzone: ImageCropperDropzone,
};

export type { ImageCropperCropToBlobOptions } from "#/image-cropper/context/image-cropper-context.tsx";
export type { ImageCropperCropArea } from "#/image-cropper/lib/image-cropper-geometry.ts";
