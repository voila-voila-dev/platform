import { DatePicker } from "#/date-picker/components/date-picker.tsx";
import { useIsMobile } from "#/hooks/use-mobile.ts";
import { NativeDatePickerDate } from "#/native-date-picker/components/native-date-picker-date.tsx";

// Bounds are `YYYY-MM-DD` strings: that is what a native date input reads and
// writes, what a query string carries, and what survives a time zone unchanged.
const toIsoDay = (date: Date): string => {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
};
const fromIsoDay = (isoDate: string | undefined): Date | null => {
	if (isoDate === undefined) return null;
	const parsed = new Date(`${isoDate}T00:00:00`);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
};

interface Props {
	id?: string;
	value: string | undefined;
	onValueChange: (isoDate: string | undefined) => void;
	placeholder: string;
	min?: string;
	max?: string;
	locale: string;
}

/**
 * One bound, on the surface that suits the device: the calendar popover on
 * desktop, the OS date picker under the mobile breakpoint.
 */
export function DateBoundField({
	id,
	value,
	onValueChange,
	placeholder,
	min,
	max,
	locale,
}: Props) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<NativeDatePickerDate
				id={id}
				wrapperClassName="w-full"
				aria-label={placeholder}
				value={value ?? ""}
				min={min}
				max={max}
				onChange={(event) =>
					onValueChange(
						event.target.value === "" ? undefined : event.target.value,
					)
				}
			/>
		);
	}

	return (
		<DatePicker.Root
			id={id}
			className="w-full"
			locale={locale}
			placeholder={placeholder}
			aria-label={placeholder}
			value={fromIsoDay(value)}
			onValueChange={(date) =>
				onValueChange(date === null ? undefined : toIsoDay(date))
			}
		/>
	);
}
