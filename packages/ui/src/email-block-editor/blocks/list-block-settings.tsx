import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "#/button/components/button.tsx";
import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { SelectOption } from "#/email-block-editor/components/block-options/select-option.tsx";
import type {
	EmailEditorListBlock,
	EmailEditorListMarker,
} from "#/email-block-editor/document/types.ts";

const MARKER_OPTIONS: ReadonlyArray<{
	readonly value: EmailEditorListMarker;
	readonly label: string;
}> = [
	{ value: "bullet", label: "Bullet" },
	{ value: "number", label: "Number" },
	{ value: "badge", label: "Numbered badge" },
];

interface Props extends EmailBlockComponentProps<EmailEditorListBlock> {}

/** The settings panel for a list block. */
export function ListBlockSettings({ block, onChange }: Props) {
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
							{item.spans
								.map((span) => span.text)
								.join("")
								.trim() || `Item ${index + 1}`}
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
				Enter starts the next item, Shift+Enter breaks the line inside one.
			</p>
		</>
	);
}
