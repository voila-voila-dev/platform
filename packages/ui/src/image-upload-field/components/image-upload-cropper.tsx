import type * as React from "react";
import { ImageCropper } from "#/image-cropper/components/image-cropper.tsx";
import { ImageUploadFieldCropControls } from "#/image-upload-field/components/image-upload-field-crop-controls.tsx";
import type { ImageUploadShape } from "#/image-upload-field/lib/image-upload-field-types.ts";
import { Progress } from "#/progress/components/progress.tsx";

interface Props extends React.ComponentProps<typeof ImageCropper.Root> {
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
}

/** The dropzone → crop → confirm flow itself, minus the surrounding chrome. */
export function ImageUploadCropper({
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
	...props
}: Props) {
	const isCircle = shape === "circle";
	// The dropzone renders its own chrome around plain text, so a rich node has
	// no slot to go in and the dropzone falls back to its built-in copy.
	const dropzoneLabel = typeof label === "string" ? label : undefined;
	const dropzoneDescription =
		typeof description === "string" ? description : undefined;
	return (
		<ImageCropper.Root
			aspectRatio={aspectRatio}
			disabled={isUploading}
			onImageChange={(file) => onPickedChange(file !== null)}
			{...props}
		>
			<ImageCropper.Dropzone
				label={dropzoneLabel}
				description={dropzoneDescription}
				className={isCircle ? "mx-auto size-40 rounded-full" : undefined}
			/>
			<ImageCropper.Area shape={isCircle ? "circle" : "rectangle"} />
			{isUploading ? (
				<Progress.Root value={null} data-slot="image-upload-field-progress" />
			) : null}
			<ImageUploadFieldCropControls
				hasPicked={hasPicked}
				isUploading={isUploading}
				cancelLabel={cancelLabel}
				confirmLabel={confirmLabel}
				outputSize={outputSize}
				onCropped={onFileCropped}
			/>
		</ImageCropper.Root>
	);
}
