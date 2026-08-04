import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockTextInput } from "#/email-block-editor/blocks/block-text-input.tsx";
import { useEmailEditorTheme } from "#/email-block-editor/context/email-editor-context.tsx";
import type {
	EmailEditorAlignment,
	EmailEditorHighlightBlock,
} from "#/email-block-editor/document/types.ts";

const TEXT_ALIGN: {
	readonly [A in EmailEditorAlignment]: "left" | "center" | "right";
} = { left: "left", center: "center", right: "right" };

interface Props extends EmailBlockComponentProps<EmailEditorHighlightBlock> {}

/**
 * One bold sentence on a brand-tinted panel — the line the reader should walk
 * away with. Deliberately single-styled: no rich text, because everything in
 * it is meant to be loud.
 */
export function HighlightBlockView({ block, onChange }: Props) {
	const theme = useEmailEditorTheme();
	const textAlign = TEXT_ALIGN[block.align];
	return (
		<div
			className="rounded-[10px] px-6 py-4"
			style={{
				backgroundColor: `color-mix(in srgb, ${theme.color.brand} 8%, transparent)`,
			}}
		>
			<BlockTextInput
				ariaLabel="Highlight"
				value={block.text}
				placeholder="10% off everything with the code LAUNCH10"
				onChange={(text) => onChange({ ...block, text })}
				className="font-bold text-[20px] leading-[1.35]"
				style={{ color: theme.color.brand, fontFamily: theme.font, textAlign }}
			/>
		</div>
	);
}
