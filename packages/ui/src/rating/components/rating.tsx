import { RatingInput } from "#/rating/components/rating-input.tsx";
import { RatingRoot } from "#/rating/components/rating-root.tsx";
import { ReviewItem } from "#/rating/components/review-item.tsx";

/**
 * The Rating parts as one namespace.
 */
export const Rating = {
	Root: RatingRoot,
	Input: RatingInput,
	ReviewItem,
};

export type { RatingSize } from "#/rating/components/rating-stars.ts";
