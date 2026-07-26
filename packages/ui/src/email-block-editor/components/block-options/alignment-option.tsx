import {
	TextAlignCenterIcon,
	TextAlignLeftIcon,
	TextAlignRightIcon,
} from "@phosphor-icons/react";
import type * as React from "react";
import { SegmentedOption } from "#/email-block-editor/components/block-options/segmented-option.tsx";
import type { EmailEditorAlignment } from "#/email-block-editor/document/types.ts";

const ALIGNMENTS: ReadonlyArray<{
	readonly value: EmailEditorAlignment;
	readonly label: string;
	readonly icon: React.ReactNode;
}> = [
	{
		value: "left",
		label: "Align left",
		icon: <TextAlignLeftIcon aria-hidden />,
	},
	{
		value: "center",
		label: "Align center",
		icon: <TextAlignCenterIcon aria-hidden />,
	},
	{
		value: "right",
		label: "Align right",
		icon: <TextAlignRightIcon aria-hidden />,
	},
];

interface Props {
	label?: string;
	value: EmailEditorAlignment;
	onChange: (alignment: EmailEditorAlignment) => void;
}

/**
 * The one alignment control. Every block that can be aligned uses this exact
 * segmented control, so "Alignment" means the same thing and looks the same
 * everywhere (§1.2 of the editor plan).
 */
export function AlignmentOption({
	label = "Alignment",
	value,
	onChange,
}: Props) {
	return (
		<SegmentedOption
			label={label}
			value={value}
			options={ALIGNMENTS}
			onChange={onChange}
		/>
	);
}
