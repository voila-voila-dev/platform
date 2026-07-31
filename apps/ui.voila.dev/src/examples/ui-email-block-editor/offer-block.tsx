import { Block } from "./fixtures";

export function Offer() {
	return (
		<Block
			initial={{
				id: "offer",
				type: "offer",
				eyebrow: "Most popular",
				name: "Essential",
				description: "The core plan for hiring on repeat.",
				image: { src: "", alt: "" },
				price: { amountInMinorUnits: 2900, currency: "EUR" },
				period: "per month",
				features: [
					"Unlimited projects",
					"Verified freelancers",
					"7-day support",
				],
				buttonLabel: "Choose this plan",
				buttonHref: "https://acme.dev/pricing",
				highlighted: true,
			}}
		/>
	);
}
