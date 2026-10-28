import { TagIcon } from "@phosphor-icons/react";
import {
	type ContentMoney,
	type ContentNodeLike,
	type ContentValue,
	defineElementFeature,
} from "@voila.dev/ui/content-editor";
import { PORTRAIT_IMAGE } from "../fixtures/portrait-image";

/** A demo element with one field of every type, so one story exercises them all. */
interface PlanNode extends ContentNodeLike {
	readonly type: "plan";
	readonly name: string;
	readonly image: string;
	readonly href: string;
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
			className={`overflow-hidden rounded-xl border bg-card ${node.highlighted ? "border-2 border-primary" : "border-border"}`}
		>
			{node.image ? (
				<img
					src={node.image}
					alt=""
					className="block h-32 w-full object-cover"
				/>
			) : null}
			<div className="flex flex-col gap-1 p-4">
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
		</div>
	);
}

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
		{ type: "image", key: "image", label: "Picture", aspectRatio: 3 },
		{ type: "url", key: "href", label: "Link", placeholder: "https://" },
		{
			type: "select",
			key: "period",
			label: "Billed",
			options: [
				{ value: "month", label: "Monthly" },
				{ value: "year", label: "Yearly" },
			],
		},
		{
			type: "boolean",
			key: "highlighted",
			label: "Highlighted",
			description: "Draws a brand border around the card.",
		},
		{ type: "money", key: "price", label: "Price", currencies: ["EUR", "USD"] },
		{ type: "string-list", key: "perks", label: "Perk" },
	],
	defaults: {
		name: "Pro",
		image: "",
		href: "",
		period: "month",
		highlighted: false,
		price: { amountInMinorUnits: 1900, currency: "EUR" },
		perks: ["Unlimited documents"],
	},
	view: PlanView,
	insert: { icon: TagIcon, keywords: ["plan", "pricing", "offer"] },
});

export const inspectorContent: ContentValue = [
	{
		type: "p",
		children: [
			{ text: "Click the " },
			{ type: "a", url: "https://ui.voila.dev", children: [{ text: "link" }] },
			{ text: ", the picture or the plan: the inspector shows its fields." },
		],
	},
	{
		type: "image",
		url: PORTRAIT_IMAGE,
		alt: "A portrait",
		caption: "Captions are a field too.",
		children: [{ text: "" }],
	},
	planFeature.nodes[0].createNode({
		name: "Team",
		highlighted: true,
		perks: ["Unlimited documents", "Priority support"],
	}),
	{ type: "p", children: [{ text: "" }] },
];
