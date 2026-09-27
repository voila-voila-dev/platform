import { useId, useState } from "react";
import type { FieldControlProps } from "#/content-editor/components/field-controls/field-control-props.ts";
import { UrlFieldControl } from "#/content-editor/components/field-controls/url-field-control.tsx";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import { useFieldText } from "#/content-editor/hooks/use-field-text.ts";
import { Field } from "#/field/components/field.tsx";
import { ImageUploadField } from "#/image-upload-field/components/image-upload-field.tsx";
import { Input } from "#/input/components/input.tsx";

/**
 * The upload goes through the host's `onUploadImage`, cropped first. A host
 * that wired no upload still gets the field, as a url to paste. With
 * `withAlt`, the alternative text sits under it and both go on the node
 * together.
 */
export function ImageFieldControl(props: FieldControlProps<"image">) {
	const { id, field, value, onChange } = props;
	const altId = useId();
	const text = useFieldText();
	if (field.withAlt !== true) {
		return <ImageSource {...props} />;
	}
	const image = typeof value === "string" ? { src: value, alt: "" } : value;
	return (
		<div className="flex flex-col gap-3">
			<ImageSource
				id={id}
				field={field}
				value={image.src}
				onChange={(src) => onChange({ ...image, src: String(src) })}
			/>
			{field.description === undefined ? null : (
				<Field.Description>{text(field.description)}</Field.Description>
			)}
			<Field.Root>
				<Field.Label htmlFor={altId}>{text("alt")}</Field.Label>
				<Input
					id={altId}
					value={image.alt}
					onChange={(event) => onChange({ ...image, alt: event.target.value })}
				/>
				<Field.Description>{text("altDescription")}</Field.Description>
			</Field.Root>
		</div>
	);
}

function ImageSource({
	id,
	field,
	value,
	onChange,
}: FieldControlProps<"image">) {
	const { labels, uploadImage } = useContentEditorConfig();
	const [uploading, setUploading] = useState(false);
	const [failure, setFailure] = useState<string | null>(null);
	const url = typeof value === "string" ? value : value.src;

	if (uploadImage === null) {
		return (
			<UrlFieldControl
				id={id}
				field={{ ...field, type: "url" }}
				value={url}
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
				value={url}
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
