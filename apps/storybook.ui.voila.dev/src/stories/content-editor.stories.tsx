import { ChartLineUpIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	ContentEditor,
	ContentEditorField,
	type ContentFeature,
	ContentRenderer,
	type ContentValue,
	contentToHtml,
	contentToMarkdown,
	createContentFeatures,
	createContentReaders,
	createInlineContentFeatures,
} from "@voila.dev/ui/content-editor";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { useState } from "react";
import {
	fakeUploadImage,
	frenchLabels,
	inlineContent,
	sampleContent,
} from "./content-editor-fixtures.ts";

const FEATURES = createContentFeatures();
const INLINE_FEATURES = createInlineContentFeatures();
const READERS = createContentReaders();

const meta = {
	title: "ContentEditor/ContentEditor",
	component: ContentEditorField,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
} satisfies Meta<typeof ContentEditorField>;

export default meta;

type Story = StoryObj<typeof meta>;

function Composed({
	initial = sampleContent,
}: {
	readonly initial?: ContentValue;
}) {
	const [value, setValue] = useState<ContentValue | null>(initial);
	return (
		<ContentEditorField
			features={FEATURES}
			value={value}
			onChange={setValue}
			onUploadImage={fakeUploadImage}
			stickyToolbar
			count
		/>
	);
}

export const Default: Story = {
	args: { features: FEATURES, value: sampleContent, onChange: () => {} },
	render: () => <Composed />,
};

export const Empty: Story = {
	args: { features: FEATURES, value: null, onChange: () => {} },
	render: () => <Composed initial={[]} />,
};

/** No toolbar: the floating toolbar over a selection and the slash menu are the whole chrome. */
export const WithoutToolbar: Story = {
	args: {
		features: FEATURES,
		value: sampleContent,
		onChange: () => {},
		toolbar: false,
	},
	render: () => {
		const [value, setValue] = useState<ContentValue | null>(sampleContent);
		return (
			<ContentEditorField
				features={FEATURES}
				value={value}
				onChange={setValue}
				toolbar={false}
				onUploadImage={fakeUploadImage}
			/>
		);
	},
};

/** A single line: marks and links, Enter swallowed, one paragraph enforced. */
export const SingleLine: Story = {
	args: {
		features: INLINE_FEATURES,
		value: inlineContent,
		onChange: () => {},
		mode: "single-line",
	},
	render: () => {
		const [value, setValue] = useState<ContentValue | null>(inlineContent);
		return (
			<div className="max-w-md">
				<ContentEditorField
					features={INLINE_FEATURES}
					mode="single-line"
					value={value}
					onChange={setValue}
					toolbar={false}
				/>
			</div>
		);
	},
};

/** The parts composed by hand: a toolbar of two groups, the canvas, no count. */
export const ComposedByHand: Story = {
	args: { features: FEATURES, value: sampleContent, onChange: () => {} },
	render: () => {
		const [value, setValue] = useState<ContentValue | null>(sampleContent);
		return (
			<ContentEditor.Root
				features={FEATURES}
				value={value}
				onChange={setValue}
				onUploadImage={fakeUploadImage}
			>
				<ContentEditor.Layout>
					<ContentEditor.Toolbar>
						<ContentEditor.ToolbarGroup
							items={FEATURES.flatMap(
								(feature) => feature.toolbar ?? [],
							).filter((item) => item.group === "text")}
						/>
						<ContentEditor.ToolbarGroup
							items={FEATURES.flatMap(
								(feature) => feature.toolbar ?? [],
							).filter((item) => item.group === "block")}
						/>
					</ContentEditor.Toolbar>
					<ContentEditor.Canvas />
				</ContentEditor.Layout>
				<ContentEditor.FloatingToolbar />
			</ContentEditor.Root>
		);
	},
};

