import {
	TextAlignCenterIcon,
	TextAlignLeftIcon,
	TextAlignRightIcon,
} from "@phosphor-icons/react";
import type { EmailEditorAlignment } from "#/document/types.ts";
import { SegmentedOption } from "#/sections/block-options/segmented-option.tsx";

const ALIGNMENTS: ReadonlyArray<{
	readonly value: EmailEditorAlignment;
	readonly label: string;
	readonly icon: React.ReactNode;
}> = [
	{
		value: "left",
		label: "Aligner à gauche",
		icon: <TextAlignLeftIcon aria-hidden />,
	},
	{
		value: "center",
		label: "Centrer",
		icon: <TextAlignCenterIcon aria-hidden />,
	},
	{
		value: "right",
		label: "Aligner à droite",
		icon: <TextAlignRightIcon aria-hidden />,
	},
];

/**
 * The one alignment control. Every block that can be aligned uses this exact
 * segmented control, so « Alignement » means the same thing and looks the same
 * everywhere (§1.2 of the editor plan).
 */
export function AlignmentOption({
	label = "Alignement",
	value,
	onChange,
}: {
	label?: string;
	value: EmailEditorAlignment;
	onChange: (alignment: EmailEditorAlignment) => void;
}) {
	return (
		<SegmentedOption
			label={label}
			value={value}
			options={ALIGNMENTS}
			onChange={onChange}
		/>
	);
}
