import * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { timeLabel } from "#/date-time-picker/lib/date-time-values.ts";

interface Props {
	options: ReadonlyArray<number>;
	selectedMinutes: number | null;
	locale: string | undefined;
	ariaLabel: string;
	onSelect: (totalMinutes: number) => void;
}

/** The scrollable time-of-day column beside {@link DateTimePicker}'s calendar. */
export function DateTimeOptionList({
	options,
	selectedMinutes,
	locale,
	ariaLabel,
	onSelect,
}: Props) {
	// Center the selected time option once the popup is positioned (the ref fires
	// too early, so defer by a frame). Optional call: jsdom has no scrollIntoView.
	const setSelectedOption = React.useCallback(
		(node: HTMLButtonElement | null) => {
			if (!node) return;
			requestAnimationFrame(() => node.scrollIntoView?.({ block: "center" }));
		},
		[],
	);

	return (
		<div
			data-slot="date-time-option-list"
			role="listbox"
			aria-label={ariaLabel}
			className="flex max-h-72 w-28 flex-col gap-0.5 overflow-y-auto overscroll-contain border-l p-1.5"
		>
			{options.map((minutes) => {
				const selected = selectedMinutes === minutes;
				return (
					<Button
						key={minutes}
						type="button"
						role="option"
						aria-selected={selected}
						data-selected={selected || undefined}
						variant="ghost"
						size="sm"
						className="shrink-0 justify-center font-normal data-selected:bg-primary data-selected:text-primary-foreground data-selected:hover:bg-primary data-selected:hover:text-primary-foreground"
						ref={selected ? setSelectedOption : undefined}
						onClick={() => onSelect(minutes)}
					>
						{timeLabel(minutes, locale)}
					</Button>
				);
			})}
		</div>
	);
}
