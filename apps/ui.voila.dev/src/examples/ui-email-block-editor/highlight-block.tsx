import { Block } from "./fixtures";

export function Highlight() {
	return (
		<Block
			initial={{
				id: "highlight",
				type: "highlight",
				text: "🎁 10% off everything with the code LAUNCH10, until August 31",
				align: "center",
			}}
		/>
	);
}
