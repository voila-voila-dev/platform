import { NewspaperIcon } from "@phosphor-icons/react";
import { ArticleView } from "#/content-editor/features/article/article-view.tsx";
import {
	ARTICLE_DEFAULTS,
	articleNode,
	type ContentArticleNode,
} from "#/content-editor/features/article/reader.tsx";
import { defineElementFeature } from "#/content-editor/lib/define-element-feature.ts";

export const articleFeature = defineElementFeature<ContentArticleNode>({
	key: "article",
	kind: "void",
	node: articleNode,
	fields: [
		{ type: "text", key: "title", label: "articleTitle" },
		{
			type: "text",
			key: "description",
			label: "articleDescription",
			multiline: true,
		},
		{ type: "image", key: "image", label: "articleImage", withAlt: true },
		{ type: "text", key: "author", label: "articleAuthor" },
		{
			type: "text",
			key: "publishDate",
			label: "articlePublishDate",
			placeholder: "articlePublishDatePlaceholder",
			description: "articlePublishDateDescription",
		},
		{
			type: "url",
			key: "href",
			label: "articleHref",
			description: "articleHrefDescription",
		},
	],
	defaults: ARTICLE_DEFAULTS,
	view: ArticleView,
	insert: {
		icon: NewspaperIcon,
		keywords: ["article", "post", "blog", "card", "read"],
	},
});
