import { useId } from "react";
import { Input } from "#/components/input.tsx";
import {
	FilterFieldFrame,
	FilterOperatorToggle,
} from "#/filter/components/fields/field-frame.tsx";
import type {
	FilterLabels,
	TextFilterDefinition,
	TextFilterValue,
} from "#/filter/types.ts";

/** Free-text contains/does-not-contain filter. */
export function TextFilterField({
	definition,
	value,
	onValueChange,
	labels,
}: {
	readonly definition: TextFilterDefinition;
	readonly value: TextFilterValue | undefined;
	readonly onValueChange: (value: TextFilterValue) => void;
	readonly labels: FilterLabels;
}) {
	const controlId = useId();
	const text = value?.text ?? "";
	const excluded = value?.excluded ?? false;

	return (
		<FilterFieldFrame
			label={definition.label}
			description={definition.description}
			controlId={controlId}
			labels={labels}
			operator={
				definition.allowExclusion === true ? (
					<FilterOperatorToggle
						excluded={excluded}
						disabled={text === ""}
						onExcludedChange={(next) =>
							onValueChange({ kind: "text", text, excluded: next })
						}
						labels={labels}
					/>
				) : undefined
			}
			onClear={
				text === ""
					? undefined
					: () => onValueChange({ kind: "text", text: "", excluded })
			}
		>
			<Input
				id={controlId}
				value={text}
				placeholder={definition.placeholder}
				onChange={(event) =>
					onValueChange({ kind: "text", text: event.target.value, excluded })
				}
			/>
		</FilterFieldFrame>
	);
}
