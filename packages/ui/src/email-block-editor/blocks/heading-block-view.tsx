import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockTextInput } from "#/email-block-editor/blocks/block-text-input.tsx";
import { useEmailEditorTheme } from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorHeadingBlock } from "#/email-block-editor/document/types.ts";

interface Props extends EmailBlockComponentProps<EmailEditorHeadingBlock> {}

/**
 * A title line, edited in place. Mirrors the domain `emailHeading` component
 * (bold, brand-colored) so the canvas matches the sent email; the level picks
 * between the email's own title and a section heading.
 */
export function HeadingBlockView({ block, onChange }: Props) {
	const theme = useEmailEditorTheme();
	return (
		<BlockTextInput
			ariaLabel="Heading"
			value={block.text}
			onChange={(text) => onChange({ ...block, text })}
			placeholder="Your heading"
			className="font-bold leading-[1.3]"
			style={{
				fontFamily: theme.font,
				color: theme.color.brand,
				fontSize: theme.headingFontSize[block.level],
			}}
		/>
	);
}
