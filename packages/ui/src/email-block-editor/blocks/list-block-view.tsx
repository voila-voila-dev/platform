import { useState } from "react";
import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { ListItemRow } from "#/email-block-editor/blocks/list-item-row.tsx";
import type {
	EmailEditorListBlock,
	EmailEditorListItem,
} from "#/email-block-editor/document/types.ts";

interface Props extends EmailBlockComponentProps<EmailEditorListBlock> {}

/**
 * A bulleted, numbered or badge list. Each item is the same rich-text surface
 * the paragraph uses, so the toolbar's bold/italic/underline/link controls act
 * on the focused item with no extra wiring, and Enter carries on down the list
 * the way it does in any editor.
 */
export function ListBlockView({ block, onChange }: Props) {
	// Which item to put the caret in once the parent echoes the change back —
	// the row it names does not exist yet at the time Enter is pressed.
	const [itemToFocus, setItemToFocus] = useState<number | null>(null);

	const replaceItem = (index: number, item: EmailEditorListItem) =>
		onChange({
			...block,
			items: block.items.map((current, at) => (at === index ? item : current)),
		});

	const insertItemAfter = (index: number) => {
		onChange({
			...block,
			items: [
				...block.items.slice(0, index + 1),
				{ spans: [] },
				...block.items.slice(index + 1),
			],
		});
		setItemToFocus(index + 1);
	};

	return (
		<ul className="flex list-none flex-col gap-2 p-0">
			{block.items.map((item, index) => (
				<ListItemRow
					key={index}
					item={item}
					index={index}
					marker={block.marker}
					focused={itemToFocus === index}
					onFocused={() => setItemToFocus(null)}
					onChange={(next) => replaceItem(index, next)}
					onEnter={() => insertItemAfter(index)}
				/>
			))}
		</ul>
	);
}
