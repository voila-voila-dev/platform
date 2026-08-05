import {
	createEmailBlocks,
	EMAIL_EDITOR_DOCUMENT_VERSION,
	EmailBlockEditor,
	type EmailEditorDocument,
} from "@voila.dev/ui/email-block-editor";
import { useState } from "react";

/**
 * The welcome email seeding the homepage demo: heading, paragraph, product
 * card, button, rating, footer divider — enough block variety that dragging
 * one feels like using the real thing, because it is.
 */
const welcomeDocument: EmailEditorDocument = {
	version: EMAIL_EDITOR_DOCUMENT_VERSION,
	blocks: [
		{
			id: "demo-heading",
			type: "heading",
			text: "Welcome aboard, {{firstName}}",
			level: 1,
		},
		{
			id: "demo-paragraph",
			type: "paragraph",
			spans: [
				{
					text: "Your workspace is live. Invite your team, connect a data source and ",
				},
				{ text: "ship your first project", bold: true },
				{
					text: " today. Every block in this email was placed with the same editor you are looking at.",
				},
			],
		},
		{
			id: "demo-product",
			type: "product",
			name: "Acme Pro",
			description:
				"Unlimited projects, priority support and the full analytics suite.",
			image: {
				src: "https://placehold.co/536x220/png",
				alt: "The Acme Pro dashboard",
			},
			price: { amountInMinorUnits: 2900, currency: "EUR" },
			compareAtPrice: { amountInMinorUnits: 4900, currency: "EUR" },
			href: "https://app.example.com/upgrade",
			buttonLabel: "Upgrade to Pro",
		},
		{
			id: "demo-button",
			type: "button",
			label: "Open your workspace",
			href: "https://app.example.com",
			align: "center",
			variant: "primary",
		},
		{
			id: "demo-rating",
			type: "rating",
			question: [{ text: "How was your onboarding?" }],
			style: "filled",
			lowLabel: "Rough",
			highLabel: "Flawless",
			href: "https://app.example.com/feedback",
		},
		{ id: "demo-divider", type: "divider" },
	],
};

/**
 * The live editor on the homepage. The document is plain local state — the
 * same controlled `document`/`onChange` contract an app would persist — and
 * this module is behind `React.lazy` because the editor pulls in dnd-kit.
 */
const DEMO_BLOCKS = createEmailBlocks({ currency: "EUR" });

export default function EmailEditorDemo() {
	const [document, setDocument] = useState(welcomeDocument);
	return (
		<EmailBlockEditor
			blocks={DEMO_BLOCKS}
			document={document}
			onDocumentChange={setDocument}
		/>
	);
}
