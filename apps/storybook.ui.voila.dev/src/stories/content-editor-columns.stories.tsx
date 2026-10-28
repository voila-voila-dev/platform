import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	type ContentColumnsDesktopCount,
	type ContentColumnsMobileCount,
	ContentEditor,
	type ContentEditorAppearance,
	type ContentValue,
	columnsFeature,
	createContentFeatures,
} from "@voila.dev/ui/content-editor";
import { useState } from "react";

const FEATURES = [...createContentFeatures(), columnsFeature];

const WORDS = ["Coaching", "Recovery", "Nutrition", "Mobility"];

const row = (
	desktopColumns: ContentColumnsDesktopCount,
	mobileColumns: ContentColumnsMobileCount = 1,
) => ({
	type: "columns",
	desktopColumns,
	mobileColumns,
	children: WORDS.slice(0, desktopColumns).map((word) => ({
		type: "column",
		children: [
			{ type: "h3", children: [{ text: word }] },
			{
				type: "p",
				children: [{ text: `A short line about ${word.toLowerCase()}.` }],
			},
		],
	})),
});

const oneToFour: ContentValue = [
	{ type: "p", children: [{ text: "One to four columns, one row each." }] },
	row(1),
	row(2),
	row(3),
	row(4),
	{ type: "p", children: [{ text: "Type / and pick Columns to add a row." }] },
];

const twoOnMobile: ContentValue = [
	{
		type: "p",
		children: [{ text: "Four columns on desktop, two on a phone." }],
	},
	row(4, 2),
	{ type: "p", children: [{ text: "One column on a phone." }] },
	row(3, 1),
];

const meta = {
	title: "ContentEditor/Columns",
	component: ContentEditor.Root,
	parameters: { layout: "padded" },
} satisfies Meta<typeof ContentEditor.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

function Editor({
	initial,
	appearance,
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
		>
			<div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
				<ContentEditor.Layout>
					<ContentEditor.Toolbar />
					<ContentEditor.Canvas />
				</ContentEditor.Layout>
				<ContentEditor.Inspector className="rounded-lg border border-border p-4 md:sticky md:top-4" />
			</div>
			<ContentEditor.FloatingToolbar />
		</ContentEditor.Root>
	);
}

/** The stories render their own editor; these only satisfy the root's props. */
const noArgs = {
	features: FEATURES,
	value: oneToFour,
	onChange: () => {},
	children: null,
};

/** Rows of one to four columns. Click in one to set its counts, add,
 * remove or reorder its columns in the inspector. */
export const OneToFour: Story = {
	args: noArgs,
	render: () => <Editor initial={oneToFour} />,
};

/** On a phone the columns stack into the mobile count. */
export const Mobile: Story = {
	args: noArgs,
	parameters: { viewport: { defaultViewport: "mobile1" } },
	render: () => <Editor initial={twoOnMobile} />,
};

/** In the email card, as the recipient reads it. */
export const Email: Story = {
	args: noArgs,
	render: () => <Editor initial={twoOnMobile} appearance="email" />,
};
