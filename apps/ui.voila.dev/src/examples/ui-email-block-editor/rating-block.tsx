import { Block } from "./fixtures";

export function Rating() {
	return (
		<Block
			initial={{
				id: "rating",
				type: "rating",
				question: [{ text: "How did your latest project go?" }],
				style: "filled",
				lowLabel: "Not at all",
				highLabel: "Absolutely",
				href: "https://acme.dev/reviews",
			}}
		/>
	);
}
