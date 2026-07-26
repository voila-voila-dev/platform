import { SealPercentIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { OfferBlockSettings } from "#/email-block-editor/blocks/offer-block-settings.tsx";
import { OfferBlockView } from "#/email-block-editor/blocks/offer-block-view.tsx";
import type { EmailEditorOfferBlock } from "#/email-block-editor/document/types.ts";

export const offerBlockDefinition: EmailBlockDefinition<EmailEditorOfferBlock> =
	{
		label: "Offer",
		icon: SealPercentIcon,
		View: OfferBlockView,
		Settings: OfferBlockSettings,
	};
