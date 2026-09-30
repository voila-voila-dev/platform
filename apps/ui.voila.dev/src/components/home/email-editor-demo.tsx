import {
	ContentEditor,
	type ContentValue,
	createEmailFeatures,
} from "@voila.dev/ui/content-editor";
import { useState } from "react";

/** No backend on the homepage: a picked image is served from an object URL. */
async function uploadImage(file: File) {
	return { url: URL.createObjectURL(file) };
}

const FEATURES = createEmailFeatures({ currencies: ["EUR", "USD"] });

const VARIABLES = [
	{ name: "firstName", label: "First name" },
	{ name: "lastName", label: "Last name" },
	{ name: "email", label: "Email" },
];

const text = (value: string) => [{ text: value }];

/**
 * The welcome email seeding the homepage demo: a title with the recipient's
 * name, text, a product card, a button, a row of key figures, a rating and
 * fine print. Enough variety that clicking around feels like the real thing,
 * because it is.
 */
const welcomeEmail: ContentValue = [
	{
		type: "h1",
		children: [
			{ text: "Welcome aboard, " },
			{ type: "variable", name: "firstName", children: [{ text: "" }] },
			{ text: "" },
		],
	},
	{
		type: "p",
		children: [
			{
				text: "Your workspace is live. Invite your team, connect a data source and ",
			},
			{ text: "ship your first project", bold: true },
			{ text: " today. Type / for a block, {{ for a name." },
		],
	},
	{
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
		children: text(""),
	},
	{
		type: "button",
		label: "Open your workspace",
		href: "https://app.example.com",
		variant: "primary",
		align: "center",
		children: text(""),
	},
	{
		type: "columns",
		desktopColumns: 3,
		mobileColumns: 1,
		children: [
			["12k", "teams"],
			["99.9%", "uptime"],
			["4 min", "to set up"],
		].map(([value, label]) => ({
			type: "column",
			children: [
				{
					type: "stat",
					value,
					label,
					description: "",
					align: "center",
					children: text(""),
				},
			],
		})),
	},
	{
		type: "rating",
		style: "filled",
		lowLabel: "Rough",
		highLabel: "Flawless",
		href: "https://app.example.com/feedback",
		children: text("How was your onboarding?"),
	},
	{ type: "hr", children: text("") },
	{
		type: "fine-print",
		children: text("You receive this email because you created an account."),
	},
];

/**
 * The live editor on the homepage: the email preset on the email
 * appearance, with the inspector beside the canvas. The document is plain
 * local state, the same controlled `value`/`onChange` contract an app would
 * persist, and this module is behind `React.lazy` because the editor pulls
 * in Plate.
 */
export default function EmailEditorDemo() {
	const [value, setValue] = useState<ContentValue | null>(welcomeEmail);
	return (
		<ContentEditor.Root
			features={FEATURES}
			value={value}
			onChange={setValue}
			appearance="email"
			variables={VARIABLES}
			onUploadImage={uploadImage}
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
