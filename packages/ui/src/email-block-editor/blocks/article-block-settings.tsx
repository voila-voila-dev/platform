import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockOptionSection } from "#/email-block-editor/components/block-options/block-option-section.tsx";
import { LinkOption } from "#/email-block-editor/components/block-options/link-option.tsx";
import { TextAreaOption } from "#/email-block-editor/components/block-options/text-area-option.tsx";
import { TextOption } from "#/email-block-editor/components/block-options/text-option.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorArticleBlock } from "#/email-block-editor/document/types.ts";

interface Props extends EmailBlockComponentProps<EmailEditorArticleBlock> {}

/** The settings panel for an article block. */
export function ArticleBlockSettings({ block, onChange }: Props) {
	const { chrome, fields, blocks } = useEmailEditorLabels();
	return (
		<>
			<BlockOptionSection title={chrome.sectionContent}>
				<TextOption
					label={fields.title}
					value={block.title}
					onChange={(title) => onChange({ ...block, title })}
				/>
				<TextAreaOption
					label={fields.summary}
					value={block.description}
					onChange={(description) => onChange({ ...block, description })}
				/>
				<TextOption
					label={fields.author}
					value={block.author}
					onChange={(author) => onChange({ ...block, author })}
				/>
				<TextOption
					label={blocks.article.publishDate}
					value={block.publishDate}
					onChange={(publishDate) => onChange({ ...block, publishDate })}
					placeholder={blocks.article.publishDatePlaceholder}
					description={blocks.article.publishDateDescription}
				/>
			</BlockOptionSection>
			<BlockOptionSection title={chrome.sectionAppearance}>
				<TextOption
					label={fields.imageUrl}
					value={block.image.src}
					onChange={(src) =>
						onChange({ ...block, image: { ...block.image, src } })
					}
					placeholder={fields.urlPlaceholder}
				/>
				<TextOption
					label={fields.altText}
					value={block.image.alt}
					onChange={(alt) =>
						onChange({ ...block, image: { ...block.image, alt } })
					}
				/>
			</BlockOptionSection>
			<BlockOptionSection title={chrome.sectionLink}>
				<LinkOption
					value={block.href}
					onChange={(href) => onChange({ ...block, href })}
					description={blocks.article.linkDescription}
				/>
			</BlockOptionSection>
		</>
	);
}
