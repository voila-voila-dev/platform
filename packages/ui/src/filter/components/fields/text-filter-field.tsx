import { useId } from "react";
import { FilterFieldFrame } from "#/filter/components/fields/filter-field-frame.tsx";
import { FilterOperatorToggle } from "#/filter/components/fields/filter-operator-toggle.tsx";
import type {
	FilterLabels,
	TextFilterDefinition,
	TextFilterValue,
} from "#/filter/types.ts";
import { Input } from "#/input/components/input.tsx";

interface Props {
	definition: TextFilterDefinition;
	value: TextFilterValue | undefined;
	onValueChange: (value: TextFilterValue) => void;
	labels: FilterLabels;
}

/** Free-text contains/does-not-contain filter. */
export function TextFilterField({
	definition,
	value,
	onValueChange,
	labels,
}: Props) {
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
