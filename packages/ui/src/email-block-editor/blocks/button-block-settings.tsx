import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { AlignmentOption } from "#/email-block-editor/components/block-options/alignment-option.tsx";
import { BlockOptionSection } from "#/email-block-editor/components/block-options/block-option-section.tsx";
import { LinkOption } from "#/email-block-editor/components/block-options/link-option.tsx";
import { SelectOption } from "#/email-block-editor/components/block-options/select-option.tsx";
import { TextOption } from "#/email-block-editor/components/block-options/text-option.tsx";
import type {
	EmailEditorButtonBlock,
	EmailEditorButtonVariant,
} from "#/email-block-editor/document/types.ts";

const VARIANT_OPTIONS: ReadonlyArray<{
	readonly value: EmailEditorButtonVariant;
	readonly label: string;
}> = [
	{ value: "primary", label: "Filled (brand color)" },
	{ value: "secondary", label: "Outline" },
];

interface Props extends EmailBlockComponentProps<EmailEditorButtonBlock> {}

/** The settings panel for a button block. */
export function ButtonBlockSettings({ block, onChange }: Props) {
	return (
		<>
			<BlockOptionSection title="Content">
				<TextOption
					label="Label"
					value={block.label}
					onChange={(label) => onChange({ ...block, label })}
				/>
			</BlockOptionSection>
			<BlockOptionSection title="Appearance">
				<AlignmentOption
					value={block.align}
					onChange={(align) => onChange({ ...block, align })}
				/>
				<SelectOption
					label="Style"
					value={block.variant}
					options={VARIANT_OPTIONS}
					onChange={(variant) => onChange({ ...block, variant })}
					description={
						block.variant === "secondary"
							? "Outlook (Word engine) ignores rounded corners: the outline will have square corners there."
							: undefined
					}
				/>
			</BlockOptionSection>
			<BlockOptionSection title="Link">
				<LinkOption
					value={block.href}
					onChange={(href) => onChange({ ...block, href })}
				/>
			</BlockOptionSection>
		</>
	);
}
