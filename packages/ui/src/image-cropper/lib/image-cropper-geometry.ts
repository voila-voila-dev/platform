export type ImageCropperPoint = { x: number; y: number };
export type ImageCropperSize = { width: number; height: number };

/** Crop rectangle in natural (intrinsic) image pixels. */
export type ImageCropperCropArea = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export const ORIGIN: ImageCropperPoint = { x: 0, y: 0 };

export function clampNumber(
	value: number,
	minimum: number,
	maximum: number,
): number {
	return Math.min(Math.max(value, minimum), maximum);
}

/** Scale at which the image exactly covers the viewport (zoom = 1). */
export function coverScaleFor(
	image: ImageCropperSize,
	viewport: ImageCropperSize,
): number {
	return Math.max(viewport.width / image.width, viewport.height / image.height);
}

/** Keeps the image covering the viewport — no gaps on any edge. */
export function clampOffset(
	offset: ImageCropperPoint,
	zoom: number,
	image: ImageCropperSize,
	viewport: ImageCropperSize,
): ImageCropperPoint {
	const displayScale = coverScaleFor(image, viewport) * zoom;
	const maximumX = Math.max(
		0,
		(image.width * displayScale - viewport.width) / 2,
	);
	const maximumY = Math.max(
		0,
		(image.height * displayScale - viewport.height) / 2,
	);
	return {
		x: clampNumber(offset.x, -maximumX, maximumX),
		y: clampNumber(offset.y, -maximumY, maximumY),
	};
}

export function distanceBetween(
	a: ImageCropperPoint,
	b: ImageCropperPoint,
): number {
	return Math.hypot(b.x - a.x, b.y - a.y);
}

export function midpointBetween(
	a: ImageCropperPoint,
	b: ImageCropperPoint,
): ImageCropperPoint {
	return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** Client coordinates → point relative to the viewport center. */
export function focalPointFor(
	viewport: HTMLElement,
	clientX: number,
	clientY: number,
): ImageCropperPoint {
	const rectangle = viewport.getBoundingClientRect();
	return {
		x: clientX - rectangle.left - rectangle.width / 2,
		y: clientY - rectangle.top - rectangle.height / 2,
	};
}
