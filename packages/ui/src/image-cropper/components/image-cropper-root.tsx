import * as React from "react";
import {
	ImageCropperContext,
	type ImageCropperCropToBlobOptions,
} from "#/image-cropper/context/image-cropper-context.tsx";
import {
	clampNumber,
	clampOffset,
	coverScaleFor,
	type ImageCropperCropArea,
	type ImageCropperPoint,
	type ImageCropperSize,
	ORIGIN,
} from "#/image-cropper/lib/image-cropper-geometry.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	/** Width / height ratio of the crop viewport, e.g. 1 for avatars or 16 / 9 for covers. */
	aspectRatio?: number;
	/** Lowest zoom level; 1 means the image exactly covers the viewport. */
	minZoom?: number;
	maxZoom?: number;
	/** File input accept filter. */
	accept?: string;
	/** Image URL to start cropping without going through file selection. */
	defaultImage?: string;
	/**
	 * CORS mode for remote image URLs — without it the export canvas is
	 * tainted and cropToBlob throws a SecurityError. Picked files load
	 * through blob: URLs and never need it.
	 */
	crossOrigin?: React.ComponentProps<"img">["crossOrigin"];
	disabled?: boolean;
	/** Reports the picked file, or null when the image is removed. */
	onImageChange?: (file: File | null) => void;
	/** Reports the crop rectangle in natural image pixels whenever it moves. */
	onCropChange?: (cropArea: ImageCropperCropArea) => void;
}

