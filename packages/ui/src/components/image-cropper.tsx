import { UploadSimpleIcon } from "@phosphor-icons/react";
import * as React from "react";
import { cn } from "#/lib/utils.ts";

// Composable image selection + cropping. <ImageCropper> fixes the crop format
// (aspectRatio prop) and owns the picked file plus the crop transform (pan
// offset + zoom relative to "cover" fit); <ImageCropperDropzone> handles
// click / drag-and-drop selection, <ImageCropperArea> renders the crop
// viewport where all zooming happens through gestures — pinch, wheel,
// double-tap and keyboard — and `useImageCropper` exposes actions
// (cropToBlob, removeImage, …) so consumers can compose their own controls.

const ORIGIN: ImageCropperPoint = { x: 0, y: 0 };
const KEYBOARD_PAN_STEP = 16;
const KEYBOARD_ZOOM_FACTOR = 1.2;
const WHEEL_ZOOM_INTENSITY = 0.002;
const DOUBLE_TAP_ZOOM_FACTOR = 2;
const DOUBLE_TAP_MAXIMUM_DELAY_MS = 300;
const DOUBLE_TAP_MAXIMUM_DISTANCE_PX = 24;
const TAP_MAXIMUM_TRAVEL_PX = 8;

const KEYBOARD_PAN_OFFSETS: Record<string, ImageCropperPoint> = {
	ArrowLeft: { x: -KEYBOARD_PAN_STEP, y: 0 },
	ArrowRight: { x: KEYBOARD_PAN_STEP, y: 0 },
	ArrowUp: { x: 0, y: -KEYBOARD_PAN_STEP },
	ArrowDown: { x: 0, y: KEYBOARD_PAN_STEP },
};

type ImageCropperPoint = { x: number; y: number };
type ImageCropperSize = { width: number; height: number };

/** Crop rectangle in natural (intrinsic) image pixels. */
type ImageCropperCropArea = {
	x: number;
	y: number;
	width: number;
	height: number;
};

type ImageCropperCropToBlobOptions = {
	/** Output width in pixels; defaults to the natural crop width. */
	width?: number;
	/** Output height in pixels; defaults to `width / aspectRatio`. */
	height?: number;
	/** Canvas encoding MIME type, e.g. "image/jpeg" or "image/webp". */
	type?: string;
	/** Encoding quality between 0 and 1 for lossy types. */
	quality?: number;
};

function clampNumber(value: number, minimum: number, maximum: number): number {
	return Math.min(Math.max(value, minimum), maximum);
}

/** Scale at which the image exactly covers the viewport (zoom = 1). */
function coverScaleFor(
	image: ImageCropperSize,
	viewport: ImageCropperSize,
): number {
	return Math.max(viewport.width / image.width, viewport.height / image.height);
}

