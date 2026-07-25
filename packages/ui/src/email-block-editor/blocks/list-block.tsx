import { ListBulletsIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "#/components/button.tsx";
import type {
	EmailBlockComponentProps,
	EmailBlockDefinition,
} from "#/email-block-editor/blocks/block-definitions.tsx";
import { RichTextEditable } from "#/email-block-editor/blocks/rich-text-editable.tsx";
import type {
	EmailEditorListBlock,
	EmailEditorListItem,
	EmailEditorListMarker,
} from "#/email-block-editor/document/types.ts";
import { SelectOption } from "#/email-block-editor/sections/block-options/select-option.tsx";
import { EMAIL_COLOR, EMAIL_FONT } from "#/email-block-editor/theme.ts";

const MARKER_OPTIONS: ReadonlyArray<{
	readonly value: EmailEditorListMarker;
	readonly label: string;
}> = [
	{ value: "bullet", label: "Bullet" },
	{ value: "number", label: "Number" },
	{ value: "badge", label: "Numbered badge" },
];

/** The marker shown before an item, mirroring the domain `emailList`. */
function ListMarker({
	marker,
	index,
}: {
	marker: EmailEditorListMarker;
	index: number;
}) {
	if (marker === "badge") {
		return (
			<span
				className="flex size-6 shrink-0 items-center justify-center rounded-full font-semibold text-[12px] text-white"
				style={{ backgroundColor: EMAIL_COLOR.brand }}
				aria-hidden
			>
				{index + 1}
			</span>
		);
	}
	return (
		<span
			className="w-6 shrink-0 text-[16px] leading-[1.6]"
			style={{ color: EMAIL_COLOR.muted }}
			aria-hidden
		>
			{marker === "number" ? `${index + 1}.` : "•"}
		</span>
	);
}

/**
 * A bulleted, numbered or badge list. Each item is the same rich-text surface
 * the paragraph uses, so the toolbar's bold/italic/underline/link controls act
 * on the focused item with no extra wiring. The optional bold lead-in stays
 * out of the way until the item is hovered or focused.
 */
function ListBlockView({
	block,
	selected,
	onChange,
}: EmailBlockComponentProps<EmailEditorListBlock>) {
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

/**
 * One entry. The lead-in is optional, so an empty one only takes up room while
 * the block is selected — otherwise the canvas would not match the email.
 * Selection (not hover) drives it, so the field is reachable on a touch screen.
 */
function ListItemRow({
	item,
	index,
	marker,
	showTitle,
	onChange,
}: {
	item: EmailEditorListItem;
	index: number;
	marker: EmailEditorListMarker;
	showTitle: boolean;
	onChange: (item: EmailEditorListItem) => void;
}) {
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

function ListBlockSettings({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorListBlock>) {
	return (
		<>
			<SelectOption
				label="Marker"
				value={block.marker}
				options={MARKER_OPTIONS}
				onChange={(marker) => onChange({ ...block, marker })}
			/>
			<div className="flex flex-col gap-2">
				<span className="font-medium text-sm">Items</span>
				{block.items.map((item, index) => (
					<div
						key={index}
						className="flex items-center justify-between gap-2 text-sm"
					>
						<span className="truncate text-muted-foreground">
							{item.title?.trim() ||
								item.spans
									.map((span) => span.text)
									.join("")
									.trim() ||
								`Item ${index + 1}`}
						</span>
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label={`Remove item ${index + 1}`}
							disabled={block.items.length === 1}
							onClick={() =>
								onChange({
									...block,
									items: block.items.filter((_, at) => at !== index),
								})
							}
						>
							<XIcon aria-hidden />
						</Button>
					</div>
				))}
				<Button
					variant="outline"
					size="sm"
					onClick={() =>
						onChange({ ...block, items: [...block.items, { spans: [] }] })
					}
				>
					<PlusIcon aria-hidden />
					Add an item
				</Button>
			</div>
			<p className="text-muted-foreground text-xs">
				Each item's text is formatted from the block toolbar, like a paragraph.
			</p>
		</>
	);
}

export const listBlockDefinition: EmailBlockDefinition<EmailEditorListBlock> = {
	label: "List",
	icon: ListBulletsIcon,
	View: ListBlockView,
	Settings: ListBlockSettings,
};
