import { ArticleCardArrow } from "#/landing/components/article-card/arrow.tsx";
import { ArticleCardContent } from "#/landing/components/article-card/content.tsx";
import { ArticleCardDescription } from "#/landing/components/article-card/description.tsx";
import { ArticleCardFrame } from "#/landing/components/article-card/frame.tsx";
import { ArticleCardImage } from "#/landing/components/article-card/image.tsx";
import { ArticleCardImageFallback } from "#/landing/components/article-card/image-fallback.tsx";
import { ArticleCardMeta } from "#/landing/components/article-card/meta.tsx";
import { ArticleCardMetaItem } from "#/landing/components/article-card/meta-item.tsx";
import { ArticleCardMetaItems } from "#/landing/components/article-card/meta-items.tsx";
import { ArticleCardRoot } from "#/landing/components/article-card/root.tsx";
import { ArticleCardTags } from "#/landing/components/article-card/tags.tsx";
import { ArticleCardTitle } from "#/landing/components/article-card/title.tsx";

/**
 * Compose: `Root (anchor) > Frame > Image | ImageFallback + Content (Tags,
 * Title, Description, Meta > MetaItem…/Arrow)`.
 */
export const ArticleCard = {
	Root: ArticleCardRoot,
	Frame: ArticleCardFrame,
	Image: ArticleCardImage,
	ImageFallback: ArticleCardImageFallback,
	Content: ArticleCardContent,
	Tags: ArticleCardTags,
	Title: ArticleCardTitle,
	Description: ArticleCardDescription,
	Meta: ArticleCardMeta,
	MetaItems: ArticleCardMetaItems,
	MetaItem: ArticleCardMetaItem,
	Arrow: ArticleCardArrow,
};
