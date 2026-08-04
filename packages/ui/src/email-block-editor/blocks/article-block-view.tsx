import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockTextInput } from "#/email-block-editor/blocks/block-text-input.tsx";
import { EmailCardMeta } from "#/email-block-editor/blocks/email-card-meta.tsx";
import { EmailCardShell } from "#/email-block-editor/blocks/email-card-shell.tsx";
import {
	useEmailEditorLabels,
	useEmailEditorTheme,
} from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorArticleBlock } from "#/email-block-editor/document/types.ts";

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
	const theme = useEmailEditorTheme();
	const { blocks } = useEmailEditorLabels();
	const meta = metaLine(block);
	return (
		<EmailCardShell image={block.image}>
			<BlockTextInput
				ariaLabel={blocks.article.titleAriaLabel}
				value={block.title}
				placeholder={blocks.article.titlePlaceholder}
				onChange={(title) => onChange({ ...block, title })}
				className="font-bold text-[17px] leading-[1.3]"
				style={{ color: theme.color.brand }}
			/>
			{meta === "" ? null : <EmailCardMeta>{meta}</EmailCardMeta>}
			<textarea
				aria-label={blocks.article.summaryAriaLabel}
				value={block.description}
				placeholder={blocks.article.summaryPlaceholder}
				rows={2}
				onChange={(event) =>
					onChange({ ...block, description: event.target.value })
				}
				className="w-full resize-none border-none bg-transparent p-0 text-[15px] leading-[1.5] outline-none [field-sizing:content] placeholder:opacity-40"
				style={{ color: theme.color.ink }}
			/>
		</EmailCardShell>
	);
}
