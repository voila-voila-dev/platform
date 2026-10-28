import {
	articleFeature,
	ContentEditor,
	type ContentValue,
	createContentFeatures,
	createOfferFeature,
	createProductFeature,
	emailTableFeature,
	ratingFeature,
} from "@voila.dev/ui/content-editor";
import { useState } from "react";
import { fakeUploadImage } from "./fixtures";

/** The built-in features with the email table, plus the card blocks, as an email preset will hold them. */
export const CARD_FEATURES = [
	...createContentFeatures().filter((feature) => feature.key !== "table"),
	emailTableFeature,
	articleFeature,
	createProductFeature({ currencies: ["EUR", "USD"] }),
	createOfferFeature({ currencies: ["EUR", "USD"] }),
	ratingFeature,
];

/** An email-appearance editor with the inspector beside the canvas. */
export function CardEditor({ initial }: { readonly initial: ContentValue }) {
	const [value, setValue] = useState<ContentValue | null>(initial);
	return (
		<ContentEditor.Root
			features={CARD_FEATURES}
			value={value}
			onChange={setValue}
			appearance="email"
			onUploadImage={fakeUploadImage}
		>
			<div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
				<ContentEditor.Layout>
					<ContentEditor.Toolbar />
					<ContentEditor.Canvas />
				</ContentEditor.Layout>
				<ContentEditor.Inspector className="rounded-lg border border-border p-4" />
			</div>
		</ContentEditor.Root>
	);
}
