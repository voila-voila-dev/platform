import { ArticleCardArrow } from "#/components/article-card/arrow.tsx";
import { ArticleCardContent } from "#/components/article-card/content.tsx";
import { ArticleCardDescription } from "#/components/article-card/description.tsx";
import { ArticleCardFrame } from "#/components/article-card/frame.tsx";
import { ArticleCardImage } from "#/components/article-card/image.tsx";
import { ArticleCardImageFallback } from "#/components/article-card/image-fallback.tsx";
import { ArticleCardMeta } from "#/components/article-card/meta.tsx";
import { ArticleCardMetaItem } from "#/components/article-card/meta-item.tsx";
import { ArticleCardMetaItems } from "#/components/article-card/meta-items.tsx";
import { ArticleCardRoot } from "#/components/article-card/root.tsx";
import { ArticleCardTags } from "#/components/article-card/tags.tsx";
import { ArticleCardTitle } from "#/components/article-card/title.tsx";

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
