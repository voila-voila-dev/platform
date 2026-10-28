import { toIsoDay } from "#/date-picker/lib/date-picker-format.ts";

interface Props {
	name?: string;
	date: Date | null | undefined;
}

/** The hidden form input serializing a day as yyyy-MM-dd (none without a name). */
export function DatePickerHiddenInput({ name, date }: Props) {
	if (!name) {
		return null;
	}
	return <input type="hidden" name={name} value={date ? toIsoDay(date) : ""} />;
}
