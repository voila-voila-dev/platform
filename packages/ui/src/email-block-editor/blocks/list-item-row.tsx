import { useEffect, useRef } from "react";
import { ListMarker } from "#/email-block-editor/blocks/list-marker.tsx";
import { RichTextEditable } from "#/email-block-editor/blocks/rich-text-editable.tsx";
import { useEmailEditorTheme } from "#/email-block-editor/context/email-editor-context.tsx";
import type {
	EmailEditorListItem,
	EmailEditorListMarker,
} from "#/email-block-editor/document/types.ts";

interface Props {
	item: EmailEditorListItem;
	index: number;
	marker: EmailEditorListMarker;
	/** True for one render, right after this row was created by Enter. */
	focused: boolean;
	onFocused: () => void;
	onChange: (item: EmailEditorListItem) => void;
	onEnter: () => void;
}

/** One entry: its marker, then the rich text. */
export function ListItemRow({
	item,
	index,
	marker,
	focused,
	onFocused,
	onChange,
	onEnter,
}: Props) {
	const theme = useEmailEditorTheme();
	const editableRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (focused) {
			editableRef.current?.focus();
			onFocused();
		}
	}, [focused, onFocused]);

	return (
		<li className="flex items-start gap-2">
			<ListMarker marker={marker} index={index} />
			<RichTextEditable
				editableRef={editableRef}
				spans={item.spans}
				onChange={(spans) => onChange({ ...item, spans })}
				onEnter={onEnter}
				ariaLabel={`Item ${index + 1}`}
				placeholder="Your text"
				className="min-w-0 flex-1 text-[16px] leading-[1.6]"
				style={{ fontFamily: theme.font, color: theme.color.ink }}
			/>
		</li>
	);
}
