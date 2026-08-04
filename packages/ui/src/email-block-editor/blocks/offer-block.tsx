import { SealPercentIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { OfferBlockSettings } from "#/email-block-editor/blocks/offer-block-settings.tsx";
import { OfferBlockView } from "#/email-block-editor/blocks/offer-block-view.tsx";
import type { EmailEditorOfferBlock } from "#/email-block-editor/document/types.ts";

export const offerBlockDefinition: EmailBlockDefinition<EmailEditorOfferBlock> =
	{
		type: "offer",
		label: "Offer",
		icon: SealPercentIcon,
		createEmpty: (id) => ({
			id,
			type: "offer",
			eyebrow: "",
			name: "",
			description: "",
			image: { src: "", alt: "" },
			price: { amountInMinorUnits: 0, currency: "EUR" },
			period: "",
			features: [],
			buttonLabel: "",
			buttonHref: "",
			highlighted: false,
		}),
		View: OfferBlockView,
		Settings: OfferBlockSettings,
	};
