import { TrashIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import * as React from "react";
import { Button } from "#/components/button.tsx";
import {
	ImageCropper,
	ImageCropperArea,
	ImageCropperDropzone,
	useImageCropper,
} from "#/components/image-cropper.tsx";
import { Progress } from "#/components/progress.tsx";
import { cn } from "#/lib/utils.ts";

type ImageUploadShape = "circle" | "rectangle";

/**
 * Confirm / cancel controls for an active crop. Rendered inside
 * <ImageCropper> so it can reach `cropToBlob`; shown only once a file is
 * picked. On confirm it produces a Blob and hands it to the parent — this
 * component never performs the network upload itself.
 */
function CropControls({
	hasPicked,
	isUploading,
	cancelLabel,
	confirmLabel,
	outputSize,
	onCropped,
}: {
	hasPicked: boolean;
	isUploading: boolean;
	cancelLabel: string;
	confirmLabel: string;
	outputSize?: { readonly width: number; readonly height: number };
	onCropped: (blob: Blob) => void;
}) {
	const { cropToBlob, removeImage } = useImageCropper();
	if (!hasPicked) return null;
	return (
		<div data-slot="image-upload-field-crop-controls" className="flex gap-2">
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="flex-1"
				disabled={isUploading}
				onClick={removeImage}
			>
				{cancelLabel}
			</Button>
			<Button
				type="button"
				size="sm"
				className="flex-1"
				loading={isUploading}
				onClick={async () => {
					onCropped(await cropToBlob({ ...outputSize, type: "image/png" }));
				}}
			>
				{confirmLabel}
			</Button>
		</div>
	);
}

/**
 * The "view" state: the current image with Replace / Remove, or a Progress bar
 * while the parent's upload is in flight.
 */
function ImageUploadFieldView({
	value,
	shape,
	aspectRatio,
	isUploading,
	replaceLabel,
	removeLabel,
	onReplace,
	onRemove,
	className,
	...props
}: React.ComponentProps<"div"> & {
	value: string;
	shape: ImageUploadShape;
	aspectRatio: number;
	isUploading: boolean;
	replaceLabel: React.ReactNode;
	removeLabel: React.ReactNode;
	onReplace: () => void;
	onRemove?: () => void;
}) {
	const isCircle = shape === "circle";
	return (
		<div
			data-slot="image-upload-field"
			data-shape={shape}
			data-state="view"
			className={cn("flex flex-col items-center gap-3", className)}
			{...props}
		>
			<img
				src={value}
				alt=""
				data-slot="image-upload-field-preview"
				style={{ aspectRatio: String(aspectRatio) }}
				className={cn(
					"w-full max-w-xs border border-border object-cover",
					isCircle ? "mx-auto size-32 rounded-full" : "rounded-lg",
				)}
			/>
			{isUploading ? (
				<Progress
					value={null}
					className="w-full max-w-xs"
					data-slot="image-upload-field-progress"
				/>
			) : (
				<div className="flex items-center gap-2">
					<Button type="button" variant="outline" size="sm" onClick={onReplace}>
						<UploadSimpleIcon />
						{replaceLabel}
					</Button>
					{onRemove ? (
						<Button type="button" variant="ghost" size="sm" onClick={onRemove}>
							<TrashIcon />
							{removeLabel}
						</Button>
					) : null}
				</div>
			)}
		</div>
	);
}

type ImageUploadCropperProps = {
	shape: ImageUploadShape;
	aspectRatio: number;
	isUploading: boolean;
	label: React.ReactNode;
	description: React.ReactNode;
	cancelLabel: string;
	confirmLabel: string;
	outputSize?: { readonly width: number; readonly height: number };
	hasPicked: boolean;
	onPickedChange: (hasPicked: boolean) => void;
	onFileCropped: (blob: Blob) => void;
};

/** The dropzone → crop → confirm flow itself, minus the surrounding chrome. */
function ImageUploadCropper({
	shape,
	aspectRatio,
	isUploading,
	label,
	description,
	cancelLabel,
	confirmLabel,
	outputSize,
	hasPicked,
	onPickedChange,
	onFileCropped,
}: ImageUploadCropperProps) {
	const isCircle = shape === "circle";
	// The dropzone renders its own chrome around plain text, so a rich node has
	// no slot to go in and the dropzone falls back to its built-in copy.
	const dropzoneLabel = typeof label === "string" ? label : undefined;
	const dropzoneDescription =
		typeof description === "string" ? description : undefined;
	return (
		<ImageCropper
			aspectRatio={aspectRatio}
			disabled={isUploading}
			onImageChange={(file) => onPickedChange(file !== null)}
		>
			<ImageCropperDropzone
				label={dropzoneLabel}
				description={dropzoneDescription}
				className={isCircle ? "mx-auto size-40 rounded-full" : undefined}
			/>
			<ImageCropperArea shape={isCircle ? "circle" : "rectangle"} />
			{isUploading ? (
				<Progress value={null} data-slot="image-upload-field-progress" />
			) : null}
			<CropControls
				hasPicked={hasPicked}
				isUploading={isUploading}
				cancelLabel={cancelLabel}
				confirmLabel={confirmLabel}
				outputSize={outputSize}
				onCropped={onFileCropped}
			/>
		</ImageCropper>
	);
}

/** The "edit" state: the crop flow, plus the way back to an existing image. */
function ImageUploadFieldEditor({
	cropper,
	canCancel,
	onCancel,
	className,
	...props
}: React.ComponentProps<"div"> & {
	cropper: ImageUploadCropperProps;
	/** Show the escape hatch back to the existing image (only when one exists). */
	canCancel: boolean;
	onCancel: () => void;
}) {
	return (
		<div
			data-slot="image-upload-field"
			data-shape={cropper.shape}
			data-state="edit"
			className={cn("flex w-full flex-col gap-3", className)}
			{...props}
		>
			<ImageUploadCropper {...cropper} />
			{canCancel ? (
				<Button
					type="button"
					variant="ghost"
					size="sm"
					disabled={cropper.isUploading}
					onClick={onCancel}
				>
					{cropper.cancelLabel}
				</Button>
			) : null}
		</div>
	);
}

/**
 * Controlled presentational bridge over <ImageCropper> for avatar / cover
 * uploads. It is deliberately network-free: it surfaces the cropped `Blob`
 * through `onFileCropped` and the parent owns the actual upload, passing back
 * the resulting URL as `value` and toggling `isUploading`.
 *
 * Two states:
 * - "view": there is a `value` and no edit in progress — shows the current
 *   image with Replace / Remove.
 * - "edit": the dropzone → crop → confirm flow.
 */
function ImageUploadField({
	value,
	aspectRatio = 1,
	shape = "circle",
	isUploading = false,
	outputSize,
	onFileCropped,
	onRemove,
	label = "Upload an image",
	description = "Click to browse or drag and drop",
	replaceLabel = "Replace",
	removeLabel = "Remove",
	cancelLabel = "Cancel",
	confirmLabel = "Save",
	className,
	...props
}: Omit<React.ComponentProps<"div">, "onChange"> & {
	/** Current image URL, or null/undefined when nothing is set yet. */
	value?: string | null;
	/** Crop aspect ratio: 1 for avatars, 3 for covers. */
	aspectRatio?: number;
	shape?: ImageUploadShape;
	/** While `true`, the confirm button spins and a Progress bar shows. */
	isUploading?: boolean;
	/**
	 * Fixed output dimensions for the cropped image (e.g. a 512×512 avatar).
	 * Defaults to the cropped region's natural size.
	 */
	outputSize?: { readonly width: number; readonly height: number };
	/** Fired with the cropped Blob once the user confirms — parent uploads it. */
	onFileCropped: (blob: Blob) => void;
	onRemove?: () => void;
	label?: React.ReactNode;
	description?: React.ReactNode;
	replaceLabel?: React.ReactNode;
	removeLabel?: React.ReactNode;
	cancelLabel?: string;
	confirmLabel?: string;
}) {
	const hasValue = value !== null && value !== undefined && value !== "";
	// Start in "view" when there's already an image; otherwise show the cropper.
	const [mode, setMode] = React.useState<"view" | "edit">(
		hasValue ? "view" : "edit",
	);
	const [hasPicked, setHasPicked] = React.useState(false);

	// If the parent finishes an upload (value appears) while we're editing,
	// return to the view state and clear the picked flag.
	const previousValueRef = React.useRef(value);
	React.useEffect(() => {
		if (value !== previousValueRef.current) {
			previousValueRef.current = value;
			if (value) {
				setMode("view");
				setHasPicked(false);
			}
		}
	}, [value]);

	if (hasValue && mode === "view") {
		return (
			<ImageUploadFieldView
				value={value}
				shape={shape}
				aspectRatio={aspectRatio}
				isUploading={isUploading}
				replaceLabel={replaceLabel}
				removeLabel={removeLabel}
				onReplace={() => {
					setHasPicked(false);
					setMode("edit");
				}}
				onRemove={onRemove}
				className={className}
				{...props}
			/>
		);
	}

	return (
		<ImageUploadFieldEditor
			cropper={{
				shape,
				aspectRatio,
				isUploading,
				label,
				description,
				cancelLabel,
				confirmLabel,
				outputSize,
				hasPicked,
				onPickedChange: setHasPicked,
				onFileCropped,
			}}
			canCancel={hasValue && !hasPicked}
			onCancel={() => setMode("view")}
			className={className}
			{...props}
		/>
	);
}

export { ImageUploadField, type ImageUploadShape };
