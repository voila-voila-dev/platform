import { NewspaperIcon } from "@phosphor-icons/react";
import { ArticleBlockSettings } from "#/email-block-editor/blocks/article-block-settings.tsx";
import { ArticleBlockView } from "#/email-block-editor/blocks/article-block-view.tsx";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import type { EmailEditorArticleBlock } from "#/email-block-editor/document/types.ts";

export const articleBlockDefinition: EmailBlockDefinition<EmailEditorArticleBlock> =
	{
		label: "Article",
		icon: NewspaperIcon,
		View: ArticleBlockView,
		Settings: ArticleBlockSettings,
	};
