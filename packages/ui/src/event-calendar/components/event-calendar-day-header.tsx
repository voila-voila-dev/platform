import type * as React from "react";
import { isSameDay } from "#/event-calendar/lib/calendar-dates.ts";
import { weekdayLabel } from "#/event-calendar/lib/calendar-labels.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	day: Date;
	/** BCP-47 locale for the weekday name. */
	locale?: string;
}

/** The weekday + date-number column header above the time grid. */
export function EventCalendarDayHeader({
	day,
	locale,
	className,
	...props
}: Props) {
	const isToday = isSameDay(day, new Date());

	return (
		<div
			data-slot="event-calendar-day-header"
			className={cn(
				"flex flex-1 flex-col items-center gap-1 py-1.5",
				className,
			)}
			{...props}
		>
			<span className="text-[0.7rem] text-muted-foreground uppercase">
				{weekdayLabel(day, locale)}
			</span>
			<span
				className={cn(
					"flex h-7 min-w-7 items-center justify-center rounded-full px-1 text-sm font-medium",
					isToday ? "bg-primary text-primary-foreground" : undefined,
				)}
			>
				{day.getDate()}
			</span>
		</div>
	);
}
