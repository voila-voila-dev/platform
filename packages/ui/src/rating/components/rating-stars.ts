export type RatingSize = "sm" | "default" | "lg";

export const MAX_STARS = 5;

// `size` coordinates the star and count children off the root's `data-size`.
export const starSizeClasses =
	"size-4 group-data-[size=lg]/rating:size-5 group-data-[size=sm]/rating:size-3.5";
