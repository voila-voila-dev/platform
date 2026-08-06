import type * as React from "react";
import type { CalendarEvent } from "#/event-calendar/lib/calendar-event.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"button"> {
	event: CalendarEvent;
}

/**
 * One event block. Renders as a button so a clickable event is reachable by
 * keyboard; without an `onClick` it renders inert. `children` override the
 * label, and the event's `meta` lines are appended underneath either way.
 */
export function EventCalendarEvent({
	event,
	className,
	style,
	children,
	...props
}: Props) {
	const accent = event.color
		? { backgroundColor: `${event.color}1a`, color: event.color }
		: undefined;

	return (
		<button
			type="button"
			data-slot="event-calendar-event"
			disabled={!props.onClick}
			style={{ ...accent, ...style }}
			className={cn(
				"overflow-hidden rounded px-1.5 py-0.5 text-left text-xs leading-tight",
				event.color ? undefined : "bg-primary/15 text-primary",
				props.onClick ? "hover:brightness-95" : "cursor-default",
				className,
			)}
			{...props}
		>
			{children ?? event.title}
			{event.meta?.map((line) => (
				<span key={line} className="block truncate opacity-70">
					{line}
				</span>
			))}
		</button>
	);
}
