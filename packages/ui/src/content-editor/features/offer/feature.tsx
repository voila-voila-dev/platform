import { SealCheckIcon } from "@phosphor-icons/react";
import { OfferView } from "#/content-editor/features/offer/offer-view.tsx";
import {
	type ContentOfferNode,
	offerDefaults,
	offerNode,
} from "#/content-editor/features/offer/reader.tsx";
import type { ContentPriceFeatureOptions } from "#/content-editor/features/product/feature.tsx";
import { defineElementFeature } from "#/content-editor/lib/define-element-feature.ts";

export function createOfferFeature({
	currencies = ["EUR"],
}: ContentPriceFeatureOptions = {}) {
	return defineElementFeature<ContentOfferNode>({
		key: "offer",
		kind: "void",
		node: offerNode,
		fields: [
			{
				type: "text",
				key: "eyebrow",
				label: "offerEyebrow",
				placeholder: "offerEyebrowPlaceholder",
			},
			{ type: "text", key: "name", label: "offerName" },
			{
				type: "text",
				key: "description",
				label: "offerDescription",
				multiline: true,
			},
			{
				type: "image",
				key: "image",
				label: "offerImage",
				description: "offerImageDescription",
				withAlt: true,
			},
			{ type: "money", key: "price", label: "offerPrice", currencies },
			{
				type: "text",
				key: "period",
				label: "offerPeriod",
				placeholder: "offerPeriodPlaceholder",
				description: "offerPeriodDescription",
			},
			{ type: "string-list", key: "features", label: "offerFeature" },
			{
				type: "text",
				key: "buttonLabel",
				label: "offerButtonLabel",
				placeholder: "offerButtonLabelPlaceholder",
				description: "offerButtonLabelDescription",
			},
			{ type: "url", key: "buttonHref", label: "offerButtonHref" },
			{
				type: "boolean",
				key: "highlighted",
				label: "offerHighlighted",
				description: "offerHighlightedDescription",
			},
		],
		defaults: offerDefaults(currencies[0] ?? "EUR"),
		view: OfferView,
		insert: {
			icon: SealCheckIcon,
			keywords: ["offer", "plan", "pricing", "subscription", "card"],
		},
	});
}

export const offerFeature = createOfferFeature();
