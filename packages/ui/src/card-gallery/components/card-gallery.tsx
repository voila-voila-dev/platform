import { CardGalleryDescription } from "#/card-gallery/components/card-gallery-description.tsx";
import { CardGalleryItem } from "#/card-gallery/components/card-gallery-item.tsx";
import { CardGalleryLogo } from "#/card-gallery/components/card-gallery-logo.tsx";
import { CardGalleryRoot } from "#/card-gallery/components/card-gallery-root.tsx";
import { CardGalleryTitle } from "#/card-gallery/components/card-gallery-title.tsx";

/**
 * The CardGallery parts as one namespace.
 */
export const CardGallery = {
	Root: CardGalleryRoot,
	Description: CardGalleryDescription,
	Item: CardGalleryItem,
	Logo: CardGalleryLogo,
	Title: CardGalleryTitle,
};
