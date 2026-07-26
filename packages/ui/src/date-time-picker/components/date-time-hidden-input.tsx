import { toLocalInputValue } from "#/date-time-picker/lib/date-time-values.ts";

interface Props {
	name: string | undefined;
	value: Date | null | undefined;
}

/** Serialized `yyyy-MM-ddTHH:mm` form value, rendered only when named. */
export function DateTimeHiddenInput({ name, value }: Props) {
	if (!name) {
		return null;
	}
	return (
		<input
			type="hidden"
			name={name}
			value={value ? toLocalInputValue(value) : ""}
		/>
	);
}
