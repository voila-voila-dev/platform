import { useState } from "react";
import type { FieldControlProps } from "#/content-editor/components/field-controls/field-control-props.ts";
import { UrlFieldControl } from "#/content-editor/components/field-controls/url-field-control.tsx";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import { ImageUploadField } from "#/image-upload-field/components/image-upload-field.tsx";

/**
 * The upload goes through the host's `onUploadImage`, cropped first. A host
 * that wired no upload still gets the field, as a url to paste.
 */
export function ImageFieldControl({
	id,
	field,
	value,
	onChange,
}: FieldControlProps<"image">) {
	const { labels, uploadImage } = useContentEditorConfig();
	const [uploading, setUploading] = useState(false);
	const [failure, setFailure] = useState<string | null>(null);

	if (uploadImage === null) {
		return (
			<UrlFieldControl
				id={id}
				field={{ ...field, type: "url" }}
				value={value}
				onChange={onChange}
			/>
		);
	}

	const upload = async (blob: Blob) => {
		setFailure(null);
		setUploading(true);
		try {
			const file = new File([blob], "image", { type: blob.type });
			onChange((await uploadImage(file)).url);
		} catch (error) {
			setFailure(error instanceof Error ? error.message : String(error));
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="flex flex-col gap-1.5">
			<ImageUploadField
				id={id}
				value={value}
				shape="rectangle"
				aspectRatio={field.aspectRatio ?? 16 / 9}
				isUploading={uploading}
				onFileCropped={(blob) => void upload(blob)}
				onRemove={() => onChange("")}
				label={labels.chrome.pickImage}
				description={labels.chrome.dropToUpload}
				replaceLabel={labels.chrome.replace}
				removeLabel={labels.chrome.remove}
				cancelLabel={labels.chrome.cancel}
				confirmLabel={labels.chrome.apply}
			/>
			{failure === null ? null : (
				<p className="text-destructive text-xs">
					{labels.chrome.uploadFailed(failure)}
				</p>
			)}
		</div>
	);
}
