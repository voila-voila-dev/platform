import {
	ContentEditor,
	type ContentValue,
	createCorrespondenceFeatures,
	createEmailFeatures,
} from "@voila.dev/ui/content-editor";
import { useState } from "react";
import { fakeUploadImage } from "./fixtures";

const CORRESPONDENCE = createCorrespondenceFeatures();
const EMAIL = createEmailFeatures();

const VARIABLES = [
	{ name: "firstName", label: "First name" },
	{ name: "lastName", label: "Last name" },
];

const text = (value: string) => [{ text: value }];

const firstName = {
	type: "variable",
	name: "firstName",
	children: text(""),
};

const mail: ContentValue = [
	{ type: "p", children: [{ text: "Hi " }, firstName, { text: "," }] },
	{
		type: "p",
		children: text(
			"Thanks for Saturday. Paste a table from a spreadsheet here: it arrives as lines of text, because a mail has no tables.",
		),
	},
	{ type: "p", children: text("See you next week,") },
];

/** The Gmail-like composer: text, lists, quotes, images, a name. */
export function Correspondence() {
	const [value, setValue] = useState<ContentValue | null>(mail);
	return (
		<ContentEditor.Root
			features={CORRESPONDENCE}
			value={value}
			onChange={setValue}
			appearance="plain"
			variables={VARIABLES}
			onUploadImage={fakeUploadImage}
		>
			<ContentEditor.Layout>
				<ContentEditor.Toolbar />
				<ContentEditor.Canvas />
			</ContentEditor.Layout>
			<ContentEditor.FloatingToolbar />
		</ContentEditor.Root>
	);
}

const campaign: ContentValue = [
	{
		type: "h1",
		children: [{ text: "Your season starts, " }, firstName, { text: "" }],
	},
	{
		type: "p",
		children: text("Type / for any email block: a button, a product, columns."),
	},
	{
		type: "button",
		label: "Book a slot",
		href: "https://example.com/book",
		variant: "primary",
		align: "center",
		children: text(""),
	},
];

/** A campaign email: every email block, the inspector beside the canvas. */
export function Email() {
	const [value, setValue] = useState<ContentValue | null>(campaign);
	return (
		<ContentEditor.Root
			features={EMAIL}
			value={value}
			onChange={setValue}
			appearance="email"
			variables={VARIABLES}
			onUploadImage={fakeUploadImage}
		>
			<div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
				<ContentEditor.Layout>
					<ContentEditor.Toolbar />
					<ContentEditor.Canvas />
				</ContentEditor.Layout>
				<ContentEditor.Inspector className="rounded-lg border border-border p-4" />
			</div>
			<ContentEditor.FloatingToolbar />
		</ContentEditor.Root>
	);
}
