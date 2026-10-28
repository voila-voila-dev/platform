import type { DateRange } from "react-day-picker";
import { DatePickerHiddenInput } from "#/date-picker/components/date-picker-hidden-input.tsx";

interface Props {
	name?: string;
	value: DateRange | null | undefined;
}

/** The `${name}-from` / `${name}-to` pair a range serializes to in a form. */
export function DateRangePickerHiddenInputs({ name, value }: Props) {
	if (!name) {
		return null;
	}
	return (
		<>
			<DatePickerHiddenInput name={`${name}-from`} date={value?.from} />
			<DatePickerHiddenInput name={`${name}-to`} date={value?.to} />
		</>
	);
}
