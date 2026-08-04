import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockOptionSection } from "#/email-block-editor/components/block-options/block-option-section.tsx";
import { LinkOption } from "#/email-block-editor/components/block-options/link-option.tsx";
import { SelectOption } from "#/email-block-editor/components/block-options/select-option.tsx";
import { TextOption } from "#/email-block-editor/components/block-options/text-option.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
import type {
	EmailEditorRatingBlock,
	EmailEditorRatingStyle,
} from "#/email-block-editor/document/types.ts";

interface Props extends EmailBlockComponentProps<EmailEditorRatingBlock> {}

/** The settings panel for a rating block. */
export function RatingBlockSettings({ block, onChange }: Props) {
	const { chrome, fields, blocks } = useEmailEditorLabels();
	const styleOptions: ReadonlyArray<{
		readonly value: EmailEditorRatingStyle;
		readonly label: string;
	}> = [
		{ value: "filled", label: blocks.rating.styleFilled },
		{ value: "outline", label: blocks.rating.styleOutline },
	];
	return (
		<>
			<BlockOptionSection title={chrome.sectionContent}>
				<p className="text-muted-foreground text-xs">
					{blocks.rating.questionHint}
				</p>
				<TextOption
					label={blocks.rating.lowLabel}
					value={block.lowLabel}
					onChange={(lowLabel) => onChange({ ...block, lowLabel })}
					placeholder={blocks.rating.lowPlaceholder}
				/>
				<TextOption
					label={blocks.rating.highLabel}
					value={block.highLabel}
					onChange={(highLabel) => onChange({ ...block, highLabel })}
					placeholder={blocks.rating.highPlaceholder}
				/>
			</BlockOptionSection>
			<BlockOptionSection title={chrome.sectionAppearance}>
				<SelectOption
					label={fields.style}
					value={block.style}
					options={styleOptions}
					onChange={(style) => onChange({ ...block, style })}
				/>
			</BlockOptionSection>
			<BlockOptionSection title={chrome.sectionLink}>
				<LinkOption
					value={block.href}
					onChange={(href) => onChange({ ...block, href })}
					description={blocks.rating.linkDescription}
				/>
			</BlockOptionSection>
		</>
	);
}
