import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	ContentEditor,
	type ContentEditorAppearance,
	type ContentEditorThemeInput,
	type ContentValue,
	createContentFeatures,
	EmailCardButton,
	EmailCardMeta,
	EmailCardShell,
	variableFeature,
} from "@voila.dev/ui/content-editor";
import { useState } from "react";
import { PORTRAIT_IMAGE } from "../fixtures/portrait-image";

const FEATURES = [...createContentFeatures(), variableFeature];

const VARIABLES = [
	{ name: "firstName", label: "First name" },
	{ name: "lastName", label: "Last name" },
	{ name: "email", label: "Email" },
];

/** A brand palette and font, as a host passes the one its sent emails use. */
const BRAND_THEME: ContentEditorThemeInput = {
	color: {
		brand: "#0f766e",
		ink: "#1f2937",
		muted: "#6b7280",
		border: "#e5e7eb",
		card: "#ffffff",
		canvas: "#f1f5f9",
	},
	font: "Georgia, 'Times New Roman', serif",
};

const mail: ContentValue = [
	{
		type: "p",
		children: [
			{ text: "Hello " },
			{ type: "variable", name: "firstName", children: [{ text: "" }] },
			{ text: "," },
		],
	},
	{
		type: "p",
		children: [
			{ text: "Your spot for Saturday is confirmed. Type " },
			{ text: "{{", code: true },
			{ text: " to add another variable." },
		],
	},
	{
		type: "p",
		listStyleType: "disc",
		indent: 1,
		children: [{ text: "Doors open at 9:00" }],
	},
	{
		type: "p",
		listStyleType: "disc",
		indent: 1,
		children: [{ text: "Bring your badge" }],
	},
	{
		type: "p",
		children: [{ text: "See you there,\nThe team" }],
	},
];

const meta = {
	title: "ContentEditor/Appearance",
	component: ContentEditor.Root,
	parameters: { layout: "padded" },
} satisfies Meta<typeof ContentEditor.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

function Mail({
	appearance,
	theme,
}: {
	readonly appearance: ContentEditorAppearance;
	readonly theme?: ContentEditorThemeInput;
}) {
	const [value, setValue] = useState<ContentValue | null>(mail);
	return (
		<ContentEditor.Root
			features={FEATURES}
			value={value}
			onChange={setValue}
			appearance={appearance}
			theme={theme}
			variables={VARIABLES}
		>
			<ContentEditor.Layout>
				<ContentEditor.Toolbar />
				<ContentEditor.Canvas />
			</ContentEditor.Layout>
			<ContentEditor.FloatingToolbar />
		</ContentEditor.Root>
	);
}

const noArgs = {
	features: FEATURES,
	value: mail,
	onChange: () => {},
	children: null,
};

/** A page of prose: the kit's font, the prose width, a gap between blocks. */
export const Document: Story = {
	args: noArgs,
	render: () => <Mail appearance="document" />,
};

/** A mail being written, as in Gmail: the theme's font, lines with no gap. */
export const Plain: Story = {
	args: noArgs,
	render: () => <Mail appearance="plain" />,
};

/** The campaign card: the theme's width, colours and font, on its backdrop. */
export const Email: Story = {
	args: noArgs,
	render: () => <Mail appearance="email" />,
};

/** The same card in a host's brand palette and font. */
export const EmailWithTheme: Story = {
	args: noArgs,
	render: () => <Mail appearance="email" theme={BRAND_THEME} />,
};

/** The card views moved from the email block editor, read from the root's theme. */
export const CardViews: Story = {
	args: noArgs,
	render: () => (
		<ContentEditor.Root
			features={FEATURES}
			value={null}
			onChange={() => {}}
			theme={BRAND_THEME}
		>
			<div className="grid max-w-[600px] items-start gap-4 sm:grid-cols-2">
				<EmailCardShell image={{ src: PORTRAIT_IMAGE, alt: "" }}>
					<strong>Meet the coach</strong>
					<EmailCardMeta>By Ana · 12 May</EmailCardMeta>
					<EmailCardButton label="Read the interview" />
				</EmailCardShell>
				<EmailCardShell image={{ src: "", alt: "" }} highlighted>
					<strong>Season pass</strong>
					<EmailCardMeta>€19 / month</EmailCardMeta>
					<EmailCardButton label="Subscribe" />
				</EmailCardShell>
			</div>
		</ContentEditor.Root>
	),
};
