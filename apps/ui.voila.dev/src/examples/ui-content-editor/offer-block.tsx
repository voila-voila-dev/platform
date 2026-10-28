import { offerFeature } from "@voila.dev/ui/content-editor";
import { CardEditor } from "./card-editor";

const [offer] = offerFeature.nodes;

export function Offer() {
	return (
		<CardEditor
			initial={[
				offer.createNode({
					eyebrow: "Most popular",
					name: "Pro",
					description: "For teams that ship every week.",
					price: { amountInMinorUnits: 2900, currency: "EUR" },
					period: "per month",
					features: ["Unlimited projects", "Priority support", "Custom domain"],
					buttonLabel: "Choose Pro",
					buttonHref: "https://acme.dev/pricing/pro",
					highlighted: true,
				}),
				{ type: "p", children: [{ text: "" }] },
			]}
		/>
	);
}
