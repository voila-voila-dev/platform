import { ListMarker } from "#/email-block-editor/blocks/list-marker.tsx";
import { RichTextEditable } from "#/email-block-editor/blocks/rich-text-editable.tsx";
import type {
	EmailEditorListItem,
	EmailEditorListMarker,
} from "#/email-block-editor/document/types.ts";
import { EMAIL_COLOR, EMAIL_FONT } from "#/email-block-editor/theme.ts";

interface Props {
	item: EmailEditorListItem;
	index: number;
	marker: EmailEditorListMarker;
	showTitle: boolean;
	onChange: (item: EmailEditorListItem) => void;
}

/**
 * One entry. The lead-in is optional, so an empty one only takes up room while
 * the block is selected — otherwise the canvas would not match the email.
 * Selection (not hover) drives it, so the field is reachable on a touch screen.
 */
export function ListItemRow({
	item,
	index,
	marker,
	showTitle,
	onChange,
}: Props) {
	return (
		<li className="flex items-start gap-2">
			<ListMarker marker={marker} index={index} />
			<div className="flex min-w-0 flex-1 flex-col">
				{showTitle ? (
					<input
						aria-label={`Item ${index + 1} title`}
						value={item.title ?? ""}
						placeholder="Title (optional)"
						onChange={(event) =>
							onChange({ ...item, title: event.target.value })
						}
						className="max-w-full border-none bg-transparent p-0 font-semibold text-[16px] leading-[1.6] outline-none [field-sizing:content] placeholder:opacity-30"
						style={{ fontFamily: EMAIL_FONT, color: EMAIL_COLOR.ink }}
					/>
				) : null}
				<RichTextEditable
					spans={item.spans}
					onChange={(spans) => onChange({ ...item, spans })}
					ariaLabel={`Item ${index + 1}`}
					placeholder="Your text"
					className="text-[16px] leading-[1.6]"
					style={{ fontFamily: EMAIL_FONT, color: EMAIL_COLOR.ink }}
				/>
			</div>
		</li>
	);
}
