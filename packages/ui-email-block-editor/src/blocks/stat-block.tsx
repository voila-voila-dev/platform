import { ChartBarIcon } from "@phosphor-icons/react";
import type {
	EmailBlockComponentProps,
	EmailBlockDefinition,
} from "#/blocks/block-definitions.tsx";
import { BlockTextInput } from "#/blocks/block-text-input.tsx";
import type {
	EmailEditorAlignment,
	EmailEditorStatBlock,
} from "#/document/types.ts";
import { AlignmentOption } from "#/sections/block-options/alignment-option.tsx";
import { BlockOptionSection } from "#/sections/block-options/block-option-row.tsx";
import {
	TextAreaOption,
	TextOption,
} from "#/sections/block-options/text-option.tsx";
import { EMAIL_COLOR, EMAIL_FONT } from "#/theme.ts";

const TEXT_ALIGN: {
	readonly [A in EmailEditorAlignment]: "left" | "center" | "right";
} = { left: "left", center: "center", right: "right" };

/**
 * One figure with its caption. A row of three is a three-column grid of stat
 * blocks — the block never invents its own multi-column layout (§1.5 of the
 * editor plan). Every field is edited in place.
 */
function StatBlockView({
	block,
	selected,
	onChange,
}: EmailBlockComponentProps<EmailEditorStatBlock>) {
	const textAlign = TEXT_ALIGN[block.align];
	return (
		<div
			className="flex flex-col gap-1"
			style={{ textAlign, fontFamily: EMAIL_FONT }}
		>
			<BlockTextInput
				ariaLabel="Value"
				value={block.value}
				placeholder="128"
				onChange={(value) => onChange({ ...block, value })}
				className="font-bold text-[30px] leading-[1.1]"
				style={{ color: EMAIL_COLOR.brand, textAlign }}
			/>
			<BlockTextInput
				ariaLabel="Label"
				value={block.label}
				placeholder="Projects delivered"
				onChange={(label) => onChange({ ...block, label })}
				className="font-semibold text-[12px] uppercase leading-[1.4] tracking-[0.04em]"
				style={{ color: EMAIL_COLOR.muted, textAlign }}
			/>
			{/* The description is optional, so an empty one only takes up room
			    while the block is selected — otherwise the canvas would show a
			    line the email will not have. */}
			{selected || block.description !== "" ? (
				<BlockTextInput
					ariaLabel="Description"
					value={block.description}
					placeholder="Description (optional)"
					onChange={(description) => onChange({ ...block, description })}
					className="text-[14px] leading-[1.5]"
					style={{ color: EMAIL_COLOR.ink, textAlign }}
				/>
			) : null}
		</div>
	);
}

function StatBlockSettings({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorStatBlock>) {
	return (
		<>
			<BlockOptionSection title="Content">
				<TextOption
					label="Value"
					value={block.value}
					onChange={(value) => onChange({ ...block, value })}
					placeholder="128"
				/>
				<TextOption
					label="Label"
					value={block.label}
					onChange={(label) => onChange({ ...block, label })}
					placeholder="Projects delivered"
				/>
				<TextAreaOption
					label="Description"
					value={block.description}
					onChange={(description) => onChange({ ...block, description })}
					rows={2}
				/>
			</BlockOptionSection>
			<BlockOptionSection title="Appearance">
				<AlignmentOption
					value={block.align}
					onChange={(align) => onChange({ ...block, align })}
				/>
			</BlockOptionSection>
		</>
	);
}

export const statBlockDefinition: EmailBlockDefinition<EmailEditorStatBlock> = {
	label: "Key figure",
	icon: ChartBarIcon,
	View: StatBlockView,
	Settings: StatBlockSettings,
};
