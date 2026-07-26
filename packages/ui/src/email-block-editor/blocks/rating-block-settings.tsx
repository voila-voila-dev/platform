import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockOptionSection } from "#/email-block-editor/components/block-options/block-option-section.tsx";
import { LinkOption } from "#/email-block-editor/components/block-options/link-option.tsx";
import { SelectOption } from "#/email-block-editor/components/block-options/select-option.tsx";
import { TextOption } from "#/email-block-editor/components/block-options/text-option.tsx";
import type {
	EmailEditorRatingBlock,
	EmailEditorRatingStyle,
} from "#/email-block-editor/document/types.ts";

const STYLE_OPTIONS: ReadonlyArray<{
	readonly value: EmailEditorRatingStyle;
	readonly label: string;
}> = [
	{ value: "filled", label: "Filled stars" },
	{ value: "outline", label: "Outlined stars" },
];

interface Props extends EmailBlockComponentProps<EmailEditorRatingBlock> {}

/** The settings panel for a rating block. */
export function RatingBlockSettings({ block, onChange }: Props) {
	return (
		<>
			<BlockOptionSection title="Content">
				<p className="text-muted-foreground text-xs">
					The question is typed and formatted directly on the block, like a
					paragraph.
				</p>
				<TextOption
					label="Low end of the scale"
					value={block.lowLabel}
					onChange={(lowLabel) => onChange({ ...block, lowLabel })}
					placeholder="Not at all"
				/>
				<TextOption
					label="High end of the scale"
					value={block.highLabel}
					onChange={(highLabel) => onChange({ ...block, highLabel })}
					placeholder="Absolutely"
				/>
			</BlockOptionSection>
			<BlockOptionSection title="Appearance">
				<SelectOption
					label="Style"
					value={block.style}
					options={STYLE_OPTIONS}
					onChange={(style) => onChange({ ...block, style })}
				/>
			</BlockOptionSection>
			<BlockOptionSection title="Link">
				<LinkOption
					value={block.href}
					onChange={(href) => onChange({ ...block, href })}
					description="Each star points to this address with rating=1 through rating=5 appended: the five scores are therefore counted separately in the click statistics."
				/>
			</BlockOptionSection>
		</>
	);
}
