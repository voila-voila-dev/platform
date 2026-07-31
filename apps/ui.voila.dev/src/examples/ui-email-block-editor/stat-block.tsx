import { Block } from "./fixtures";

export function Stat() {
	return (
		<Block
			initial={{
				id: "stat",
				type: "stat",
				value: "1,240",
				label: "Projects staffed",
				description: "Over the last twelve months.",
				align: "center",
			}}
		/>
	);
}
