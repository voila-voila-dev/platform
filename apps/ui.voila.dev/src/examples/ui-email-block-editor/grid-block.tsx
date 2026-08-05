import type {
	EmailEditorBuiltInBlock,
	EmailEditorBuiltInLeafBlock,
	EmailEditorGridBlock,
} from "@voila.dev/ui/email-block-editor";
import { useState } from "react";
import { DOCS_EMAIL_REGISTRY } from "./blocks";
import { EmailCard } from "./fixtures";

const gridDefinition = DOCS_EMAIL_REGISTRY.definitionFor("grid");

/**
 * The grid is a container: the canvas composes its cells and slots them in as
 * `children`. Here the cells are two plain leaf blocks, which is enough to show
 * the layout the block owns.
 */
export function Grid() {
	const [block, setBlock] = useState<
		EmailEditorGridBlock<EmailEditorBuiltInLeafBlock>
	>({
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
	if (gridDefinition === undefined) {
		return null;
	}
	return (
		<EmailCard>
			<gridDefinition.View block={block} selected={false} onChange={setBlock}>
				{block.children.map((child) => (
					<GridCell key={child.id} block={child} />
				))}
			</gridDefinition.View>
		</EmailCard>
	);
}

function GridCell({ block: initial }: { block: EmailEditorBuiltInLeafBlock }) {
	const [block, setBlock] = useState<EmailEditorBuiltInBlock>(initial);
	const definition = DOCS_EMAIL_REGISTRY.definitionFor(block.type);
	return definition === undefined ? null : (
		<definition.View block={block} selected={false} onChange={setBlock} />
	);
}
