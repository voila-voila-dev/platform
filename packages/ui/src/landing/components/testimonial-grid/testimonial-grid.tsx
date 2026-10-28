import { TestimonialAuthor } from "#/landing/components/testimonial-grid/author.tsx";
import { TestimonialAuthorName } from "#/landing/components/testimonial-grid/author-name.tsx";
import { TestimonialAuthorRole } from "#/landing/components/testimonial-grid/author-role.tsx";
import { TestimonialAvatar } from "#/landing/components/testimonial-grid/avatar.tsx";
import { TestimonialFooter } from "#/landing/components/testimonial-grid/footer.tsx";
import { TestimonialItem } from "#/landing/components/testimonial-grid/item.tsx";
import { TestimonialQuote } from "#/landing/components/testimonial-grid/quote.tsx";
import { TestimonialQuoteIcon } from "#/landing/components/testimonial-grid/quote-icon.tsx";
import { TestimonialRating } from "#/landing/components/testimonial-grid/rating.tsx";
import { TestimonialGridRoot } from "#/landing/components/testimonial-grid/root.tsx";

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
