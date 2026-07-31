import { Block } from "./fixtures";

export function Table() {
	return (
		<Block
			initial={{
				id: "table",
				type: "table",
				headerRow: true,
				columns: [
					{ label: "Service", align: "left" },
					{ label: "Duration", align: "left" },
					{ label: "Rate", align: "right" },
				],
				rows: [
					["Design review", "1 h", "$60.00"],
					["Code audit", "45 min", "$55.00"],
					["Kickoff call", "30 min", "$40.00"],
				],
			}}
		/>
	);
}
