import { TestimonialAuthor } from "#/components/testimonial-grid/author.tsx";
import { TestimonialAuthorName } from "#/components/testimonial-grid/author-name.tsx";
import { TestimonialAuthorRole } from "#/components/testimonial-grid/author-role.tsx";
import { TestimonialAvatar } from "#/components/testimonial-grid/avatar.tsx";
import { TestimonialFooter } from "#/components/testimonial-grid/footer.tsx";
import { TestimonialItem } from "#/components/testimonial-grid/item.tsx";
import { TestimonialQuote } from "#/components/testimonial-grid/quote.tsx";
import { TestimonialQuoteIcon } from "#/components/testimonial-grid/quote-icon.tsx";
import { TestimonialRating } from "#/components/testimonial-grid/rating.tsx";
import { TestimonialGridRoot } from "#/components/testimonial-grid/root.tsx";

/**
 * Compose: `Root > Item > QuoteIcon + Quote + Footer (Avatar + Author >
 * AuthorName/AuthorRole + Rating)`.
 */
export const TestimonialGrid = {
	Root: TestimonialGridRoot,
	Item: TestimonialItem,
	QuoteIcon: TestimonialQuoteIcon,
	Quote: TestimonialQuote,
	Footer: TestimonialFooter,
	Avatar: TestimonialAvatar,
	Author: TestimonialAuthor,
	AuthorName: TestimonialAuthorName,
	AuthorRole: TestimonialAuthorRole,
	Rating: TestimonialRating,
};
