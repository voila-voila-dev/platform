import { TagIcon } from "@phosphor-icons/react";
import {
	ContentEditor,
	type ContentMoney,
	type ContentNodeLike,
	type ContentValue,
	createContentFeatures,
	defineElementFeature,
} from "@voila.dev/ui/content-editor";
import { useState } from "react";
import { fakeUploadImage } from "./fixtures";

interface PlanNode extends ContentNodeLike {
	readonly type: "plan";
	readonly name: string;
	readonly period: "month" | "year";
	readonly highlighted: boolean;
	readonly price: ContentMoney;
	readonly perks: ReadonlyArray<string>;
}

function PlanView({ node }: { readonly node: PlanNode }) {
	const price = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: node.price.currency,
	}).format(node.price.amountInMinorUnits / 100);
	return (
		<div
			className={`flex flex-col gap-1 rounded-xl border bg-card p-4 ${node.highlighted ? "border-2 border-primary" : "border-border"}`}
		>
			<strong>{node.name}</strong>
			<span className="text-muted-foreground text-sm">
				{price} / {node.period}
			</span>
			<ul className="list-disc pl-5 text-sm">
				{node.perks.map((perk) => (
					<li key={perk}>{perk}</li>
				))}
			</ul>
		</div>
	);
}

/** One list of fields and one view: the plugin, the canvas, the slash entry and the inspector form follow. */
export const planFeature = defineElementFeature<PlanNode>({
	key: "plan",
	kind: "void",
	node: {
		type: "plan",
		kind: "void",
		Render: ({ node }) => <PlanView node={node} />,
		toHtml: (node) => `<div class="plan">${node.name}</div>`,
	},
	fields: [
		{ type: "text", key: "name", label: "Name" },
		{
			type: "select",
			key: "period",
			label: "Billed",
			options: [
				{ value: "month", label: "Monthly" },
				{ value: "year", label: "Yearly" },
			],
		},
		{ type: "boolean", key: "highlighted", label: "Highlighted" },
		{ type: "money", key: "price", label: "Price", currencies: ["EUR", "USD"] },
		{ type: "string-list", key: "perks", label: "Perk" },
	],
	defaults: {
		name: "Pro",
		period: "month",
		highlighted: false,
		price: { amountInMinorUnits: 1900, currency: "EUR" },
		perks: ["Unlimited documents"],
	},
	view: PlanView,
	insert: { icon: TagIcon, keywords: ["plan", "pricing"] },
});

const FEATURES = [...createContentFeatures(), planFeature];

const initial: ContentValue = [
	{
		type: "p",
		children: [
			{ text: "Click the " },
			{ type: "a", url: "https://ui.voila.dev", children: [{ text: "link" }] },
			{ text: " or the plan below, or type /plan for another one." },
		],
	},
	planFeature.nodes[0].createNode({ name: "Team", highlighted: true }),
	{ type: "p", children: [{ text: "" }] },
];

/** The inspector in a side panel, beside the canvas. */
export function SidePanel() {
	const [value, setValue] = useState<ContentValue | null>(initial);
	return (
		<ContentEditor.Root
			features={FEATURES}
			value={value}
			onChange={setValue}
			onUploadImage={fakeUploadImage}
			labels={{ items: { plan: "Plan" } }}
		>
			<div className="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
				<ContentEditor.Layout>
					<ContentEditor.Toolbar />
					<ContentEditor.Canvas />
				</ContentEditor.Layout>
				<ContentEditor.Inspector className="rounded-lg border border-border p-4" />
			</div>
		</ContentEditor.Root>
	);
}
