import {
	articleFeature,
	ContentEditor,
	type ContentEditorAppearance,
	type ContentValue,
	createContentFeatures,
	createOfferFeature,
	createProductFeature,
	emailTableFeature,
	highlightFeature,
	ratingFeature,
} from "@voila.dev/ui/content-editor";
import { useState } from "react";
import { fakeUploadImage } from "./content-editor-fixtures.ts";

/** The built-in features with the email table, plus the card blocks, as an email preset will hold them. */
export const CARD_FEATURES = [
	...createContentFeatures().filter((feature) => feature.key !== "table"),
	emailTableFeature,
	highlightFeature,
	articleFeature,
	createProductFeature({ currencies: ["EUR", "USD"] }),
	createOfferFeature({ currencies: ["EUR", "USD"] }),
	ratingFeature,
];

interface Props {
	readonly initial: ContentValue;
	readonly appearance?: ContentEditorAppearance;
}

/** The canvas with the inspector beside it on a wide screen, under it on a phone. */
export function CardEditor({ initial, appearance = "email" }: Props) {
	const [value, setValue] = useState<ContentValue | null>(initial);
	return (
		<ContentEditor.Root
			features={CARD_FEATURES}
			value={value}
			onChange={setValue}
			appearance={appearance}
			onUploadImage={fakeUploadImage}
		>
			<div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<ContentEditor.Layout>
					<ContentEditor.Toolbar />
					<ContentEditor.Canvas />
				</ContentEditor.Layout>
				<ContentEditor.Inspector className="rounded-lg border border-border p-4 lg:sticky lg:top-4" />
			</div>
			<ContentEditor.FloatingToolbar />
		</ContentEditor.Root>
	);
}

export const noArgs = {
	features: CARD_FEATURES,
	value: [],
	onChange: () => {},
	children: null,
};

export const paragraph = (text: string): ContentValue[number] => ({
	type: "p",
	children: [{ text }],
});

/** A 16:9 visual, the crop the card image field uploads through. */
export const CARD_IMAGE = `data:image/svg+xml,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#99f6e4"/><stop offset="1" stop-color="#0f766e"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><circle cx="470" cy="120" r="56" fill="#fef3c7"/><path d="M0 300 L180 190 L320 280 L460 210 L640 300 V360 H0Z" fill="#134e4a"/></svg>',
)}`;
