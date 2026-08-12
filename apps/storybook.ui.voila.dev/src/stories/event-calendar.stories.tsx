import type { Meta, StoryObj } from "@storybook/tanstack-react";
import type { CalendarEvent } from "@voila.dev/ui/event-calendar";
import { EventCalendar } from "@voila.dev/ui/event-calendar";
import { useState } from "react";

const meta = {
	title: "UI/EventCalendar",
	component: EventCalendar.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof EventCalendar.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

// A fixed week so the stories render the same events every time.
const MONDAY = new Date(2026, 5, 15);

function at(dayOffset: number, hour: number, minute = 0): Date {
	return new Date(2026, 5, 15 + dayOffset, hour, minute);
}

const EVENTS: CalendarEvent[] = [
	{ id: "standup", title: "Standup", start: at(0, 9, 30), end: at(0, 9, 45) },
	{
		id: "design",
		title: "Design review",
		start: at(0, 9, 30),
		end: at(0, 11, 0),
		color: "#7c3aed",
		meta: ["Owner: Sam", "Room: Atlas"],
	},
	{ id: "lunch", title: "Lunch", start: at(1, 12, 0), end: at(1, 13, 0) },
	{
		id: "offsite",
		title: "Team offsite",
		start: at(2, 0, 0),
		end: at(5, 0, 0),
		allDay: true,
		color: "#0891b2",
	},
	{ id: "retro", title: "Retro", start: at(4, 16, 0), end: at(4, 17, 0) },
];

export const Default: Story = {
	args: { events: EVENTS, defaultDate: MONDAY, defaultView: "month" },
};

export const Week: Story = {
	args: { events: EVENTS, defaultDate: MONDAY, defaultView: "week" },
};

export const Day: Story = {
	args: { events: EVENTS, defaultDate: MONDAY, defaultView: "day" },
};

export const BusinessHours: Story = {
	args: {
		events: EVENTS,
		defaultDate: MONDAY,
		defaultView: "week",
		hourRange: [8, 20],
	},
};

export const FrenchLocale: Story = {
	args: {
		events: EVENTS,
		defaultDate: MONDAY,
		defaultView: "month",
		locale: "fr-FR",
	},
};

function ControlledEventCalendar() {
	const [view, setView] = useState<"month" | "week" | "day">("week");
	const [selected, setSelected] = useState<CalendarEvent | null>(null);

	return (
		<div className="flex flex-col gap-3">
			<EventCalendar.Root
				events={EVENTS}
				defaultDate={MONDAY}
				view={view}
				onViewChange={setView}
				onEventClick={setSelected}
			/>
			<p className="text-sm text-muted-foreground">
				{selected ? `Selected: ${selected.title}` : "Click an event."}
			</p>
		</div>
	);
}

export const Controlled: Story = {
	render: () => <ControlledEventCalendar />,
};

// Home-care planning shaped data: one color per lifecycle status.
const PLANNING_EVENTS: CalendarEvent[] = [
	{
		id: "1",
		title: "Marie Dupont",
		start: at(0, 9, 0),
		end: at(0, 12, 0),
		color: "var(--color-blue-500)",
		meta: ["3 h · récurrent"],
	},
	{
		id: "2",
		title: "Jean Martin",
		start: at(0, 14, 0),
		end: at(0, 16, 0),
		color: "var(--color-emerald-600)",
		meta: ["2 h · terminé"],
	},
	{
		id: "3",
		title: "Louise Bernard",
		start: at(1, 8, 30),
		end: at(1, 12, 30),
		color: "var(--color-violet-500)",
		meta: ["4 h · ponctuel"],
	},
	{
		id: "4",
		title: "Anne Moreau",
		start: at(2, 10, 0),
		end: at(2, 12, 0),
		color: "var(--color-gray-400)",
		meta: ["Annulée"],
	},
	{
		id: "5",
		title: "Marie Dupont",
		start: at(3, 14, 0),
		end: at(3, 17, 0),
		color: "var(--color-blue-500)",
		meta: ["3 h · récurrent"],
	},
	{
		id: "6",
		title: "Jean Martin",
		start: at(4, 9, 0),
		end: at(4, 13, 0),
		color: "var(--color-blue-500)",
		meta: ["4 h · récurrent"],
	},
];

export const PlanningWeek: Story = {
	args: {
		events: PLANNING_EVENTS,
		defaultDate: MONDAY,
		defaultView: "week",
		hourRange: [8, 18],
		locale: "fr-FR",
		hideToolbar: true,
		onEventClick: () => {},
	},
};

export const CustomEventRender: Story = {
	args: {
		events: PLANNING_EVENTS,
		defaultDate: MONDAY,
		defaultView: "week",
		hourRange: [8, 18],
		locale: "fr-FR",
		hideToolbar: true,
		onEventClick: () => {},
		renderEvent: (props, { event }) => (
			<button {...props}>
				<span className="block truncate font-semibold">
					{event.meta?.includes("Annulée") ? <s>{event.title}</s> : event.title}
				</span>
				<span className="block truncate opacity-70">
					{event.start.toLocaleTimeString("fr-FR", {
						hour: "2-digit",
						minute: "2-digit",
					})}
					{event.meta ? ` · ${event.meta.join(" · ")}` : null}
				</span>
			</button>
		),
	},
};
