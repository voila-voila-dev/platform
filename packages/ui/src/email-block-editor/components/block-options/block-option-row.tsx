import type { ReactNode } from "react";
import { Field } from "#/field/components/field.tsx";

interface Props {
	label: string;
	/** The id of the control this row labels; omit for controls that label
	 * themselves (a radio group carries its own `aria-label`). */
	htmlFor?: string;
	description?: string;
	orientation?: "vertical" | "horizontal";
	children: ReactNode;
}

/**
 * One labelled option in the block settings panel. Every block setting goes
 * through this row rather than hand-rolling `useId()` + `Label` + control, so
 * spacing, label typography and description placement cannot drift from block
 * to block.
 *
 * `vertical` stacks the label above a full-width control (text, select,
 * segmented control); `horizontal` puts the control beside the label, which is
 * what a `Switch` wants.
 */
export function BlockOptionRow({
	label,
	htmlFor,
	description,
	orientation = "vertical",
	children,
}: Props) {
	if (orientation === "horizontal") {
		return (
			<Field.Root orientation="horizontal">
				<Field.Content>
					<Field.Label htmlFor={htmlFor}>{label}</Field.Label>
					{description === undefined ? null : (
						<Field.Description>{description}</Field.Description>
					)}
				</Field.Content>
				{children}
			</Field.Root>
		);
	}

	return (
		<Field.Root>
			<Field.Label htmlFor={htmlFor}>{label}</Field.Label>
			{children}
			{description === undefined ? null : (
				<Field.Description>{description}</Field.Description>
			)}
		</Field.Root>
	);
}
