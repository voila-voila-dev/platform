import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as React from "react";
import type { CalendarEvent } from "#/event-calendar/lib/calendar-event.ts";
import { cn } from "#/lib/utils.ts";

/** State handed to an event card's `render` prop. */
export interface EventCalendarEventState {
	event: CalendarEvent;
}

/**
 * Host-provided Base UI render prop for every event card, provided by
 * `EventCalendar.Root`'s `renderEvent`. The card keeps its chrome (accent
 * tint, radius, hover, focus ring) through the merged props; the renderer
 * decides the element and its content, with the event available as state.
 */
export const EventCalendarRenderContext =
	React.createContext<useRender.RenderProp<EventCalendarEventState> | null>(
		null,
	);

interface Props extends useRender.ComponentProps<"button"> {
	event: CalendarEvent;
}

/**
 * One event block. Renders as a button so a clickable event is reachable by
 * keyboard; without an `onClick` it renders inert. `children` override the
 * label, and the event's `meta` lines are appended underneath either way.
 *
 * The event's `color` (any CSS color, including `var()` references) becomes
 * the `--event-accent` custom property driving the tinted card.
 */
export function EventCalendarEvent({
	event,
	className,
	style,
	children,
	render,
	...props
}: Props) {
	const contextRender = React.useContext(EventCalendarRenderContext);

	return useRender({
		defaultTagName: "button",
		render: render ?? contextRender ?? undefined,
		state: { slot: "event-calendar-event", event },
		stateAttributesMapping: { event: () => null },
		props: mergeProps<"button">(
			{
				type: "button",
				disabled: !props.onClick,
				style: {
					["--event-accent" as string]: event.color ?? "var(--color-primary)",
				},
				className: cn(
					"overflow-hidden rounded-md px-1.5 py-1 text-left text-xs leading-tight transition-colors",
					"bg-(--event-accent)/12 text-(--event-accent) inset-ring inset-ring-(--event-accent)/15",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
					props.onClick
						? "cursor-pointer hover:bg-(--event-accent)/22"
						: "cursor-default",
				),
				children: (
					<>
						{children ?? (
							<span className="block truncate font-medium">{event.title}</span>
						)}
						{event.meta?.map((line) => (
							<span key={line} className="block truncate opacity-70">
								{line}
							</span>
						))}
					</>
				),
			},
			{ className, style, ...props },
		),
	});
}
