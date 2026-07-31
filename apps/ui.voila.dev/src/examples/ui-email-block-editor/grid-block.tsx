import {
	EMAIL_BLOCK_DEFINITIONS,
	type EmailEditorBlock,
	type EmailEditorGridBlock,
	type EmailEditorLeafBlock,
	emailBlockDefinition,
} from "@voila.dev/ui/email-block-editor";
import { useState } from "react";
import { EmailCard } from "./fixtures";

/**
 * The grid is a container: the canvas composes its cells and slots them in as
 * `children`. Here the cells are two plain leaf blocks, which is enough to show
 * the layout the block owns.
 */
export function Grid() {
	const [block, setBlock] = useState<EmailEditorGridBlock>({
		id: "grid",
		type: "grid",
		desktopColumns: 2,
		mobileColumns: 1,
		children: [
			{
				id: "grid-stat-1",
				type: "stat",
				value: "1,240",
				label: "Projects staffed",
				description: "",
				align: "center",
			},
			{
				id: "grid-stat-2",
				type: "stat",
				value: "4.8 / 5",
				label: "Average rating",
				description: "",
				align: "center",
			},
		],
	});
	return (
		<EmailCard>
			<EMAIL_BLOCK_DEFINITIONS.grid.View
				block={block}
				selected={false}
				onChange={setBlock}
			>
				{block.children.map((child) => (
					<GridCell key={child.id} block={child} />
				))}
			</EMAIL_BLOCK_DEFINITIONS.grid.View>
		</EmailCard>
	);
}

function GridCell({ block: initial }: { block: EmailEditorLeafBlock }) {
	const [block, setBlock] = useState<EmailEditorBlock>(initial);
	const definition = emailBlockDefinition(block);
	return <definition.View block={block} selected={false} onChange={setBlock} />;
}
