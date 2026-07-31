import { Block } from "./fixtures";

export function Heading() {
	return (
		<Block
			initial={{
				id: "heading",
				type: "heading",
				text: "Hello {{firstName}}!",
				level: 1,
			}}
		/>
	);
}
