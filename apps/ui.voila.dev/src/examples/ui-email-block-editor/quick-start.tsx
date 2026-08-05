import {
	EmailBlockEditor,
	type EmailEditorDocument,
} from "@voila.dev/ui/email-block-editor";
import { useState } from "react";
import { DOCS_EMAIL_BLOCKS } from "./blocks";
import { fakeUploadImage } from "./fixtures";

/** The quick-start hero: a welcome email, in the full composed editor. */
const welcomeDocument: EmailEditorDocument = {
	version: 1,
	blocks: [
		{
			id: "heading",
			type: "heading",
			text: "Welcome {{firstName}}!",
			level: 1,
		},
		{
			id: "intro",
			type: "paragraph",
			spans: [
				{ text: "Your account is ready. Post your " },
				{ text: "first project", bold: true },
				{ text: " from " },
				{ text: "your workspace", href: "https://app.acme.dev" },
				{ text: " and receive your first proposals this week." },
			],
		},
		{
			id: "stats",
			type: "grid",
			desktopColumns: 2,
			mobileColumns: 2,
			children: [
				{
					id: "stat-projects",
					type: "stat",
					value: "1,240",
					label: "Projects staffed",
					description: "",
					align: "center",
				},
				{
					id: "stat-note",
					type: "stat",
					value: "4.8 / 5",
					label: "Average rating",
					description: "",
					align: "center",
				},
			],
		},
		{
			id: "cta",
			type: "button",
			label: "Post a project",
			href: "https://app.acme.dev/projects",
			align: "center",
			variant: "primary",
		},
		{ id: "divider", type: "divider" },
		{
			id: "rating",
			type: "rating",
			question: [{ text: "How was your onboarding experience?" }],
			style: "filled",
			lowLabel: "Not at all",
			highLabel: "Absolutely",
			href: "https://acme.dev/reviews",
		},
	],
};

export function Editor() {
	const [document, setDocument] = useState(welcomeDocument);
	return (
		<EmailBlockEditor
			blocks={DOCS_EMAIL_BLOCKS}
			document={document}
			onDocumentChange={setDocument}
			onUploadImage={fakeUploadImage}
		/>
	);
}
