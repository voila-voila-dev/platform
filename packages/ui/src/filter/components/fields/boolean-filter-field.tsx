import { FilterFieldFrame } from "#/filter/components/fields/field-frame.tsx";
import type {
	BooleanFilterDefinition,
	BooleanFilterValue,
	FilterLabels,
} from "#/filter/types.ts";
import { cn } from "#/lib/utils.ts";

/**
 * Three states, not two: yes, no, and "any" (the filter unset). A switch can
 * only say yes/no, which silently turns "I don't care" into "must be false" —
 * so the third state gets its own segment.
 */
export function BooleanFilterField({
	definition,
	value,
	onValueChange,
	labels,
}: {
	readonly definition: BooleanFilterDefinition;
	readonly value: BooleanFilterValue | undefined;
	readonly onValueChange: (value: BooleanFilterValue | undefined) => void;
	readonly labels: FilterLabels;
}) {
	const states: ReadonlyArray<{ key: string; label: string; set?: boolean }> = [
		{ key: "any", label: labels.any },
		{ key: "true", label: definition.trueLabel, set: true },
		{ key: "false", label: definition.falseLabel, set: false },
	];

	return (
		<FilterFieldFrame
			label={definition.label}
			description={definition.description}
			labels={labels}
		>
			<fieldset className="inline-flex w-full items-center gap-1 rounded-full bg-muted p-1 sm:w-auto">
				<legend className="sr-only">{definition.label}</legend>
				{states.map((state) => {
					const active = value?.value === state.set;
					return (
						<button
							key={state.key}
							type="button"
							aria-pressed={active}
							onClick={() =>
								onValueChange(
									state.set === undefined
										? undefined
										: { kind: "boolean", value: state.set },
								)
							}
							className={cn(
								"flex-1 cursor-pointer rounded-full px-3 py-1 text-sm transition-colors sm:flex-none",
								active
									? "bg-background font-medium text-foreground shadow-xs"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							{state.label}
						</button>
					);
				})}
			</fieldset>
		</FilterFieldFrame>
	);
}
