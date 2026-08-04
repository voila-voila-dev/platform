import { Block } from "./fixtures";

export function List() {
	return (
		<Block
			initial={{
				id: "list",
				type: "list",
				marker: "badge",
				items: [
					{
						spans: [
							{ text: "Post your project", bold: true },
							{ text: " in two minutes, from your workspace." },
						],
					},
					{
						spans: [
							{ text: "Receive proposals from " },
							{ text: "verified", bold: true },
							{ text: " freelancers, within hours." },
						],
					},
					{ spans: [{ text: "Pay once the project is delivered." }] },
				],
			}}
		/>
	);
}
