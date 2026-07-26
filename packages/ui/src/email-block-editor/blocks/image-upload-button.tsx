import { UploadSimpleIcon } from "@phosphor-icons/react";
import { useRef } from "react";
import { Button } from "#/button/components/button.tsx";
import type { EmailEditorImageBlock } from "#/email-block-editor/document/types.ts";

interface Props {
	block: EmailEditorImageBlock;
	onChange: (block: EmailEditorImageBlock) => void;
	onUploadImage: (file: File) => Promise<string>;
}

/** Replaces the block's image from a file the author picks. */
export function ImageUploadButton({ block, onChange, onUploadImage }: Props) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	return (
		<>
			<Button
				variant="outline"
				size="sm"
				onClick={() => fileInputRef.current?.click()}
			>
				<UploadSimpleIcon aria-hidden />
				{block.src === "" ? "Upload an image" : "Replace the image"}
			</Button>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(event) => {
					const file = event.target.files?.[0];
					if (file) {
						void onUploadImage(file).then((src) => onChange({ ...block, src }));
					}
					event.target.value = "";
				}}
			/>
		</>
	);
}
