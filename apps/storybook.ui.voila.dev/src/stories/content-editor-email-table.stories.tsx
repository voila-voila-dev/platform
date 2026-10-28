import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	ContentEditor,
	type ContentNodeLike,
	type ContentTableColumnAlign,
} from "@voila.dev/ui/content-editor";
import {
	CardEditor,
	noArgs,
	paragraph,
} from "./content-editor-card-fixtures.tsx";

const meta = {
	title: "ContentEditor/Blocks/EmailTable",
	component: ContentEditor.Root,
	parameters: { layout: "padded" },
	args: noArgs,
} satisfies Meta<typeof ContentEditor.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const row = (
	type: "td" | "th",
	cells: ReadonlyArray<string>,
): ContentNodeLike => ({
	type: "tr",
	children: cells.map((text) => ({ type, children: [paragraph(text)] })),
});

function emailTable(
	headerRow: boolean,
	aligns: ReadonlyArray<ContentTableColumnAlign>,
	rows: ReadonlyArray<ReadonlyArray<string>>,
): ContentNodeLike {
	return {
		type: "table",
		headerRow,
		columns: aligns.map((align) => ({ align })),
		children: rows.map((cells, index) =>
			row(headerRow && index === 0 ? "th" : "td", cells),
		),
	};
}

const ORDER = [
	["Item", "Qty", "Price"],
	["Home jersey", "2", "€98.00"],
	["Training shorts", "1", "€25.00"],
	["Total", "", "€123.00"],
];

/** An order recap: titled columns, the figures aligned right. */
export const HeaderRow: Story = {
	render: () => (
		<CardEditor
			initial={[
				paragraph("Your order:"),
				emailTable(true, ["left", "right", "right"], ORDER),
				paragraph(""),
			]}
		/>
	),
};

/** No header row: a schedule reads as plain lines. */
export const WithoutHeaderRow: Story = {
	render: () => (
		<CardEditor
			initial={[
				emailTable(
					false,
					["left", "right"],
					[
						["Saturday", "9:00 – 12:00"],
						["Sunday", "10:00 – 13:00"],
					],
				),
				paragraph(""),
			]}
		/>
	),
};

/** Every column aligned left. */
export const AllLeft: Story = {
	render: () => (
		<CardEditor
			initial={[
				emailTable(true, ["left", "left", "left"], ORDER),
				paragraph(""),
			]}
		/>
	),
};