/** The stored document rendered for a reader, next to the HTML the server would emit. */
export const ReadOnly: Story = {
	args: { features: FEATURES, value: sampleContent, onChange: () => {} },
	render: () => (
		<div className="grid gap-6 lg:grid-cols-2">
			<ContentRenderer
				value={sampleContent}
				features={READERS}
				render={<article className="text-sm" />}
			/>
			<pre className="overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
				{contentToHtml(sampleContent, { features: READERS })}
			</pre>
		</div>
	),
};

/** The same document as Markdown, MDX elements for what Markdown cannot say. */
export const Markdown: Story = {
	args: { features: FEATURES, value: sampleContent, onChange: () => {} },
	render: () => (
		<pre className="overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
			{contentToMarkdown(sampleContent, { features: FEATURES })}
		</pre>
	),
};

/** A host feature: one definition gives it a plugin, a canvas element, a toolbar and slash item, and a renderer. */
interface StockQuoteNode {
	readonly type: "stock-quote";
	readonly symbol: string;
	readonly children: ContentValue[number]["children"];
	readonly [key: string]: unknown;
}

function StockQuoteElement(props: PlateElementProps) {
	const node = props.element as unknown as StockQuoteNode;
	return (
		<PlateElement {...props}>
			<div
				contentEditable={false}
				className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-sm"
			>
				<ChartLineUpIcon aria-hidden /> {node.symbol}
			</div>
			{props.children}
		</PlateElement>
	);
}

const stockQuoteFeature: ContentFeature = {
	key: "stock-quote",
	nodes: [
		{
			type: "stock-quote",
			kind: "void",
			createNode: (init) => ({
				type: "stock-quote",
				symbol: "ACME",
				children: [{ text: "" }],
				...init,
			}),
			Render: ({ node }) => (
				<div className="font-mono">{(node as StockQuoteNode).symbol}</div>
			),
			toHtml: (node) =>
				`<span class="stock-quote">${(node as StockQuoteNode).symbol}</span>`,
		},
	],
	plugins: () => [],
	components: { "stock-quote": StockQuoteElement },
	toolbar: [
		{
			key: "stockQuote",
			group: "insert",
			icon: ChartLineUpIcon,
			label: "stockQuote",
			run: (editor) =>
				editor.tf.insertNodes([
					{ type: "stock-quote", symbol: "ACME", children: [{ text: "" }] },
					{ type: "p", children: [{ text: "" }] },
				] as never),
		},
	],
	slash: [
		{
			key: "stockQuote",
			icon: ChartLineUpIcon,
			label: "stockQuote",
			keywords: ["stock", "quote", "ticker"],
			run: (editor) =>
				editor.tf.insertNodes([
					{ type: "stock-quote", symbol: "ACME", children: [{ text: "" }] },
					{ type: "p", children: [{ text: "" }] },
				] as never),
		},
	],
};

export const CustomFeature: Story = {
	args: { features: FEATURES, value: sampleContent, onChange: () => {} },
	render: () => {
		const [value, setValue] = useState<ContentValue | null>([
			{
				type: "p",
				children: [
					{ text: "Insert a stock quote from the toolbar or with /stock." },
				],
			},
		]);
		return (
			<ContentEditorField
				features={[...FEATURES, stockQuoteFeature]}
				value={value}
				onChange={setValue}
				labels={{ items: { stockQuote: "Stock quote" } }}
			/>
		);
	},
};

export const FrenchLabels: Story = {
	args: {
		features: FEATURES,
		value: sampleContent,
		onChange: () => {},
		labels: frenchLabels,
	},
	render: () => {
		const [value, setValue] = useState<ContentValue | null>(sampleContent);
		return (
			<ContentEditorField
				features={FEATURES}
				value={value}
				onChange={setValue}
				labels={frenchLabels}
				onUploadImage={fakeUploadImage}
			/>
		);
	},
};

export const ReadOnlyEditor: Story = {
	args: {
		features: FEATURES,
		value: sampleContent,
		onChange: () => {},
		readOnly: true,
	},
	render: () => (
		<ContentEditorField
			features={FEATURES}
			value={sampleContent}
			onChange={() => {}}
			readOnly
		/>
	),
};
