import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "#/button/components/button.tsx";
import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { SelectOption } from "#/email-block-editor/components/block-options/select-option.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
import type {
	EmailEditorListBlock,
	EmailEditorListMarker,
} from "#/email-block-editor/document/types.ts";

interface Props extends EmailBlockComponentProps<EmailEditorListBlock> {}

/** The settings panel for a list block. */
export function ListBlockSettings({ block, onChange }: Props) {
	const { blocks } = useEmailEditorLabels();
	const markerOptions: ReadonlyArray<{
		readonly value: EmailEditorListMarker;
		readonly label: string;
	}> = [
		{ value: "bullet", label: blocks.list.markerBullet },
		{ value: "number", label: blocks.list.markerNumber },
		{ value: "badge", label: blocks.list.markerBadge },
	];
	return (
		<>
			<SelectOption
				label={blocks.list.marker}
				value={block.marker}
				options={markerOptions}
				onChange={(marker) => onChange({ ...block, marker })}
			/>
			<div className="flex flex-col gap-2">
				<span className="font-medium text-sm">{blocks.list.items}</span>
				{block.items.map((item, index) => (
					<div
						key={index}
						className="flex items-center justify-between gap-2 text-sm"
					>
						<span className="truncate text-muted-foreground">
							{item.spans
								.map((span) => span.text)
								.join("")
								.trim() || blocks.list.item(index + 1)}
						</span>
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label={blocks.list.removeItem(index + 1)}
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
					{blocks.list.addItem}
				</Button>
			</div>
			<p className="text-muted-foreground text-xs">
				{blocks.list.formattingHint}
			</p>
		</>
	);
}
