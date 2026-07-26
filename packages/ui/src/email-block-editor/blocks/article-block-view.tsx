import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockTextInput } from "#/email-block-editor/blocks/block-text-input.tsx";
import { EmailCardMeta } from "#/email-block-editor/blocks/email-card-meta.tsx";
import { EmailCardShell } from "#/email-block-editor/blocks/email-card-shell.tsx";
import type { EmailEditorArticleBlock } from "#/email-block-editor/document/types.ts";
import { EMAIL_COLOR } from "#/email-block-editor/theme.ts";

/** The author/date line, with a separator only when both are present. */
const metaLine = (block: EmailEditorArticleBlock): string =>
	[block.author, block.publishDate].filter((part) => part !== "").join(" · ");

interface Props extends EmailBlockComponentProps<EmailEditorArticleBlock> {}

/**
 * A blog post or an external resource, on the shared card shell. Field names
 * follow the real blog model, so a digest built from published posts maps
 * straight across. The title and description are edited in place; the image,
 * the byline and the link live in the settings.
 */
export function ArticleBlockView({ block, onChange }: Props) {
	const meta = metaLine(block);
	return (
		<EmailCardShell image={block.image}>
			<BlockTextInput
				ariaLabel="Article title"
				value={block.title}
				placeholder="Article title"
				onChange={(title) => onChange({ ...block, title })}
				className="font-bold text-[17px] leading-[1.3]"
				style={{ color: EMAIL_COLOR.brand }}
			/>
			{meta === "" ? null : <EmailCardMeta>{meta}</EmailCardMeta>}
			<textarea
				aria-label="Article summary"
				value={block.description}
				placeholder="The article summary."
				rows={2}
				onChange={(event) =>
					onChange({ ...block, description: event.target.value })
				}
				className="w-full resize-none border-none bg-transparent p-0 text-[15px] leading-[1.5] outline-none [field-sizing:content] placeholder:opacity-40"
				style={{ color: EMAIL_COLOR.ink }}
			/>
		</EmailCardShell>
	);
}
