import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { useImageCropper } from "#/image-cropper/context/image-cropper-context.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	hasPicked: boolean;
	isUploading: boolean;
	cancelLabel: string;
	confirmLabel: string;
	outputSize?: { readonly width: number; readonly height: number };
	onCropped: (blob: Blob) => void;
}

/**
 * Confirm / cancel controls for an active crop. Rendered inside
 * <ImageCropper.Root> so it can reach `cropToBlob`; shown only once a file is
 * picked. On confirm it produces a Blob and hands it to the parent — this
 * component never performs the network upload itself.
 */
export function ImageUploadFieldCropControls({
	hasPicked,
	isUploading,
	cancelLabel,
	confirmLabel,
	outputSize,
	onCropped,
	className,
	...props
}: Props) {
	const { cropToBlob, removeImage } = useImageCropper();
	if (!hasPicked) return null;
	return (
		<div
			data-slot="image-upload-field-crop-controls"
			className={cn("flex gap-2", className)}
			{...props}
		>
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
