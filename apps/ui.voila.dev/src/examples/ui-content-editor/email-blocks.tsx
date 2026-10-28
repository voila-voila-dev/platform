import {
	badgeListFeature,
	buttonFeature,
	ContentEditor,
	type ContentValue,
	createContentFeatures,
	finePrintFeature,
	highlightFeature,
	statFeature,
} from "@voila.dev/ui/content-editor";
import { useState } from "react";
import { fakeUploadImage } from "./fixtures";

const FEATURES = [
	...createContentFeatures({ headings: ["h1", "h2"] }),
	badgeListFeature,
	highlightFeature,
	finePrintFeature,
	buttonFeature,
	statFeature,
];

const THEME = {
	color: {
		brand: "#0f766e",
		canvas: "#f1f5f9",
		card: "#ffffff",
		ink: "#1f2937",
	},
};

/** The email appearance with the inspector beside it. */
function EmailComposer({ initial }: { readonly initial: ContentValue }) {
	const [value, setValue] = useState<ContentValue | null>(initial);
	return (
		<ContentEditor.Root
			features={FEATURES}
			value={value}
			onChange={setValue}
			appearance="email"
			theme={THEME}
			onUploadImage={fakeUploadImage}
		>
			<div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
				<ContentEditor.Layout>
					<ContentEditor.Toolbar />
					<ContentEditor.Canvas />
				</ContentEditor.Layout>
				<ContentEditor.Inspector className="rounded-lg border border-border p-4" />
			</div>
		</ContentEditor.Root>
	);
}

const text = (value: string) => [{ text: value }];

/** An email's title and a section heading. */
export function Headings() {
	return (
		<EmailComposer
			initial={[
				{ type: "h1", children: text("Your season starts Saturday") },
				{ type: "p", children: text("Type # for a title, ## for a section.") },
				{ type: "h2", children: text("What to bring") },
				{ type: "p", children: text("Your badge and a water bottle.") },
			]}
		/>
	);
}

/** Three steps as a badge list. */
export function BadgeList() {
	return (
		<EmailComposer
			initial={[
				{ type: "p", children: text("Three steps:") },
				{
					type: "p",
					listStyleType: "badge",
					indent: 1,
					children: text("Create your account"),
				},
				{
					type: "p",
					listStyleType: "badge",
					indent: 1,
					listStart: 2,
					children: text("Pick a slot"),
				},
				{
					type: "p",
					listStyleType: "badge",
					indent: 1,
					listStart: 3,
					children: text("Show up on Saturday"),
				},
			]}
		/>
	);
}

/** A promo line: click it and change its alignment in the inspector. */
export function Highlight() {
	return (
		<EmailComposer
			initial={[
				{
					type: "highlight",
					align: "center",
					children: text("10% off everything with the code LAUNCH10"),
				},
				{ type: "p", children: text("Valid until Sunday.") },
			]}
		/>
	);
}

/** The conditions at the foot of an email, with a link to the terms. */
export function FinePrint() {
	return (
		<EmailComposer
			initial={[
				{ type: "p", children: text("See you on Saturday.") },
				{
					type: "fine-print",
					children: [
						{ text: "Offer valid until 30 June. " },
						{
							type: "a",
							url: "https://example.com/terms",
							children: text("Terms and conditions"),
						},
						{ text: "." },
					],
				},
			]}
		/>
	);
}

/** A filled and an outlined button: click one to edit it. */
export function Button() {
	return (
		<EmailComposer
			initial={[
				{ type: "p", children: text("Places are limited.") },
				{
					type: "button",
					label: "Book a slot",
					href: "https://example.com/book",
					variant: "primary",
					align: "center",
					children: text(""),
				},
				{
					type: "button",
					label: "See the schedule",
					href: "https://example.com/schedule",
					variant: "secondary",
					align: "center",
					children: text(""),
				},
			]}
		/>
	);
}

/** A key figure: click it to edit it. */
export function Stat() {
	return (
		<EmailComposer
			initial={[
				{
					type: "stat",
					value: "128",
					label: "Projects delivered",
					description: "Since the club opened in 2019.",
					align: "center",
					children: text(""),
				},
			]}
		/>
	);
}

/** A linked video thumbnail with the play badge, at reduced width. */
export function Image() {
	return (
		<EmailComposer
			initial={[
				{
					type: "image",
					url: "/og.png",
					alt: "The kit's cover",
					href: "https://ui.voila.dev",
					size: "contained",
					overlay: "play",
					children: text(""),
				},
				{ type: "p", children: text("Click the image to edit it.") },
			]}
		/>
	);
}

/** A rule between two paragraphs. */
export function Divider() {
	return (
		<EmailComposer
			initial={[
				{ type: "p", children: text("Above the rule.") },
				{ type: "hr", children: text("") },
				{ type: "p", children: text("Type --- on an empty line for another.") },
			]}
		/>
	);
}
