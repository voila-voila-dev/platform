import { ChartLineUpIcon } from "@phosphor-icons/react";
import {
	ContentEditorField,
	type ContentFeature,
	type ContentValue,
	createContentFeatures,
	newContentNodeId,
} from "@voila.dev/ui/content-editor";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { useState } from "react";

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

const insertStockQuote = (
	editor: Parameters<NonNullable<ContentFeature["toolbar"]>[number]["run"]>[0],
) =>
	editor.tf.insertNodes([
		{
			id: newContentNodeId(),
			type: "stock-quote",
			symbol: "ACME",
			children: [{ text: "" }],
		},
		{ id: newContentNodeId(), type: "p", children: [{ text: "" }] },
	] as never);

/** One definition: plugin, canvas element, toolbar and slash item, reader. */
export const stockQuoteFeature: ContentFeature = {
	key: "stock-quote",
	nodes: [
		{
			type: "stock-quote",
			kind: "void",
			createNode: (init) => ({
				id: newContentNodeId(),
				type: "stock-quote",
				symbol: "ACME",
				children: [{ text: "" }],
				...init,
			}),
			Render: ({ node }) => (
				<span className="font-mono">{(node as StockQuoteNode).symbol}</span>
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
			run: insertStockQuote,
		},
	],
	slash: [
		{
			key: "stockQuote",
			icon: ChartLineUpIcon,
			label: "stockQuote",
			keywords: ["stock", "ticker"],
			run: insertStockQuote,
		},
	],
};

const FEATURES = [...createContentFeatures(), stockQuoteFeature];

export function WithStockQuote() {
	const [value, setValue] = useState<ContentValue | null>([
		{
			type: "p",
			children: [
				{ text: "Insert a stock quote from the toolbar, or type /stock." },
			],
		},
	]);
	return (
		<ContentEditorField
			features={FEATURES}
			value={value}
			onChange={setValue}
			labels={{ items: { stockQuote: "Stock quote" } }}
		/>
	);
}
