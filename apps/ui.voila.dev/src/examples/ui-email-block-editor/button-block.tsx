import { Block } from "./fixtures";

export function ButtonBlock() {
	return (
		<Block
			initial={{
				id: "button",
				type: "button",
				label: "Browse projects",
				href: "https://app.acme.dev/projects",
				align: "center",
				variant: "primary",
			}}
		/>
	);
}
