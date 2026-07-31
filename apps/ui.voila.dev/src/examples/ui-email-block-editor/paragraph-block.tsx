import { Block } from "./fixtures";

export function Paragraph() {
	return (
		<Block
			initial={{
				id: "paragraph",
				type: "paragraph",
				spans: [
					{ text: "Browse the " },
					{ text: "latest projects", bold: true },
					{ text: " that match your skills, or head to " },
					{ text: "your workspace", href: "https://app.acme.dev" },
					{ text: "." },
				],
			}}
		/>
	);
}
