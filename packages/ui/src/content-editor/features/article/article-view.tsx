import { EmailCardMeta } from "#/content-editor/components/email-card/email-card-meta.tsx";
import { EmailCardShell } from "#/content-editor/components/email-card/email-card-shell.tsx";
import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";
import { useContentEditorTheme } from "#/content-editor/context/theme-context.ts";
import {
	articleMeta,
	type ContentArticleNode,
} from "#/content-editor/features/article/reader.tsx";

/**
 * The email block editor's article card, as a preview: the title and the
 * summary are edited in the inspector, so an empty one shows its
 * placeholder the way the old in-place input did.
 */
export function ArticleView({ node }: { readonly node: ContentArticleNode }) {
	const theme = useContentEditorTheme();
	const { fields } = useContentEditorLabels();
	const meta = articleMeta(node, theme.locale);
	return (
		<EmailCardShell image={node.image}>
			<div
				className="font-bold text-[17px] leading-[1.3]"
				style={{ color: theme.color.brand }}
			>
				{node.title || (
					<span className="opacity-40">{fields.articleTitlePlaceholder}</span>
				)}
			</div>
			{meta === "" ? null : <EmailCardMeta>{meta}</EmailCardMeta>}
			<p
				className="whitespace-pre-line text-[15px] leading-[1.5]"
				style={{ color: theme.color.ink }}
			>
				{node.description || (
					<span className="opacity-40">
						{fields.articleDescriptionPlaceholder}
					</span>
				)}
			</p>
		</EmailCardShell>
	);
}