export function ImageCropperRoot({
	aspectRatio = 1,
	minZoom = 1,
	maxZoom = 4,
	accept = "image/*",
	defaultImage,
	crossOrigin = "anonymous",
	disabled = false,
	onImageChange,
	onCropChange,
	className,
	children,
	...props
}: Props) {
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const imageElementRef = React.useRef<HTMLImageElement | null>(null);
	const ownedObjectUrlRef = React.useRef<string | null>(null);
	const [imageSource, setImageSource] = React.useState<string | null>(
		defaultImage ?? null,
	);
	const [naturalSize, setNaturalSize] = React.useState<ImageCropperSize | null>(
		null,
	);
	const [viewportSize, setViewportSize] =
		React.useState<ImageCropperSize | null>(null);
	const [transform, setTransform] = React.useState<{
		zoom: number;
		offset: ImageCropperPoint;
	}>({ zoom: minZoom, offset: ORIGIN });

	const applyZoom = (
		computeZoom: (previousZoom: number) => number,
		focalPoint: ImageCropperPoint = ORIGIN,
	) => {
		setTransform((previous) => {
			if (naturalSize === null || viewportSize === null) return previous;
			const zoom = clampNumber(computeZoom(previous.zoom), minZoom, maxZoom);
			// Keep the image point under the focal point stationary while scaling.
			const factor = zoom / previous.zoom;
			const offset = {
				x: focalPoint.x + (previous.offset.x - focalPoint.x) * factor,
				y: focalPoint.y + (previous.offset.y - focalPoint.y) * factor,
			};
			return {
				zoom,
				offset: clampOffset(offset, zoom, naturalSize, viewportSize),
			};
		});
	};

	const zoomTo = (zoom: number, focalPoint?: ImageCropperPoint) =>
		applyZoom(() => zoom, focalPoint);

	const zoomBy = (factor: number, focalPoint?: ImageCropperPoint) =>
		applyZoom((previousZoom) => previousZoom * factor, focalPoint);

	const panBy = (deltaX: number, deltaY: number) => {
		setTransform((previous) => {
			if (naturalSize === null || viewportSize === null) return previous;
			const offset = {
				x: previous.offset.x + deltaX,
				y: previous.offset.y + deltaY,
			};
			return {
				zoom: previous.zoom,
				offset: clampOffset(offset, previous.zoom, naturalSize, viewportSize),
			};
		});
	};

	const resetCrop = () => {
		setTransform({ zoom: minZoom, offset: ORIGIN });
	};

	const openFilePicker = () => {
		fileInputRef.current?.click();
	};

	const selectFile = (file: File) => {
		if (disabled || !file.type.startsWith("image/")) return;
		const nextSource = URL.createObjectURL(file);
		if (ownedObjectUrlRef.current !== null) {
			URL.revokeObjectURL(ownedObjectUrlRef.current);
		}
		ownedObjectUrlRef.current = nextSource;
		setNaturalSize(null);
		setTransform({ zoom: minZoom, offset: ORIGIN });
		setImageSource(nextSource);
		onImageChange?.(file);
	};

	const removeImage = () => {
		if (ownedObjectUrlRef.current !== null) {
			URL.revokeObjectURL(ownedObjectUrlRef.current);
			ownedObjectUrlRef.current = null;
		}
		setImageSource(null);
		setNaturalSize(null);
		setTransform({ zoom: minZoom, offset: ORIGIN });
		onImageChange?.(null);
	};

	const reportImageLoad = (element: HTMLImageElement) => {
		if (element.naturalWidth === 0 || element.naturalHeight === 0) return;
		setNaturalSize({
			width: element.naturalWidth,
			height: element.naturalHeight,
		});
		setTransform({ zoom: minZoom, offset: ORIGIN });
	};

	const cropArea = React.useMemo<ImageCropperCropArea | null>(() => {
		if (naturalSize === null || viewportSize === null) return null;
		const displayScale =
			coverScaleFor(naturalSize, viewportSize) * transform.zoom;
		const width = viewportSize.width / displayScale;
		const height = viewportSize.height / displayScale;
		return {
			x: naturalSize.width / 2 - transform.offset.x / displayScale - width / 2,
			y:
				naturalSize.height / 2 - transform.offset.y / displayScale - height / 2,
			width,
			height,
		};
	}, [naturalSize, viewportSize, transform]);

	const getCropArea = () => cropArea;

	const cropToBlob = async (
		options: ImageCropperCropToBlobOptions = {},
	): Promise<Blob> => {
		const imageElement = imageElementRef.current;
		if (cropArea === null || imageElement === null) {
			throw new Error("ImageCropper: no image to crop");
		}
		const outputWidth = Math.round(
			options.width ??
				(options.height !== undefined
					? options.height * aspectRatio
					: cropArea.width),
		);
		const outputHeight = Math.round(
			options.height ?? outputWidth / aspectRatio,
		);
		const canvas = document.createElement("canvas");
		canvas.width = outputWidth;
		canvas.height = outputHeight;
		const canvasContext = canvas.getContext("2d");
		if (canvasContext === null) {
			throw new Error("ImageCropper: canvas 2d context unavailable");
		}
		canvasContext.drawImage(
			imageElement,
			cropArea.x,
			cropArea.y,
			cropArea.width,
			cropArea.height,
			0,
			0,
			outputWidth,
			outputHeight,
		);
		return await new Promise<Blob>((resolve, reject) => {
			canvas.toBlob(
				(blob) => {
					if (blob === null) {
						reject(new Error("ImageCropper: failed to encode the crop"));
					} else {
						resolve(blob);
					}
				},
				options.type ?? "image/png",
				options.quality,
			);
		});
	};

	// Re-clamp when the viewport is resized or a new image finishes loading.
	React.useEffect(() => {
		if (naturalSize === null || viewportSize === null) return;
		setTransform((previous) => ({
			zoom: previous.zoom,
			offset: clampOffset(
				previous.offset,
				previous.zoom,
				naturalSize,
				viewportSize,
			),
		}));
	}, [naturalSize, viewportSize]);

	React.useEffect(() => {
		if (cropArea !== null) onCropChange?.(cropArea);
	}, [cropArea, onCropChange]);

	React.useEffect(
		() => () => {
			if (ownedObjectUrlRef.current !== null) {
				URL.revokeObjectURL(ownedObjectUrlRef.current);
			}
		},
		[],
	);

	const imageTransform =
		naturalSize !== null && viewportSize !== null
			? {
					x: transform.offset.x,
					y: transform.offset.y,
					scale: coverScaleFor(naturalSize, viewportSize) * transform.zoom,
				}
			: null;

	const imageCrossOrigin =
		imageSource !== null &&
		!imageSource.startsWith("blob:") &&
		!imageSource.startsWith("data:")
			? crossOrigin
			: undefined;

	return (
		<ImageCropperContext.Provider
			value={{
				accept,
				aspectRatio,
				disabled,
				minZoom,
				maxZoom,
				imageSource,
				imageCrossOrigin,
				imageTransform,
				zoom: transform.zoom,
				zoomTo,
				zoomBy,
				panBy,
				resetCrop,
				openFilePicker,
				selectFile,
				removeImage,
				getCropArea,
				cropToBlob,
				imageElementRef,
				reportImageLoad,
				reportViewportSize: setViewportSize,
			}}
		>
			<div
				data-slot="image-cropper"
				className={cn("flex w-full flex-col gap-3", className)}
				{...props}
			>
				{children}
				<input
					ref={fileInputRef}
					type="file"
					accept={accept}
					disabled={disabled}
					data-slot="image-cropper-input"
					className="hidden"
					onChange={(event) => {
						const file = event.target.files?.[0];
						if (file !== undefined) selectFile(file);
						// Allow re-selecting the same file after a removal.
						event.target.value = "";
					}}
				/>
			</div>
		</ImageCropperContext.Provider>
	);
}
