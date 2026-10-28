import { productFeature } from "@voila.dev/ui/content-editor";
import { CardEditor } from "./card-editor";

const [product] = productFeature.nodes;

export function Product() {
	return (
		<CardEditor
			initial={[
				product.createNode({
					name: "Pro plan, 12 months",
					description: "Unlimited projects and priority support.",
					image: { src: "https://placehold.co/536x200/png", alt: "Pro plan" },
					price: { amountInMinorUnits: 19900, currency: "EUR" },
					compareAtPrice: { amountInMinorUnits: 23900, currency: "EUR" },
					href: "https://acme.dev/pricing",
					buttonLabel: "Upgrade",
				}),
				{ type: "p", children: [{ text: "" }] },
			]}
		/>
	);
}
