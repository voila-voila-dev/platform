import type * as React from "react";
import type { CalendarViewMode } from "#/event-calendar/lib/calendar-event.ts";
import { SegmentedControl } from "#/segmented-control/components/segmented-control.tsx";

const VIEW_OPTIONS: readonly { value: CalendarViewMode; label: string }[] = [
	{ value: "day", label: "Day" },
	{ value: "week", label: "Week" },
	{ value: "month", label: "Month" },
];

interface Props
	extends Omit<
		React.ComponentProps<typeof SegmentedControl.Root>,
		"value" | "onValueChange" | "children"
	> {
	view: CalendarViewMode;
	onViewChange: (view: CalendarViewMode) => void;
}

/** Day / Week / Month picker, as a single-choice segmented control. */
export function EventCalendarViewToggle({
	view,
	onViewChange,
	...props
}: Props) {
	return (
		<SegmentedControl.Root
			aria-label="Calendar view"
			size="sm"
			value={view}
			onValueChange={(value) => onViewChange(value as CalendarViewMode)}
			{...props}
		>
			{VIEW_OPTIONS.map((option) => (
				<SegmentedControl.Item key={option.value} value={option.value}>
					{option.label}
				</SegmentedControl.Item>
			))}
		</SegmentedControl.Root>
	);
}
