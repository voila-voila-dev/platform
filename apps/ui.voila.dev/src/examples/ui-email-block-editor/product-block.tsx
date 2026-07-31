import { Block } from "./fixtures";

export function Product() {
	return (
		<Block
			initial={{
				id: "product",
				type: "product",
				name: "Acme brand kit template",
				description: "Logo, palette, and type specimen.",
				image: { src: "https://placehold.co/536x180/png", alt: "Kit" },
				price: { amountInMinorUnits: 5990, currency: "EUR" },
				compareAtPrice: { amountInMinorUnits: 7990, currency: "EUR" },
				href: "https://shop.acme.dev/brand-kit-template",
				buttonLabel: "Buy now",
			}}
		/>
	);
}
