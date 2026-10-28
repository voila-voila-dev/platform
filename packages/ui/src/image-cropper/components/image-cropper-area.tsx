import * as React from "react";
import { useImageCropperContext } from "#/image-cropper/context/image-cropper-context.tsx";
import {
	distanceBetween,
	focalPointFor,
	type ImageCropperPoint,
	midpointBetween,
} from "#/image-cropper/lib/image-cropper-geometry.ts";
import { cn } from "#/lib/utils.ts";

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

interface Props extends React.ComponentProps<"div"> {
	/** Visual mask drawn over the viewport; "circle" pairs with aspectRatio 1. */
	shape?: "rectangle" | "circle";
}

export function ImageCropperArea({
	shape = "rectangle",
	"aria-label": ariaLabel = "Drag to move the image, pinch or scroll to zoom",
	className,
	...props
}: Props) {
	const context = useImageCropperContext("ImageCropper.Area");
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
		removeImage,
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
			{...props}
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
				// A file the browser cannot decode would otherwise leave the user on a
				// crop screen whose image never appears; back to the dropzone instead.
				onError={removeImage}
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
