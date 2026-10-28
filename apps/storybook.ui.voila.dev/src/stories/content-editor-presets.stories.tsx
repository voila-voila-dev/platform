import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	ContentEditor,
	type ContentValue,
	createCorrespondenceFeatures,
	createEmailFeatures,
} from "@voila.dev/ui/content-editor";
import { useState } from "react";
import { PORTRAIT_IMAGE } from "../fixtures/portrait-image";

const CORRESPONDENCE = createCorrespondenceFeatures();
const EMAIL = createEmailFeatures({ currencies: ["EUR", "USD"] });

const VARIABLES = [
	{ name: "firstName", label: "First name" },
	{ name: "lastName", label: "Last name" },
	{ name: "email", label: "Email" },
];

const upload = async (file: File) => ({ url: URL.createObjectURL(file) });

const meta = {
	title: "ContentEditor/Presets",
	component: ContentEditor.Root,
	parameters: { layout: "padded" },
} satisfies Meta<typeof ContentEditor.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const text = (value: string) => [{ text: value }];
const leaf = [{ text: "" }];
const variable = (name: string) => ({ type: "variable", name, children: leaf });
const item = (listStyleType: string, value: string) => ({
	type: "p",
	listStyleType,
	indent: 1,
	children: text(value),
});

const shortMail: ContentValue = [
	{
		type: "p",
		children: [{ text: "Hi " }, variable("firstName"), { text: "," }],
	},
	{
		type: "p",
		children: [
			{ text: "Thanks for " },
			{ text: "Saturday", bold: true },
			{ text: ". The " },
			{
				type: "a",
				url: "https://example.com/schedule",
				children: text("schedule"),
			},
			{ text: " is up; bring:" },
		],
	},
	item("disc", "your badge"),
	item("disc", "a water bottle"),
	{ type: "blockquote", children: text("Kick-off is at 10, not 11.") },
	{ type: "p", children: text("See you,") },
];

const cell = (type: "th" | "td", value: string) => ({
	type,
	children: [{ type: "p", children: text(value) }],
});

const fullEmail: ContentValue = [
	{
		type: "h1",
		children: [
			{ text: "Your season starts, " },
			variable("firstName"),
			{ text: "" },
		],
	},
	{
		type: "p",
		children: [
			{ text: "Everything for Saturday in one email: " },
			{ text: "bold", bold: true },
			{ text: ", " },
			{ text: "italic", italic: true },
			{ text: ", " },
			{ text: "underlined", underline: true },
			{ text: " and a " },
			{ type: "a", url: "https://example.com", children: text("link") },
			{ text: "." },
		],
	},
	{ type: "h2", children: text("Three steps") },
	item("badge", "Book your slot"),
	item("badge", "Pick up your badge"),
	item("badge", "Warm up at 9:45"),
	item("disc", "Bring a water bottle"),
	item("decimal", "Arrive by 9:30"),
	{ type: "highlight", align: "center", children: text("Kick-off is at 10.") },
	{
		type: "button",
		label: "Book a slot",
		href: "https://example.com/book",
		variant: "primary",
		align: "center",
		children: leaf,
	},
	{
		type: "columns",
		desktopColumns: 3,
		mobileColumns: 1,
		children: [
			["24", "teams"],
			["3", "pitches"],
			["1", "trophy"],
		].map(([value, label]) => ({
			type: "column",
			children: [
				{
					type: "stat",
					value,
					label,
					description: "",
					align: "center",
					children: leaf,
				},
			],
		})),
	},
	{
		type: "image",
		url: PORTRAIT_IMAGE,
		alt: "Last season's final",
		href: "https://example.com/video",
		size: "contained",
		overlay: "play",
		children: leaf,
	},
	{ type: "hr", children: leaf },
	{
		type: "article",
		title: "How we train in the off-season",
		description: "Four weeks, three sessions each, one goal.",
		image: { src: PORTRAIT_IMAGE, alt: "" },
		author: "Anna",
		publishDate: "2026-09-01",
		href: "https://example.com/blog/off-season",
		children: leaf,
	},
	{
		type: "product",
		name: "Club jersey",
		description: "The home kit, with your number.",
		image: { src: PORTRAIT_IMAGE, alt: "The home jersey" },
		price: { amountInMinorUnits: 4900, currency: "EUR" },
		compareAtPrice: { amountInMinorUnits: 5900, currency: "EUR" },
		href: "https://example.com/shop/jersey",
		buttonLabel: "Order",
		children: leaf,
	},
	{
		type: "offer",
		eyebrow: "Most chosen",
		name: "Season pass",
		description: "Every match, every training.",
		image: { src: "", alt: "" },
		price: { amountInMinorUnits: 12000, currency: "EUR" },
		period: "per season",
		features: ["All home matches", "Two guest passes"],
		buttonLabel: "Get the pass",
		buttonHref: "https://example.com/pass",
		highlighted: true,
		children: leaf,
	},
	{
		type: "table",
		columns: [{ align: "left" }, { align: "right" }],
		headerRow: true,
		children: [
			{ type: "tr", children: [cell("th", "Item"), cell("th", "Price")] },
			{ type: "tr", children: [cell("td", "Jersey"), cell("td", "€49")] },
			{ type: "tr", children: [cell("td", "Pass"), cell("td", "€120")] },
		],
	},
	{
		type: "rating",
		style: "filled",
		lowLabel: "Not at all",
		highLabel: "Absolutely",
		href: "https://example.com/feedback",
		children: text("Would you recommend the club?"),
	},
	{
		type: "fine-print",
		children: [
			{ text: "Sent to " },
			variable("email"),
			{ text: " because you joined the club." },
		],
	},
];

