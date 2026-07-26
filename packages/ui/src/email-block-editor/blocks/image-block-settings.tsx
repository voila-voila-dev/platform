import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { ImageUploadButton } from "#/email-block-editor/blocks/image-upload-button.tsx";
import { BlockOptionSection } from "#/email-block-editor/components/block-options/block-option-section.tsx";
import { LinkOption } from "#/email-block-editor/components/block-options/link-option.tsx";
import { SelectOption } from "#/email-block-editor/components/block-options/select-option.tsx";
import { TextOption } from "#/email-block-editor/components/block-options/text-option.tsx";
import { ToggleOption } from "#/email-block-editor/components/block-options/toggle-option.tsx";
import type {
	EmailEditorImageBlock,
	EmailEditorImageOverlay,
	EmailEditorImageWidth,
} from "#/email-block-editor/document/types.ts";

const WIDTH_OPTIONS: ReadonlyArray<{
	readonly value: EmailEditorImageWidth;
	readonly label: string;
}> = [
	{ value: "full", label: "Full width" },
	{ value: "contained", label: "Reduced width (centered)" },
];
const OVERLAY_OPTIONS: ReadonlyArray<{
	readonly value: EmailEditorImageOverlay;
	readonly label: string;
}> = [
	{ value: "none", label: "None" },
	{ value: "play", label: "Play button (video thumbnail)" },
];

interface Props extends EmailBlockComponentProps<EmailEditorImageBlock> {}

/** The settings panel for an image block. */
export function ImageBlockSettings({ block, onChange, onUploadImage }: Props) {
	return (
		<>
			<BlockOptionSection title="Content">
				<TextOption
					label="Alt text"
					value={block.alt}
					onChange={(alt) => onChange({ ...block, alt })}
					description="Shown when the email client blocks the image."
				/>
				<TextOption
					label="Image URL"
					value={block.src}
					onChange={(src) => onChange({ ...block, src })}
					placeholder="https://"
				/>
				{onUploadImage ? (
					<ImageUploadButton
						block={block}
						onChange={onChange}
						onUploadImage={onUploadImage}
					/>
				) : null}
			</BlockOptionSection>
			<BlockOptionSection title="Appearance">
				<SelectOption
					label="Width"
					value={block.width}
					options={WIDTH_OPTIONS}
					onChange={(width) => onChange({ ...block, width })}
				/>
				<SelectOption
					label="Overlay"
					value={block.overlay}
					options={OVERLAY_OPTIONS}
					onChange={(overlay) => onChange({ ...block, overlay })}
					description={
						block.overlay === "play"
							? "No email client plays an embedded video: the thumbnail links to the URL below. Outlook shows the badge under the image."
							: undefined
					}
				/>
				<ToggleOption
					label="Rounded corners"
					checked={block.rounded}
					onChange={(rounded) => onChange({ ...block, rounded })}
					description="Outlook (Word engine) always renders square corners."
				/>
			</BlockOptionSection>
			<BlockOptionSection title="Link">
				<LinkOption
					value={block.href}
					onChange={(href) => onChange({ ...block, href })}
					description="Leave empty for a non-clickable image."
				/>
			</BlockOptionSection>
		</>
	);
}
