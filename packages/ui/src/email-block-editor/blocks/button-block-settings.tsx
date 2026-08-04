import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { AlignmentOption } from "#/email-block-editor/components/block-options/alignment-option.tsx";
import { BlockOptionSection } from "#/email-block-editor/components/block-options/block-option-section.tsx";
import { LinkOption } from "#/email-block-editor/components/block-options/link-option.tsx";
import { SelectOption } from "#/email-block-editor/components/block-options/select-option.tsx";
import { TextOption } from "#/email-block-editor/components/block-options/text-option.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
import type {
	EmailEditorButtonBlock,
	EmailEditorButtonVariant,
} from "#/email-block-editor/document/types.ts";

interface Props extends EmailBlockComponentProps<EmailEditorButtonBlock> {}

/** The settings panel for a button block. */
export function ButtonBlockSettings({ block, onChange }: Props) {
	const { chrome, fields, blocks } = useEmailEditorLabels();
	const variantOptions: ReadonlyArray<{
		readonly value: EmailEditorButtonVariant;
		readonly label: string;
	}> = [
		{ value: "primary", label: blocks.button.variantPrimary },
		{ value: "secondary", label: blocks.button.variantSecondary },
	];
	return (
		<>
			<BlockOptionSection title={chrome.sectionContent}>
				<TextOption
					label={fields.label}
					value={block.label}
					onChange={(label) => onChange({ ...block, label })}
				/>
			</BlockOptionSection>
			<BlockOptionSection title={chrome.sectionAppearance}>
				<AlignmentOption
					value={block.align}
					onChange={(align) => onChange({ ...block, align })}
				/>
				<SelectOption
					label={fields.style}
					value={block.variant}
					options={variantOptions}
					onChange={(variant) => onChange({ ...block, variant })}
					description={
						block.variant === "secondary"
							? blocks.button.variantSecondaryDescription
							: undefined
					}
				/>
			</BlockOptionSection>
			<BlockOptionSection title={chrome.sectionLink}>
				<LinkOption
					value={block.href}
					onChange={(href) => onChange({ ...block, href })}
				/>
			</BlockOptionSection>
		</>
	);
}
