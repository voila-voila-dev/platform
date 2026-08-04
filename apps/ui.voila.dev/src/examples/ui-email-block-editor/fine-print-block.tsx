import { Block } from "./fixtures";

export function FinePrint() {
	return (
		<Block
			initial={{
				id: "fine-print",
				type: "finePrint",
				spans: [
					{
						text: "LAUNCH10: 10% off the order total, valid until August 31 at 11:59pm. One use per customer. See the ",
					},
					{ text: "terms and conditions", href: "https://acme.dev/terms" },
					{ text: "." },
				],
			}}
		/>
	);
}
