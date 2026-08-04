import { ImageIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import {
	useEmailEditorLabels,
	useEmailEditorTheme,
} from "#/email-block-editor/context/email-editor-context.tsx";

interface Props {
	onUploadImage?: (file: File) => Promise<string>;
	onUploaded: (src: string) => void;
}

/** The empty state: a dashed zone that opens the file picker. The upload
 * itself is the host's job, so without `onUploadImage` it is simply inert. */
export function ImageDropZone({ onUploadImage, onUploaded }: Props) {
	const theme = useEmailEditorTheme();
	const { fields } = useEmailEditorLabels();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);

	const upload = async (file: File) => {
		if (!onUploadImage) {
			return;
		}
		setUploading(true);
		try {
			onUploaded(await onUploadImage(file));
		} finally {
			setUploading(false);
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={() => fileInputRef.current?.click()}
				disabled={onUploadImage === undefined || uploading}
				className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-10 text-[14px] disabled:cursor-not-allowed"
				style={{
					borderColor: theme.color.muted,
					color: theme.color.muted,
					fontFamily: theme.font,
				}}
			>
				<ImageIcon size={24} aria-hidden />
				{uploading ? fields.uploading : fields.addImage}
			</button>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(event) => {
					const file = event.target.files?.[0];
					if (file) {
						void upload(file);
					}
					event.target.value = "";
				}}
			/>
		</>
	);
}
