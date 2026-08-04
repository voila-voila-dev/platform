import {
	TextAlignCenterIcon,
	TextAlignLeftIcon,
	TextAlignRightIcon,
} from "@phosphor-icons/react";
import type * as React from "react";
import { SegmentedOption } from "#/email-block-editor/components/block-options/segmented-option.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorAlignment } from "#/email-block-editor/document/types.ts";

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
export function AlignmentOption({ label, value, onChange }: Props) {
	const { fields } = useEmailEditorLabels();
	const alignments: ReadonlyArray<{
		readonly value: EmailEditorAlignment;
		readonly label: string;
		readonly icon: React.ReactNode;
	}> = [
		{
			value: "left",
			label: fields.alignLeft,
			icon: <TextAlignLeftIcon aria-hidden />,
		},
		{
			value: "center",
			label: fields.alignCenter,
			icon: <TextAlignCenterIcon aria-hidden />,
		},
		{
			value: "right",
			label: fields.alignRight,
			icon: <TextAlignRightIcon aria-hidden />,
		},
	];
	return (
		<SegmentedOption
			label={label ?? fields.alignment}
			value={value}
			options={alignments}
			onChange={onChange}
		/>
	);
}
