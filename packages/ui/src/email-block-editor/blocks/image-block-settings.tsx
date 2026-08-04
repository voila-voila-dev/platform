import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { ImageUploadButton } from "#/email-block-editor/blocks/image-upload-button.tsx";
import { BlockOptionSection } from "#/email-block-editor/components/block-options/block-option-section.tsx";
import { LinkOption } from "#/email-block-editor/components/block-options/link-option.tsx";
import { SelectOption } from "#/email-block-editor/components/block-options/select-option.tsx";
import { TextOption } from "#/email-block-editor/components/block-options/text-option.tsx";
import { ToggleOption } from "#/email-block-editor/components/block-options/toggle-option.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
import type {
	EmailEditorImageBlock,
	EmailEditorImageOverlay,
	EmailEditorImageWidth,
} from "#/email-block-editor/document/types.ts";

interface Props extends EmailBlockComponentProps<EmailEditorImageBlock> {}

/** The settings panel for an image block. */
export function ImageBlockSettings({ block, onChange, onUploadImage }: Props) {
	const { chrome, fields, blocks } = useEmailEditorLabels();
	const widthOptions: ReadonlyArray<{
		readonly value: EmailEditorImageWidth;
		readonly label: string;
	}> = [
		{ value: "full", label: blocks.image.widthFull },
		{ value: "contained", label: blocks.image.widthContained },
	];
	const overlayOptions: ReadonlyArray<{
		readonly value: EmailEditorImageOverlay;
		readonly label: string;
	}> = [
		{ value: "none", label: fields.none },
		{ value: "play", label: blocks.image.overlayPlay },
	];
	return (
		<>
			<BlockOptionSection title={chrome.sectionContent}>
				<TextOption
					label={fields.altText}
					value={block.alt}
					onChange={(alt) => onChange({ ...block, alt })}
					description={fields.altTextDescription}
				/>
				<TextOption
					label={fields.imageUrl}
					value={block.src}
					onChange={(src) => onChange({ ...block, src })}
					placeholder={fields.urlPlaceholder}
				/>
				{onUploadImage ? (
					<ImageUploadButton
						block={block}
						onChange={onChange}
						onUploadImage={onUploadImage}
					/>
				) : null}
			</BlockOptionSection>
			<BlockOptionSection title={chrome.sectionAppearance}>
				<SelectOption
					label={blocks.image.width}
					value={block.width}
					options={widthOptions}
					onChange={(width) => onChange({ ...block, width })}
				/>
				<SelectOption
					label={blocks.image.overlay}
					value={block.overlay}
					options={overlayOptions}
					onChange={(overlay) => onChange({ ...block, overlay })}
					description={
						block.overlay === "play"
							? blocks.image.overlayPlayDescription
							: undefined
					}
				/>
				<ToggleOption
					label={blocks.image.rounded}
					checked={block.rounded}
					onChange={(rounded) => onChange({ ...block, rounded })}
					description={blocks.image.roundedDescription}
				/>
			</BlockOptionSection>
			<BlockOptionSection title={chrome.sectionLink}>
				<LinkOption
					value={block.href}
					onChange={(href) => onChange({ ...block, href })}
					description={blocks.image.linkDescription}
				/>
			</BlockOptionSection>
		</>
	);
}
