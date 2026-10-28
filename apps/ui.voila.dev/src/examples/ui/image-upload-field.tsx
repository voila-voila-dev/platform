import { ImageUploadField } from "@voila.dev/ui/image-upload-field";

export function Default() {
	return (
		<ImageUploadField
			className="w-full max-w-sm"
			value="https://github.com/shadcn.png"
			onFileCropped={() => {}}
			onRemove={() => {}}
		/>
	);
}