/** Keeps the image covering the viewport — no gaps on any edge. */
function clampOffset(
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

function distanceBetween(a: ImageCropperPoint, b: ImageCropperPoint): number {
	return Math.hypot(b.x - a.x, b.y - a.y);
}

function midpointBetween(
	a: ImageCropperPoint,
	b: ImageCropperPoint,
): ImageCropperPoint {
	return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** Client coordinates → point relative to the viewport center. */
function focalPointFor(
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

type ImageCropperContextValue = {
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

const ImageCropperContext =
	React.createContext<ImageCropperContextValue | null>(null);

function useImageCropperContext(part: string): ImageCropperContextValue {
	const context = React.use(ImageCropperContext);
	if (context === null) {
		throw new Error(`${part} must be used within <ImageCropper>`);
	}
	return context;
}

/** Access cropper state and actions (cropToBlob, removeImage, …) below <ImageCropper>. */
function useImageCropper(): ImageCropperContextValue {
	return useImageCropperContext("useImageCropper");
}

function ImageCropper({
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
}: {
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
	className?: string;
	children?: React.ReactNode;
}) {
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

function ImageCropperDropzone({
	label = "Choose an image",
	description = "Click to browse or drag and drop",
	className,
	children,
}: {
	label?: string;
	description?: string;
	className?: string;
	/** Replaces the default icon + label content entirely. */
	children?: React.ReactNode;
}) {
	const { aspectRatio, disabled, imageSource, openFilePicker, selectFile } =
		useImageCropperContext("ImageCropperDropzone");
	const [isDraggingOver, setIsDraggingOver] = React.useState(false);

	if (imageSource !== null) return null;

	return (
		<div
			role="button"
			tabIndex={disabled ? -1 : 0}
			aria-disabled={disabled || undefined}
			data-slot="image-cropper-dropzone"
			data-dragging-over={isDraggingOver || undefined}
			style={{ aspectRatio: String(aspectRatio) }}
			className={cn(
				"flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-input border-dashed bg-muted/30 p-6 text-center outline-none transition-colors hover:border-ring/60 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/50 data-[dragging-over]:border-ring data-[dragging-over]:bg-muted/60 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
				className,
			)}
			onClick={() => {
				if (!disabled) openFilePicker();
			}}
			onKeyDown={(event) => {
				if (disabled) return;
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					openFilePicker();
				}
			}}
			onDragOver={(event) => {
				event.preventDefault();
				if (!disabled) setIsDraggingOver(true);
			}}
			onDragLeave={() => setIsDraggingOver(false)}
			onDrop={(event) => {
				event.preventDefault();
				setIsDraggingOver(false);
				if (disabled) return;
				const file = event.dataTransfer.files[0];
				if (file !== undefined) selectFile(file);
			}}
		>
			{children ?? (
				<>
					<div className="flex size-10 items-center justify-center rounded-full bg-muted">
						<UploadSimpleIcon
							aria-hidden
							className="size-5 text-muted-foreground"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<p className="font-medium text-sm">{label}</p>
						<p className="text-muted-foreground text-xs">{description}</p>
					</div>
				</>
			)}
		</div>
	);
}

function ImageCropperArea({
	shape = "rectangle",
	"aria-label": ariaLabel = "Drag to move the image, pinch or scroll to zoom",
	className,
}: {
	/** Visual mask drawn over the viewport; "circle" pairs with aspectRatio 1. */
	shape?: "rectangle" | "circle";
	"aria-label"?: string;
	className?: string;
}) {
	const context = useImageCropperContext("ImageCropperArea");
	const {
		aspectRatio,
		disabled,
		imageSource,
		imageCrossOrigin,
		imageTransform,
		minZoom,
		zoom,
		panBy,
		zoomBy,
		resetCrop,
		imageElementRef,
		reportImageLoad,
		reportViewportSize,
	} = context;
	const contextRef = React.useRef(context);
	const viewportRef = React.useRef<HTMLDivElement>(null);
	const activePointersRef = React.useRef(new Map<number, ImageCropperPoint>());
	const pointerOriginsRef = React.useRef(new Map<number, ImageCropperPoint>());
	const lastTapRef = React.useRef<{
		timeStamp: number;
		point: ImageCropperPoint;
	} | null>(null);
	const [isDragging, setIsDragging] = React.useState(false);
	const hasImage = imageSource !== null;

	React.useEffect(() => {
		contextRef.current = context;
	});

	React.useEffect(() => {
		if (!hasImage) return;
		const viewport = viewportRef.current;
		if (viewport === null) return;
		const measure = () => {
			reportViewportSize(
				viewport.clientWidth > 0 && viewport.clientHeight > 0
					? { width: viewport.clientWidth, height: viewport.clientHeight }
					: null,
			);
		};
		const observer = new ResizeObserver(measure);
		observer.observe(viewport);
		measure();
		return () => {
			observer.disconnect();
			reportViewportSize(null);
		};
	}, [hasImage, reportViewportSize]);

	// React registers wheel listeners as passive, so opting out of page scroll
	// requires a native non-passive listener.
	React.useEffect(() => {
		if (!hasImage) return;
		const viewport = viewportRef.current;
		if (viewport === null) return;
		const handleWheel = (event: WheelEvent) => {
			if (contextRef.current.disabled) return;
			event.preventDefault();
			contextRef.current.zoomBy(
				Math.exp(-event.deltaY * WHEEL_ZOOM_INTENSITY),
				focalPointFor(viewport, event.clientX, event.clientY),
			);
		};
		viewport.addEventListener("wheel", handleWheel, { passive: false });
		return () => viewport.removeEventListener("wheel", handleWheel);
	}, [hasImage]);

	const releasePointer = (event: React.PointerEvent<HTMLDivElement>) => {
		activePointersRef.current.delete(event.pointerId);
		pointerOriginsRef.current.delete(event.pointerId);
		if (activePointersRef.current.size === 0) setIsDragging(false);
	};

	const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
		if (disabled) return;
		event.currentTarget.setPointerCapture?.(event.pointerId);
		const point = { x: event.clientX, y: event.clientY };
		activePointersRef.current.set(event.pointerId, point);
		pointerOriginsRef.current.set(event.pointerId, point);
		setIsDragging(true);
	};

	const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
		const pointers = activePointersRef.current;
		const previousPoint = pointers.get(event.pointerId);
		if (previousPoint === undefined || disabled) return;
		const currentPoint = { x: event.clientX, y: event.clientY };
		if (pointers.size === 1) {
			panBy(currentPoint.x - previousPoint.x, currentPoint.y - previousPoint.y);
		} else {
			// Pinch: pan with the midpoint, zoom with the distance ratio.
			const otherEntry = [...pointers.entries()].find(
				([pointerId]) => pointerId !== event.pointerId,
			);
			if (otherEntry !== undefined) {
				const [, otherPoint] = otherEntry;
				const previousMidpoint = midpointBetween(previousPoint, otherPoint);
				const currentMidpoint = midpointBetween(currentPoint, otherPoint);
				panBy(
					currentMidpoint.x - previousMidpoint.x,
					currentMidpoint.y - previousMidpoint.y,
				);
				const previousDistance = distanceBetween(previousPoint, otherPoint);
				const currentDistance = distanceBetween(currentPoint, otherPoint);
				if (previousDistance > 0 && viewportRef.current !== null) {
					zoomBy(
						currentDistance / previousDistance,
						focalPointFor(
							viewportRef.current,
							currentMidpoint.x,
							currentMidpoint.y,
						),
					);
				}
			}
		}
		pointers.set(event.pointerId, currentPoint);
	};

	const applyDoubleTapZoom = (point: ImageCropperPoint) => {
		const viewport = viewportRef.current;
		if (viewport === null) return;
		if (zoom > minZoom * 1.01) {
			resetCrop();
			return;
		}
		zoomBy(DOUBLE_TAP_ZOOM_FACTOR, focalPointFor(viewport, point.x, point.y));
	};

	const registerTap = (
		event: React.PointerEvent<HTMLDivElement>,
		point: ImageCropperPoint,
	) => {
		const lastTap = lastTapRef.current;
		const isDoubleTap =
			lastTap !== null &&
			event.timeStamp - lastTap.timeStamp <= DOUBLE_TAP_MAXIMUM_DELAY_MS &&
			distanceBetween(lastTap.point, point) <= DOUBLE_TAP_MAXIMUM_DISTANCE_PX;
		if (!isDoubleTap) {
			lastTapRef.current = { timeStamp: event.timeStamp, point };
			return;
		}
		lastTapRef.current = null;
		applyDoubleTapZoom(point);
	};

	const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
		const origin = pointerOriginsRef.current.get(event.pointerId);
		const point = { x: event.clientX, y: event.clientY };
		const isTap =
			origin !== undefined &&
			activePointersRef.current.size === 1 &&
			distanceBetween(origin, point) <= TAP_MAXIMUM_TRAVEL_PX;
		if (isTap && !disabled) {
			registerTap(event, point);
		}
		releasePointer(event);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (disabled) return;
		const panOffset = KEYBOARD_PAN_OFFSETS[event.key];
		if (panOffset !== undefined) {
			event.preventDefault();
			panBy(panOffset.x, panOffset.y);
			return;
		}
		if (event.key === "+" || event.key === "=") {
			event.preventDefault();
			zoomBy(KEYBOARD_ZOOM_FACTOR);
		} else if (event.key === "-") {
			event.preventDefault();
			zoomBy(1 / KEYBOARD_ZOOM_FACTOR);
		} else if (event.key === "0") {
			event.preventDefault();
			resetCrop();
		}
	};

	if (!hasImage) return null;

	return (
		<div
			ref={viewportRef}
			role="application"
			aria-label={ariaLabel}
			tabIndex={disabled ? -1 : 0}
			data-slot="image-cropper-area"
			data-shape={shape}
			data-dragging={isDragging || undefined}
			style={{ aspectRatio: String(aspectRatio) }}
			className={cn(
				"relative w-full touch-none select-none overflow-hidden rounded-lg bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
				disabled
					? "cursor-not-allowed opacity-50"
					: "cursor-grab data-[dragging]:cursor-grabbing",
				className,
			)}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={releasePointer}
			onLostPointerCapture={releasePointer}
			onKeyDown={handleKeyDown}
		>
			{/* translate(-50%, -50%) centers the image; the screen-space offset and
			    cover scale × zoom come from the crop transform. */}
			<img
				ref={imageElementRef}
				src={imageSource}
				alt=""
				crossOrigin={imageCrossOrigin}
				draggable={false}
				data-slot="image-cropper-image"
				className="absolute top-1/2 left-1/2 max-w-none"
				style={
					imageTransform === null
						? { visibility: "hidden" }
						: {
								transform: `translate3d(${imageTransform.x}px, ${imageTransform.y}px, 0) translate(-50%, -50%) scale(${imageTransform.scale})`,
							}
				}
				onLoad={(event) => reportImageLoad(event.currentTarget)}
			/>
			{shape === "circle" && (
				<div
					aria-hidden
					data-slot="image-cropper-mask"
					className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
				/>
			)}
			<div
				aria-hidden
				data-slot="image-cropper-grid"
				className={cn(
					"pointer-events-none absolute inset-0 transition-opacity duration-200",
					isDragging ? "opacity-100" : "opacity-0",
				)}
			>
				<div className="absolute inset-y-0 left-1/3 w-px bg-white/50" />
				<div className="absolute inset-y-0 left-2/3 w-px bg-white/50" />
				<div className="absolute inset-x-0 top-1/3 h-px bg-white/50" />
				<div className="absolute inset-x-0 top-2/3 h-px bg-white/50" />
			</div>
		</div>
	);
}

export {
	ImageCropper,
	ImageCropperArea,
	type ImageCropperCropArea,
	type ImageCropperCropToBlobOptions,
	ImageCropperDropzone,
	useImageCropper,
};
