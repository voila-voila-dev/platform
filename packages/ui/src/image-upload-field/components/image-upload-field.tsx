import * as React from "react";
import { ImageUploadFieldEditor } from "#/image-upload-field/components/image-upload-field-editor.tsx";
import { ImageUploadFieldView } from "#/image-upload-field/components/image-upload-field-view.tsx";
import type { ImageUploadShape } from "#/image-upload-field/lib/image-upload-field-types.ts";

interface Props extends Omit<React.ComponentProps<"div">, "onChange"> {
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
}

/**
 * Controlled presentational bridge over <ImageCropper.Root> for avatar / cover
 * uploads. It is deliberately network-free: it surfaces the cropped `Blob`
 * through `onFileCropped` and the parent owns the actual upload, passing back
 * the resulting URL as `value` and toggling `isUploading`.
 *
 * Two states:
 * - "view": there is a `value` and no edit in progress — shows the current
 *   image with Replace / Remove.
 * - "edit": the dropzone → crop → confirm flow.
 */
export function ImageUploadField({
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
}: Props) {
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

export type { ImageUploadShape } from "#/image-upload-field/lib/image-upload-field-types.ts";
