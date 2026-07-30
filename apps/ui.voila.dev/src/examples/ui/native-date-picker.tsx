import { NativeDatePicker } from "@voila.dev/ui/native-date-picker";

export function NativeDatePickerExample() {
	return (
		<div className="flex flex-col gap-3">
			<NativeDatePicker.Date defaultValue="2026-06-20" />
			<NativeDatePicker.Time defaultValue="14:30" />
			<NativeDatePicker.DateTime defaultValue="2026-06-20T14:30" />
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Media and progress                                                         */
/* -------------------------------------------------------------------------- */
