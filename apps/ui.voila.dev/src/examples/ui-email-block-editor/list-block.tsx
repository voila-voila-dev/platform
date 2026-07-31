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
						title: "Post your project",
						spans: [{ text: "In two minutes, from your workspace." }],
					},
					{
						title: "Receive proposals",
						spans: [
							{ text: "From " },
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
