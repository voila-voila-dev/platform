import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockTextInput } from "#/email-block-editor/blocks/block-text-input.tsx";
import { useEmailEditorTheme } from "#/email-block-editor/context/email-editor-context.tsx";
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
	const textAlign = TEXT_ALIGN[block.align];
	return (
		<div
			className="flex flex-col gap-1"
			style={{ textAlign, fontFamily: theme.font }}
		>
			<BlockTextInput
				ariaLabel="Value"
				value={block.value}
				placeholder="128"
				onChange={(value) => onChange({ ...block, value })}
				className="font-bold text-[30px] leading-[1.1]"
				style={{ color: theme.color.brand, textAlign }}
			/>
			<BlockTextInput
				ariaLabel="Label"
				value={block.label}
				placeholder="Projects delivered"
				onChange={(label) => onChange({ ...block, label })}
				className="font-semibold text-[12px] uppercase leading-[1.4] tracking-[0.04em]"
				style={{ color: theme.color.muted, textAlign }}
			/>
			{/* The description is optional, so an empty one only takes up room
			    while the block is selected — otherwise the canvas would show a
			    line the email will not have. */}
			{selected || block.description !== "" ? (
				<BlockTextInput
					ariaLabel="Description"
					value={block.description}
					placeholder="Description (optional)"
					onChange={(description) => onChange({ ...block, description })}
					className="text-[14px] leading-[1.5]"
					style={{ color: theme.color.ink, textAlign }}
				/>
			) : null}
		</div>
	);
}
