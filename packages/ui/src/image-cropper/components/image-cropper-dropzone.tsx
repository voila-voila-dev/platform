import { UploadSimpleIcon } from "@phosphor-icons/react";
import * as React from "react";
import { useImageCropperContext } from "#/image-cropper/context/image-cropper-context.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	label?: string;
	description?: string;
}

export function ImageCropperDropzone({
	label = "Choose an image",
	description = "Click to browse or drag and drop",
	className,
	/** Replaces the default icon + label content entirely. */
	children,
	...props
}: Props) {
	const { aspectRatio, disabled, imageSource, openFilePicker, selectFile } =
		useImageCropperContext("ImageCropper.Dropzone");
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
			{...props}
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
