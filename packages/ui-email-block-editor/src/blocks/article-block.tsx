import { NewspaperIcon } from "@phosphor-icons/react";
import type {
	EmailBlockComponentProps,
	EmailBlockDefinition,
} from "#/blocks/block-definitions.tsx";
import { BlockTextInput } from "#/blocks/block-text-input.tsx";
import { EmailCardMeta, EmailCardShell } from "#/blocks/email-card-shell.tsx";
import type { EmailEditorArticleBlock } from "#/document/types.ts";
import { BlockOptionSection } from "#/sections/block-options/block-option-row.tsx";
import {
	LinkOption,
	TextAreaOption,
	TextOption,
} from "#/sections/block-options/text-option.tsx";
import { EMAIL_COLOR } from "#/theme.ts";

/** The author/date line, with a separator only when both are present. */
const metaLine = (block: EmailEditorArticleBlock): string =>
	[block.author, block.publishDate].filter((part) => part !== "").join(" · ");

/**
 * A blog post or an external resource, on the shared card shell. Field names
 * follow the real blog model, so a digest built from published posts maps
 * straight across. The title and description are edited in place; the image,
 * the byline and the link live in the settings.
 */
function ArticleBlockView({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorArticleBlock>) {
	const meta = metaLine(block);
	return (
		<EmailCardShell image={block.image}>
			<BlockTextInput
				ariaLabel="Titre de l'article"
				value={block.title}
				placeholder="Titre de l'article"
				onChange={(title) => onChange({ ...block, title })}
				className="font-bold text-[17px] leading-[1.3]"
				style={{ color: EMAIL_COLOR.brand }}
			/>
			{meta === "" ? null : <EmailCardMeta>{meta}</EmailCardMeta>}
			<textarea
				aria-label="Résumé de l'article"
				value={block.description}
				placeholder="Le résumé de l'article."
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

function ArticleBlockSettings({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorArticleBlock>) {
	return (
		<>
			<BlockOptionSection title="Contenu">
				<TextOption
					label="Titre"
					value={block.title}
					onChange={(title) => onChange({ ...block, title })}
				/>
				<TextAreaOption
					label="Résumé"
					value={block.description}
					onChange={(description) => onChange({ ...block, description })}
				/>
				<TextOption
					label="Auteur"
					value={block.author}
					onChange={(author) => onChange({ ...block, author })}
				/>
				<TextOption
					label="Date de publication"
					value={block.publishDate}
					onChange={(publishDate) => onChange({ ...block, publishDate })}
					placeholder="2026-07-20"
					description="Format AAAA-MM-JJ ; la date est écrite dans la langue du destinataire à l'envoi."
				/>
			</BlockOptionSection>
			<BlockOptionSection title="Apparence">
				<TextOption
					label="Adresse de l'image"
					value={block.image.src}
					onChange={(src) =>
						onChange({ ...block, image: { ...block.image, src } })
					}
					placeholder="https://"
				/>
				<TextOption
					label="Texte alternatif"
					value={block.image.alt}
					onChange={(alt) =>
						onChange({ ...block, image: { ...block.image, alt } })
					}
				/>
			</BlockOptionSection>
			<BlockOptionSection title="Lien">
				<LinkOption
					value={block.href}
					onChange={(href) => onChange({ ...block, href })}
					description="La carte entière renvoie vers cette adresse."
				/>
			</BlockOptionSection>
		</>
	);
}

export const articleBlockDefinition: EmailBlockDefinition<EmailEditorArticleBlock> =
	{
		label: "Article",
		icon: NewspaperIcon,
		View: ArticleBlockView,
		Settings: ArticleBlockSettings,
	};
