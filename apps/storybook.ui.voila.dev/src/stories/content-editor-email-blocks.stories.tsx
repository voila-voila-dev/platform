import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	badgeListFeature,
	buttonFeature,
	ContentEditor,
	type ContentEditorAppearance,
	type ContentValue,
	createContentFeatures,
	finePrintFeature,
	highlightFeature,
	statFeature,
} from "@voila.dev/ui/content-editor";
import { useState } from "react";
import { PORTRAIT_IMAGE } from "../fixtures/portrait-image";

const FEATURES = [
	...createContentFeatures({ headings: ["h1", "h2"] }),
	badgeListFeature,
	highlightFeature,
	finePrintFeature,
	buttonFeature,
	statFeature,
];

const BRAND_THEME = {
	color: {
		brand: "#0f766e",
		ink: "#1f2937",
		muted: "#6b7280",
		border: "#e5e7eb",
		card: "#ffffff",
		canvas: "#f1f5f9",
	},
};

const meta = {
	title: "ContentEditor/Email blocks",
	component: ContentEditor.Root,
	parameters: { layout: "padded" },
} satisfies Meta<typeof ContentEditor.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The email appearance with the inspector beside it, as a campaign editor lays it out. */
function Composer({
	initial,
	appearance = "email",
}: {
	readonly initial: ContentValue;
	readonly appearance?: ContentEditorAppearance;
}) {
	const [value, setValue] = useState<ContentValue | null>(initial);
	return (
		<ContentEditor.Root
			features={FEATURES}
			value={value}
			onChange={setValue}
			appearance={appearance}
			theme={BRAND_THEME}
			onUploadImage={async (file) => ({ url: URL.createObjectURL(file) })}
		>
			<div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
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

const noArgs = {
	features: FEATURES,
	value: [],
	onChange: () => {},
	children: null,
};

const text = (value: string) => [{ text: value }];

const headings: ContentValue = [
	{ type: "h1", children: text("Your season starts Saturday") },
	{ type: "p", children: text("Type # for a title, ## for a section.") },
	{ type: "h2", children: text("What to bring") },
	{ type: "p", children: text("Your badge and a water bottle.") },
];

/** `h1` is the email's title, `h2` a section; both in the brand colour. */
export const Headings: Story = {
	args: noArgs,
	render: () => <Composer initial={headings} />,
};

/** The same headings in the document appearance. */
export const HeadingsInADocument: Story = {
	args: noArgs,
	render: () => <Composer initial={headings} appearance="document" />,
};

const item = (listStyleType: string, value: string, listStart?: number) => ({
	type: "p",
	listStyleType,
	indent: 1,
	...(listStart === undefined ? {} : { listStart }),
	children: text(value),
});

const lists: ContentValue = [
	{ type: "p", children: text("Three steps, as badges:") },
	item("badge", "Create your account"),
	item("badge", "Pick a slot", 2),
	item("badge", "Show up on Saturday", 3),
	{ type: "p", children: text("Bullets and numbers stay as they were:") },
	item("disc", "Doors open at 9:00"),
	item("disc", "Bring your badge"),
	{ type: "p", children: text("") },
	item("decimal", "Warm up"),
	item("decimal", "Play", 2),
];

/** The badge list beside the bulleted and numbered ones; `/badge` makes one. */
export const BadgeList: Story = {
	args: noArgs,
	render: () => <Composer initial={lists} />,
};

/** The badge list in the document appearance. */
export const BadgeListInADocument: Story = {
	args: noArgs,
	render: () => <Composer initial={lists} appearance="document" />,
};

const highlights: ContentValue = [
	{
		type: "highlight",
		align: "center",
		children: text("10% off everything with the code LAUNCH10"),
	},
	{ type: "highlight", align: "left", children: text("Aligned left") },
	{ type: "highlight", align: "right", children: text("Aligned right") },
	{ type: "p", children: text("Type /highlight to turn a line into one.") },
];

/** A highlight in each alignment. */
export const Highlight: Story = {
	args: noArgs,
	render: () => <Composer initial={highlights} />,
};

/** The highlights in the document appearance. */
export const HighlightInADocument: Story = {
	args: noArgs,
	render: () => <Composer initial={highlights} appearance="document" />,
};

const finePrint: ContentValue = [
	{ type: "p", children: text("See you on Saturday.") },
	{
		type: "fine-print",
		children: [
			{ text: "Offer valid until 30 June, one per household. " },
			{
				type: "a",
				url: "https://example.com/terms",
				children: text("Terms and conditions"),
			},
			{ text: ".\nYou receive this email because you joined the club." },
		],
	},
];

/** The small print, with a link and a line break. */
export const FinePrint: Story = {
	args: noArgs,
	render: () => <Composer initial={finePrint} />,
};

/** The small print in the document appearance. */
export const FinePrintInADocument: Story = {
	args: noArgs,
	render: () => <Composer initial={finePrint} appearance="document" />,
};

const button = (
	label: string,
	variant: "primary" | "secondary",
	align: "left" | "center" | "right",
) => ({
	type: "button",
	label,
	href: "https://example.com/book",
	variant,
	align,
	children: text(""),
});

const buttons: ContentValue = [
	{ type: "p", children: text("Click a button to edit it in the settings.") },
	button("Book a slot", "primary", "center"),
	button("See the schedule", "secondary", "center"),
	button("Aligned left", "primary", "left"),
	button("Aligned right", "secondary", "right"),
	button("", "primary", "center"),
];

/** Filled and outlined, in each alignment, and an empty one showing its placeholder. */
export const Button: Story = {
	args: noArgs,
	render: () => <Composer initial={buttons} />,
};

/** The buttons in the document appearance. */
export const ButtonInADocument: Story = {
	args: noArgs,
	render: () => <Composer initial={buttons} appearance="document" />,
};

const stat = (
	value: string,
	label: string,
	description: string,
	align: "left" | "center" | "right",
) => ({ type: "stat", value, label, description, align, children: text("") });

const stats: ContentValue = [
	stat("128", "Projects delivered", "Since the club opened in 2019.", "center"),
	stat("4.9", "Average rating", "", "left"),
	stat("12", "Coaches", "All certified.", "right"),
	stat("", "", "", "center"),
];

/** A figure in each alignment, one without a description, and an empty one. */
export const Stat: Story = {
	args: noArgs,
	render: () => <Composer initial={stats} />,
};

/** The figures in the document appearance. */
export const StatInADocument: Story = {
	args: noArgs,
	render: () => <Composer initial={stats} appearance="document" />,
};

const picture = (
	size: "full" | "contained",
	overlay: "none" | "play",
	href: string,
	caption: string,
) => ({
	type: "image",
	url: PORTRAIT_IMAGE,
	alt: "",
	caption,
	href,
	size,
	overlay,
	children: text(""),
});

const images: ContentValue = [
	picture("full", "none", "", "Full width"),
	picture("contained", "none", "https://example.com", "Reduced width, linked"),
	picture("full", "play", "https://example.com/video", "A video thumbnail"),
	{ type: "image", url: "", children: text("") },
];

/** Full and reduced width, a linked thumbnail with the play badge, and an empty image. */
export const Image: Story = {
	args: noArgs,
	render: () => <Composer initial={images} />,
};

/** The images in the document appearance. */
export const ImageInADocument: Story = {
	args: noArgs,
	render: () => <Composer initial={images} appearance="document" />,
};

const dividers: ContentValue = [
	{ type: "p", children: text("Above the rule.") },
	{ type: "hr", children: text("") },
	{ type: "p", children: text("Type --- on an empty line for another.") },
];

/** The divider in the theme's border colour. */
export const Divider: Story = {
	args: noArgs,
	render: () => <Composer initial={dividers} />,
};

/** The divider in the document appearance. */
export const DividerInADocument: Story = {
	args: noArgs,
	render: () => <Composer initial={dividers} appearance="document" />,
};
