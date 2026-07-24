import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	type EmailEditorDocument,
	emptyEmailEditorDocument,
} from "@voila.dev/ui-email-block-editor/document/types";
import { EmailBlockEditor } from "@voila.dev/ui-email-block-editor/email-block-editor";
import { useState } from "react";

const meta = {
	title: "EmailBlockEditor/EmailBlockEditor",
	component: EmailBlockEditor,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
} satisfies Meta<typeof EmailBlockEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

const sampleDocument: EmailEditorDocument = {
	version: 1,
	blocks: [
		{
			id: "heading",
			type: "heading",
			text: "Hello {{firstName}}!",
			level: 1,
		},
		{
			id: "intro",
			type: "paragraph",
			spans: [
				{ text: "Discover the " },
				{ text: "new projects", bold: true },
				{ text: " published in your field this week on " },
				{ text: "your dashboard", href: "https://app.acme.dev" },
				{ text: "." },
			],
		},
		{
			id: "cta",
			type: "button",
			label: "Browse projects",
			href: "https://app.acme.dev/projects",
			align: "center",
			variant: "primary",
		},
		{ id: "divider", type: "divider" },
		{
			id: "outro",
			type: "paragraph",
			spans: [{ text: "See you soon on Acme." }],
		},
	],
};

/** Fake upload for the stories: no backend here, so the picked file is served
 * from an object URL — the real admin flow returns the uploaded file's URL. */
const fakeUploadImage = async (file: File) => {
	await new Promise((resolve) => setTimeout(resolve, 600));
	return URL.createObjectURL(file);
};

function ControlledEditor({ document }: { document: EmailEditorDocument }) {
	const [value, setValue] = useState(document);
	return (
		<div className="p-6">
			<EmailBlockEditor
				document={value}
				onChange={setValue}
				onUploadImage={fakeUploadImage}
			/>
		</div>
	);
}

export const Composed: Story = {
	args: {
		document: sampleDocument,
		onChange: () => {},
	},
	render: (args) => <ControlledEditor document={args.document} />,
};

/** A multi-column row: blocks drag in and out of the cells, and the column
 * counts (desktop and mobile) live in the block settings panel. */
const gridDocument: EmailEditorDocument = {
	version: 1,
	blocks: [
		{ id: "heading", type: "heading", text: "Our plans", level: 1 },
		{
			id: "row",
			type: "grid",
			desktopColumns: 3,
			mobileColumns: 1,
			children: [
				{
					id: "cell-1",
					type: "image",
					src: "https://placehold.co/162x120/png",
					alt: "Starter plan",
					href: "https://app.acme.dev",
					width: "full",
					overlay: "none",
					rounded: true,
				},
				{ id: "cell-2", type: "heading", text: "Essential", level: 2 },
				{
					id: "cell-3",
					type: "paragraph",
					spans: [{ text: "The foundation to get started." }],
				},
			],
		},
		{
			id: "cta",
			type: "button",
			label: "Learn more",
			href: "https://app.acme.dev",
			align: "center",
			variant: "secondary",
		},
	],
};

export const Grid: Story = {
	args: { document: gridDocument, onChange: () => {} },
	render: (args) => <ControlledEditor document={args.document} />,
};

export const Empty: Story = {
	args: {
		document: emptyEmailEditorDocument(),
		onChange: () => {},
	},
	render: (args) => <ControlledEditor document={args.document} />,
};

/** One of every block, for the mobile checklist: no horizontal overflow, the
 * toolbar inside the viewport, 44px tap targets, reachable settings. */
const everyBlockDocument: EmailEditorDocument = {
	version: 1,
	blocks: [
		{ id: "h1", type: "heading", text: "Hello {{firstName}}!", level: 1 },
		{
			id: "intro",
			type: "paragraph",
			spans: [
				{ text: "A recap of " },
				{ text: "your month", bold: true },
				{ text: " on Acme." },
			],
		},
		{
			id: "stats",
			type: "grid",
			desktopColumns: 3,
			mobileColumns: 2,
			children: [
				{
					id: "s1",
					type: "stat",
					value: "1,240",
					label: "Projects",
					description: "",
					align: "center",
				},
				{
					id: "s2",
					type: "stat",
					value: "98%",
					label: "Satisfaction",
					description: "",
					align: "center",
				},
				{
					id: "s3",
					type: "stat",
					value: "4.8",
					label: "Average rating",
					description: "",
					align: "center",
				},
			],
		},
		{ id: "d1", type: "divider" },
		{ id: "h2", type: "heading", text: "How it works", level: 2 },
		{
			id: "steps",
			type: "list",
			marker: "badge",
			items: [
				{
					title: "Post your project",
					spans: [{ text: "In two minutes." }],
				},
				{
					title: "Receive applications",
					spans: [{ text: "From verified freelancers." }],
				},
			],
		},
		{
			id: "img",
			type: "image",
			src: "https://placehold.co/536x220/png",
			alt: "A working session",
			href: "https://acme.dev",
			width: "full",
			overlay: "play",
			rounded: true,
		},
		{
			id: "cards",
			type: "grid",
			desktopColumns: 2,
			mobileColumns: 1,
			children: [
				{
					id: "art",
					type: "article",
					title: "How to pick a designer",
					description: "The three criteria that matter.",
					image: { src: "https://placehold.co/252x120/png", alt: "" },
					author: "Emma Martin",
					publishDate: "2026-07-20",
					href: "https://acme.dev/blog",
				},
				{
					id: "prod",
					type: "product",
					name: "Landing page templates",
					description: "Set of 10.",
					image: { src: "https://placehold.co/252x120/png", alt: "" },
					price: { amountInMinorUnits: 5990, currency: "EUR" },
					compareAtPrice: { amountInMinorUnits: 7990, currency: "EUR" },
					href: "https://shop.acme.dev",
					buttonLabel: "Order now",
				},
			],
		},
		{
			id: "tarifs",
			type: "table",
			headerRow: true,
			columns: [
				{ label: "Service", align: "left" },
				{ label: "Rate", align: "right" },
			],
			rows: [
				["UX design", "€60.00"],
				["Copywriting", "€55.00"],
			],
		},
		{
			id: "offre",
			type: "offer",
			eyebrow: "Most popular",
			name: "Essential",
			description: "",
			image: { src: "", alt: "" },
			price: { amountInMinorUnits: 2900, currency: "EUR" },
			period: "per month",
			features: ["Unlimited projects", "7-day support"],
			buttonLabel: "Choose",
			buttonHref: "https://acme.dev/plans",
			highlighted: true,
		},
		{
			id: "note",
			type: "rating",
			question: [{ text: "What do you think of Acme?" }],
			style: "filled",
			lowLabel: "Not at all",
			highLabel: "Absolutely",
			href: "https://acme.dev/reviews",
		},
		{
			id: "cta",
			type: "button",
			label: "Open my dashboard",
			href: "https://app.acme.dev",
			align: "center",
			variant: "primary",
		},
	],
};

export const EveryBlock: Story = {
	args: { document: everyBlockDocument, onChange: () => {} },
	render: (args) => <ControlledEditor document={args.document} />,
};
