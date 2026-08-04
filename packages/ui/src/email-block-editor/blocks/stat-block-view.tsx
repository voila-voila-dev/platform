import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockTextInput } from "#/email-block-editor/blocks/block-text-input.tsx";
import {
	useEmailEditorLabels,
	useEmailEditorTheme,
} from "#/email-block-editor/context/email-editor-context.tsx";
import type {
	EmailEditorAlignment,
	EmailEditorStatBlock,
} from "#/email-block-editor/document/types.ts";

const TEXT_ALIGN: {
	readonly [A in EmailEditorAlignment]: "left" | "center" | "right";
} = { left: "left", center: "center", right: "right" };

interface Props extends EmailBlockComponentProps<EmailEditorStatBlock> {}

/**
 * One figure with its caption. A row of three is a three-column grid of stat
 * blocks — the block never invents its own multi-column layout (§1.5 of the
 * editor plan). Every field is edited in place.
 */
export function StatBlockView({ block, selected, onChange }: Props) {
	const theme = useEmailEditorTheme();
	const { fields, blocks } = useEmailEditorLabels();
	const textAlign = TEXT_ALIGN[block.align];
	return (
		<div
			className="flex flex-col gap-1"
			style={{ textAlign, fontFamily: theme.font }}
		>
			<BlockTextInput
				ariaLabel={fields.value}
				value={block.value}
				placeholder={blocks.stat.valuePlaceholder}
				onChange={(value) => onChange({ ...block, value })}
				className="font-bold text-[30px] leading-[1.1]"
				style={{ color: theme.color.brand, textAlign }}
			/>
			<BlockTextInput
				ariaLabel={fields.label}
				value={block.label}
				placeholder={blocks.stat.labelPlaceholder}
				onChange={(label) => onChange({ ...block, label })}
				className="font-semibold text-[12px] uppercase leading-[1.4] tracking-[0.04em]"
				style={{ color: theme.color.muted, textAlign }}
			/>
			{/* The description is optional, so an empty one only takes up room
			    while the block is selected — otherwise the canvas would show a
			    line the email will not have. */}
			{selected || block.description !== "" ? (
				<BlockTextInput
					ariaLabel={fields.description}
					value={block.description}
					placeholder={blocks.stat.descriptionPlaceholder}
					onChange={(description) => onChange({ ...block, description })}
					className="text-[14px] leading-[1.5]"
					style={{ color: theme.color.ink, textAlign }}
				/>
			) : null}
		</div>
	);
}
