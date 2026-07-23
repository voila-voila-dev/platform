import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
} from "@voila.dev/ui/components/field";
import type { ReactNode } from "react";

/**
 * One labelled option in « Réglages du bloc ». Every block setting goes
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
}: {
	label: string;
	/** The id of the control this row labels; omit for controls that label
	 * themselves (a radio group carries its own `aria-label`). */
	htmlFor?: string;
	description?: string;
	orientation?: "vertical" | "horizontal";
	children: ReactNode;
}) {
	if (orientation === "horizontal") {
		return (
			<Field orientation="horizontal">
				<FieldContent>
					<FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
					{description === undefined ? null : (
						<FieldDescription>{description}</FieldDescription>
					)}
				</FieldContent>
				{children}
			</Field>
		);
	}

	return (
		<Field>
			<FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
			{children}
			{description === undefined ? null : (
				<FieldDescription>{description}</FieldDescription>
			)}
		</Field>
	);
}

/**
 * A titled group of rows. §1.4 of the editor plan: once a block carries more
 * than a handful of options they are split into « Contenu », « Apparence » and
 * « Lien », always in that order.
 */
export function BlockOptionSection({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section className="flex flex-col gap-3">
			<h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
				{title}
			</h4>
			{children}
		</section>
	);
}
