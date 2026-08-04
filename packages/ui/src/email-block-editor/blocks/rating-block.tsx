import { StarIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { RatingBlockSettings } from "#/email-block-editor/blocks/rating-block-settings.tsx";
import { RatingBlockView } from "#/email-block-editor/blocks/rating-block-view.tsx";
import type { EmailEditorRatingBlock } from "#/email-block-editor/document/types.ts";

export const ratingBlockDefinition: EmailBlockDefinition<EmailEditorRatingBlock> =
	{
		type: "rating",
		label: "Rating",
		icon: StarIcon,
		createEmpty: (id) => ({
			id,
			type: "rating",
			question: [],
			style: "filled",
			lowLabel: "",
			highLabel: "",
			href: "",
		}),
		View: RatingBlockView,
		Settings: RatingBlockSettings,
		richText: true,
	};