function Correspondence({ initial }: { readonly initial: ContentValue }) {
	const [value, setValue] = useState<ContentValue | null>(initial);
	return (
		<ContentEditor.Root
			features={CORRESPONDENCE}
			value={value}
			onChange={setValue}
			appearance="plain"
			variables={VARIABLES}
			onUploadImage={upload}
		>
			<ContentEditor.Layout>
				<ContentEditor.Toolbar />
				<ContentEditor.Canvas />
			</ContentEditor.Layout>
			<ContentEditor.FloatingToolbar />
		</ContentEditor.Root>
	);
}

function Email({ initial }: { readonly initial: ContentValue }) {
	const [value, setValue] = useState<ContentValue | null>(initial);
	return (
		<ContentEditor.Root
			features={EMAIL}
			value={value}
			onChange={setValue}
			appearance="email"
			variables={VARIABLES}
			onUploadImage={upload}
		>
			<div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
				<ContentEditor.Layout stickyToolbar>
					<ContentEditor.Toolbar />
					<ContentEditor.Canvas />
				</ContentEditor.Layout>
				<ContentEditor.Inspector className="rounded-lg border border-border p-4" />
			</div>
			<ContentEditor.FloatingToolbar />
		</ContentEditor.Root>
	);
}

const noArgs = {
	features: EMAIL,
	value: [],
	onChange: () => {},
	children: null,
};

/** A short mail to one person: text, a link, a list, a quote, a name. */
export const CorrespondenceMail: Story = {
	args: noArgs,
	render: () => <Correspondence initial={shortMail} />,
};

/** The correspondence composer, empty: type `{{` for a name, `/` for a block. */
export const CorrespondenceEmpty: Story = {
	args: noArgs,
	render: () => <Correspondence initial={[]} />,
};

/** Every block of the email preset in one campaign, the inspector beside it. */
export const EmailEveryBlock: Story = {
	args: noArgs,
	render: () => <Email initial={fullEmail} />,
};

/** The email preset, empty: `/` lists every email block. */
export const EmailEmpty: Story = {
	args: noArgs,
	render: () => <Email initial={[]} />,
};
