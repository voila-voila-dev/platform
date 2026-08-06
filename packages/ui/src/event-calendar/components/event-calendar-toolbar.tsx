import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { EventCalendarViewToggle } from "#/event-calendar/components/event-calendar-view-toggle.tsx";
import type { CalendarViewMode } from "#/event-calendar/lib/calendar-event.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	/** The period the calendar is showing, e.g. "June 2026". */
	label: string;
	onToday: () => void;
	onPrev: () => void;
	onNext: () => void;
	/** Pair with `onViewChange` to show the Day / Week / Month toggle. */
	view?: CalendarViewMode;
	onViewChange?: (view: CalendarViewMode) => void;
}

/** Today / previous / next, the period heading, and the view toggle. */
export function EventCalendarToolbar({
	label,
	onToday,
	onPrev,
	onNext,
	view,
	onViewChange,
	className,
	...props
}: Props) {
	return (
		<div
			data-slot="event-calendar-toolbar"
			className={cn("flex flex-wrap items-center gap-2", className)}
			{...props}
		>
			<Button variant="outline" size="sm" onClick={onToday}>
				Today
			</Button>
			<div className="flex items-center">
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label="Previous"
					onClick={onPrev}
				>
					<CaretLeftIcon />
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label="Next"
					onClick={onNext}
				>
					<CaretRightIcon />
				</Button>
			</div>
			<h2 className="text-base font-semibold" aria-live="polite">
				{label}
			</h2>
			{view && onViewChange ? (
				<EventCalendarViewToggle
					view={view}
					onViewChange={onViewChange}
					className="ml-auto"
				/>
			) : null}
		</div>
	);
}
