import { StarIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { RatingBlockSettings } from "#/email-block-editor/blocks/rating-block-settings.tsx";
import { RatingBlockView } from "#/email-block-editor/blocks/rating-block-view.tsx";
import type { EmailEditorRatingBlock } from "#/email-block-editor/document/types.ts";

export const ratingBlockDefinition: EmailBlockDefinition<EmailEditorRatingBlock> =
	{
		label: "Rating",
		icon: StarIcon,
		View: RatingBlockView,
		Settings: RatingBlockSettings,
	};
