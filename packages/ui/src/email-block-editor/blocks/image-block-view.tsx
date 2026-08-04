import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { ImageDropZone } from "#/email-block-editor/blocks/image-drop-zone.tsx";
import { PlayOverlay } from "#/email-block-editor/blocks/play-overlay.tsx";
import { useEmailEditorTheme } from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorImageBlock } from "#/email-block-editor/document/types.ts";

interface Props extends EmailBlockComponentProps<EmailEditorImageBlock> {}

/**
 * A content image. Without a source it renders a dashed drop zone that opens a
 * file picker; the actual upload is delegated to the host through
 * `onUploadImage` (the admin wires its ticketed upload). Mirrors the domain
 * `emailImage` component (width, radius and play overlay all follow the
 * block's options).
 */
export function ImageBlockView({ block, onChange, onUploadImage }: Props) {
	const theme = useEmailEditorTheme();
	if (block.src !== "") {
		return (
			<div
				className="relative mx-auto"
				style={{
					width: `${theme.imageWidthRatio[block.width] * 100}%`,
				}}
			>
				<img
					src={block.src}
					alt={block.alt}
					className={block.rounded ? "block w-full rounded-lg" : "block w-full"}
				/>
				{block.overlay === "play" ? <PlayOverlay /> : null}
			</div>
		);
	}

	return (
		<ImageDropZone
			onUploadImage={onUploadImage}
			onUploaded={(src) => onChange({ ...block, src })}
		/>
	);
}
