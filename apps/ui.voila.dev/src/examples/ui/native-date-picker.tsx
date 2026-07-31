import { NativeDatePicker } from "@voila.dev/ui/native-date-picker";

export function Default() {
	return (
		<div className="flex flex-col gap-3">
			<NativeDatePicker.Date defaultValue="2026-06-20" />
			<NativeDatePicker.Time defaultValue="14:30" />
			<NativeDatePicker.DateTime defaultValue="2026-06-20T14:30" />
		</div>
	);
}

export function Bounded() {
	return (
		<NativeDatePicker.Date
			defaultValue="2026-06-20"
			min="2026-06-01"
			max="2026-06-30"
		/>
	);
}

export function Small() {
	return (
		<div className="flex flex-col gap-3">
			<NativeDatePicker.Date size="sm" defaultValue="2026-06-20" />
			<NativeDatePicker.Time size="sm" defaultValue="14:30" />
		</div>
	);
}
