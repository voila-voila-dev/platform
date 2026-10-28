import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { ImageUploadCropper } from "#/image-upload-field/components/image-upload-cropper.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	cropper: React.ComponentProps<typeof ImageUploadCropper>;
	/** Show the escape hatch back to the existing image (only when one exists). */
	canCancel: boolean;
	onCancel: () => void;
}

/** The "edit" state: the crop flow, plus the way back to an existing image. */
export function ImageUploadFieldEditor({
	cropper,
	canCancel,
	onCancel,
	className,
	...props
}: Props) {
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
