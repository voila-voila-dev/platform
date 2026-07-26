import { DEFAULT_MINUTES } from "#/date-time-picker/lib/date-time-values.ts";
import { minutesOfDay, withMinutes } from "#/lib/time-math.ts";

/**
 * {@link DateTimePicker}'s selection handlers around the shared picker state.
 * Picking a day keeps the existing time-of-day (or 09:00 the first time), and
 * leaves the popover open so the time can still be chosen; picking a time
 * completes the selection (against today when no day is set yet) and closes
 * the popover, mirroring `TimePicker`.
 */
export function createDateTimeSelectionHandlers(state: {
	isControlled: boolean;
	value: Date | null | undefined;
	setUncontrolledValue: (value: Date | undefined) => void;
	setOpen: (open: boolean) => void;
	onValueChange: ((date: Date | null) => void) | undefined;
}): {
	handleDaySelect: (day: Date | undefined) => void;
	handleTimeSelect: (totalMinutes: number) => void;
} {
	const commit = (next: Date | null) => {
		if (!state.isControlled) state.setUncontrolledValue(next ?? undefined);
		state.onValueChange?.(next);
	};

	const handleDaySelect = (day: Date | undefined) => {
		if (!day) {
			commit(null);
			return;
		}
		commit(
			withMinutes(
				day,
				state.value ? minutesOfDay(state.value) : DEFAULT_MINUTES,
			),
		);
	};

	const handleTimeSelect = (totalMinutes: number) => {
		commit(withMinutes(state.value ?? new Date(), totalMinutes));
		state.setOpen(false);
	};

	return { handleDaySelect, handleTimeSelect };
}

export function dateTimeTriggerLabel(
	value: Date | null | undefined,
	locale: string | undefined,
	formatOptions: Intl.DateTimeFormatOptions,
	placeholder: string,
): string {
	return value
		? new Intl.DateTimeFormat(locale, formatOptions).format(value)
		: placeholder;
}
