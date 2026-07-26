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
 * on the focused item with no extra wiring. The optional bold lead-in stays
 * out of the way until the item is hovered or focused.
 */
export function ListBlockView({ block, selected, onChange }: Props) {
	const replaceItem = (index: number, item: EmailEditorListItem) =>
		onChange({
			...block,
			items: block.items.map((current, at) => (at === index ? item : current)),
		});

	return (
		<ul className="flex list-none flex-col gap-2 p-0">
			{block.items.map((item, index) => (
				<ListItemRow
					key={index}
					item={item}
					index={index}
					marker={block.marker}
					showTitle={selected || (item.title ?? "") !== ""}
					onChange={(next) => replaceItem(index, next)}
				/>
			))}
		</ul>
	);
}
