import { StarIcon } from "@phosphor-icons/react";
import { RatingView } from "#/content-editor/features/rating/rating-view.tsx";
import {
	type ContentRatingNode,
	RATING_DEFAULTS,
	ratingNode,
} from "#/content-editor/features/rating/reader.tsx";
import { defineElementFeature } from "#/content-editor/lib/define-element-feature.ts";

export const ratingFeature = defineElementFeature<ContentRatingNode>({
	key: "rating",
	kind: "text",
	node: ratingNode,
	fields: [
		{
			type: "select",
			key: "style",
			label: "ratingStyle",
			options: [
				{ value: "filled", label: "ratingStyleFilled" },
				{ value: "outline", label: "ratingStyleOutline" },
			],
		},
		{
			type: "text",
			key: "lowLabel",
			label: "ratingLowLabel",
			placeholder: "ratingLowLabelPlaceholder",
		},
		{
			type: "text",
			key: "highLabel",
			label: "ratingHighLabel",
			placeholder: "ratingHighLabelPlaceholder",
		},
		{
			type: "url",
			key: "href",
			label: "ratingHref",
			description: "ratingHrefDescription",
		},
	],
	defaults: RATING_DEFAULTS,
	view: RatingView,
	insert: {
		icon: StarIcon,
		keywords: ["rating", "stars", "score", "survey", "feedback", "nps"],
	},
});
