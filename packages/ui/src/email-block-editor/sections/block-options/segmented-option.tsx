import type { ReactNode } from "react";
import {
	SegmentedControl,
	SegmentedControlItem,
} from "#/components/segmented-control.tsx";
import { BlockOptionRow } from "#/email-block-editor/sections/block-options/block-option-row.tsx";

/**
 * A closed choice small enough to show every option at once: alignment, a
 * column count. Values may be numbers; they are matched back by their string
 * form, so the callback still receives the typed value.
 *
 * An option carrying an `icon` renders icon-only and keeps its `label` as the
 * accessible name.
 */
export function SegmentedOption<Value extends string | number>({
	label,
	value,
	options,
	onChange,
	description,
}: {
	label: string;
	value: Value;
	options: ReadonlyArray<{
		readonly value: Value;
		readonly label: string;
		readonly icon?: ReactNode;
	}>;
	onChange: (value: Value) => void;
	description?: string;
}) {
	return (
		<BlockOptionRow label={label} description={description}>
			<SegmentedControl
				size="sm"
				aria-label={label}
				value={String(value)}
				onValueChange={(next) => {
					const picked = options.find(
						(option) => String(option.value) === String(next),
					);
					if (picked !== undefined) {
						onChange(picked.value);
					}
				}}
				className="w-full"
			>
				{options.map((option) => (
					<SegmentedControlItem
						key={String(option.value)}
						value={String(option.value)}
						aria-label={option.icon === undefined ? undefined : option.label}
						className="flex-1"
					>
						{option.icon ?? option.label}
					</SegmentedControlItem>
				))}
			</SegmentedControl>
		</BlockOptionRow>
	);
}
