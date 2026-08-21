import * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { timeLabel } from "#/date-time-picker/lib/date-time-values.ts";

interface Props {
	options: ReadonlyArray<number>;
	selectedMinutes: number | null;
	isDisabled: (minutes: number) => boolean;
	onSelect: (minutes: number) => void;
	locale: string | undefined;
	ariaLabel: string;
}

/** The active step's time options as a single scrollable column. */
export function ShiftTimeList({
	options,
	selectedMinutes,
	isDisabled,
	onSelect,
	locale,
	ariaLabel,
}: Props) {
	const centerOption = React.useCallback((node: HTMLButtonElement | null) => {
		if (!node) return;
		requestAnimationFrame(() => node.scrollIntoView?.({ block: "center" }));
	}, []);
	// Open scrolled to the selected time, or centered on midday when none is picked
	// yet (so the list doesn't sit pinned at 00:00). Snap the target to the nearest
	// option in case the step doesn't divide noon.
	const focusMinutes = selectedMinutes ?? 12 * 60;
	const scrollTarget = options.reduce(
		(best, minutes) =>
			Math.abs(minutes - focusMinutes) < Math.abs(best - focusMinutes)
				? minutes
				: best,
		options[0] ?? focusMinutes,
	);
	return (
		<div
			data-slot="shift-time-list"
			role="listbox"
			aria-label={ariaLabel}
			// One column on both surfaces: a multi-column grid of times reads as a
			// table you have to scan in two directions, when the list is ordered and
			// only ever scanned down. On desktop it fills its stretched parent (which
			// matches the calendar height); on mobile it takes the height the
			// shortened calendar leaves it.
			className="mx-auto flex w-full max-w-[17.5rem] max-h-72 flex-col gap-1 overflow-y-auto overscroll-contain p-1.5 sm:absolute sm:inset-0 sm:mx-0 sm:max-h-none sm:max-w-none sm:gap-0.5"
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
						disabled={isDisabled(minutes)}
						variant="ghost"
						size="sm"
						className="shrink-0 justify-center font-normal data-selected:bg-primary data-selected:text-primary-foreground data-selected:hover:bg-primary data-selected:hover:text-primary-foreground"
						ref={minutes === scrollTarget ? centerOption : undefined}
						onClick={() => onSelect(minutes)}
					>
						{timeLabel(minutes, locale)}
					</Button>
				);
			})}
		</div>
	);
}
