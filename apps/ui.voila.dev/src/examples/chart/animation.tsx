import { barY, cell, defineChart, donut, lineY } from "@voila.dev/chart";
import { geoShape, projection } from "@voila.dev/chart/geo";
import { Chart } from "@voila.dev/chart/react";
import { useState } from "react";

/** The package formats in French by default; this site is in English. */
const LOCALE = "en-GB";

/** Bookings for the `index`-th month since January 2026: a wave, so every visit draws the same picture. */
function bookingsIn(index: number) {
	return {
		month: new Date(Date.UTC(2026, index, 1)),
		bookings: Math.round(30 + 12 * Math.sin(index / 1.7) + (index % 3) * 4),
	};
}

function Controls({ children }: { children: React.ReactNode }) {
	return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Action({
	onClick,
	children,
}: {
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="rounded-md border px-3 py-1 text-sm hover:bg-muted"
		>
			{children}
		</button>
	);
}

export function SlidingWindow() {
	const [start, setStart] = useState(0);
	const months = Array.from({ length: 8 }, (_unused, index) =>
		bookingsIn(start + index),
	);
	return (
		<div className="grid w-full gap-3">
			<Controls>
				<Action onClick={() => setStart((value) => value + 1)}>
					Next month
				</Action>
				<Action onClick={() => setStart((value) => Math.max(0, value - 1))}>
					Previous month
				</Action>
			</Controls>
			<Chart
				ariaLabel="Bookings per month"
				height={220}
				definition={defineChart({
					locale: LOCALE,
					marks: [
						lineY(months, { x: "month", y: "bookings", label: "Bookings" }),
					],
				})}
			/>
		</div>
	);
}

const allCities = [
	{ city: "Paris", projects: 51 },
	{ city: "Lyon", projects: 35 },
	{ city: "Nantes", projects: 28 },
	{ city: "Lille", projects: 19 },
	{ city: "Bordeaux", projects: 23 },
];

export function PieSlices() {
	const [count, setCount] = useState(3);
	return (
		<div className="grid w-full gap-3">
			<Controls>
				<Action onClick={() => setCount((value) => Math.min(value + 1, 5))}>
					Add a city
				</Action>
				<Action onClick={() => setCount((value) => Math.max(value - 1, 1))}>
					Remove a city
				</Action>
			</Controls>
			<Chart
				ariaLabel="Projects per city"
				height={240}
				definition={defineChart({
					locale: LOCALE,
					marks: [
						donut(allCities.slice(0, count), {
							category: "city",
							value: "projects",
						}),
					],
				})}
			/>
		</div>
	);
}

const teams = ["Web", "Mobile", "Data", "Design", "Ops", "Support"];

function teamLoad(round: number) {
	return teams.map((team, index) => ({
		team,
		hours: 10 + ((index * 7 + round * 11) % 30),
	}));
}

function Bars({
	animate,
	label,
}: {
	animate: React.ComponentProps<typeof Chart>["animate"];
	label: string;
}) {
	const [round, setRound] = useState(0);
	return (
		<div className="grid w-full gap-3">
			<Controls>
				<Action onClick={() => setRound((value) => value + 1)}>New week</Action>
			</Controls>
			<Chart
				ariaLabel={label}
				height={220}
				animate={animate}
				definition={defineChart({
					locale: LOCALE,
					marks: [
						barY(teamLoad(round), { x: "team", y: "hours", label: "Hours" }),
					],
				})}
			/>
		</div>
	);
}

export function Bounce() {
	return (
		<Bars
			label="Hours per team, with bounce"
			animate={{ duration: 500, bounce: 0.35 }}
		/>
	);
}

export function Stagger() {
	return (
		<Bars
			label="Hours per team, staggered"
			animate={{ duration: 400, stagger: 50 }}
		/>
	);
}

export function DrawIn() {
	const [run, setRun] = useState(0);
	const months = Array.from({ length: 12 }, (_unused, index) =>
		bookingsIn(index),
	);
	return (
		<div className="grid w-full gap-3">
			<Controls>
				<Action onClick={() => setRun((value) => value + 1)}>Replay</Action>
			</Controls>
			<Chart
				key={run}
				ariaLabel="Bookings per month, drawn in"
				height={220}
				animate={{ duration: 900 }}
				definition={defineChart({
					locale: LOCALE,
					marks: [
						lineY(months, {
							x: "month",
							y: "bookings",
							label: "Bookings",
							enter: "draw",
						}),
					],
				})}
			/>
		</div>
	);
}

/** A ring of `sides` points around (lon, lat): the same zone, drawn coarse or fine. */
function ring(lon: number, lat: number, radius: number, sides: number) {
	const points = Array.from({ length: sides }, (_unused, index) => {
		// Clockwise, as d3-geo expects an exterior ring.
		const angle = (-index / sides) * 2 * Math.PI + Math.PI / 4;
		return [lon + radius * Math.cos(angle), lat + radius * Math.sin(angle)];
	});
	return [...points, points[0]];
}

function zones(sides: number) {
	return [
		{ name: "North", lon: 2, lat: 50, value: 34 },
		{ name: "West", lon: -1, lat: 47, value: 21 },
		{ name: "East", lon: 6, lat: 47.5, value: 12 },
		{ name: "South", lon: 3, lat: 44, value: 27 },
	].map((zone) => ({
		type: "Feature" as const,
		properties: { name: zone.name, value: zone.value },
		geometry: {
			type: "Polygon" as const,
			coordinates: [ring(zone.lon, zone.lat, 1.6, sides)],
		},
	}));
}

export function MorphingMap() {
	const [fine, setFine] = useState(false);
	const features = zones(fine ? 24 : 4);
	return (
		<div className="grid w-full gap-3">
			<Controls>
				<Action onClick={() => setFine((value) => !value)}>
					{fine ? "Square zones" : "Round zones"}
				</Action>
			</Controls>
			<Chart
				ariaLabel="Projects per zone"
				height={280}
				definition={defineChart({
					locale: LOCALE,
					projection: projection("mercator", {
						domain: { type: "FeatureCollection", features: zones(24) } as never,
					}),
					marks: [
						geoShape(features, {
							name: (zone) => zone.properties.name,
							color: (zone) => zone.properties.value,
							label: "Projects",
						}),
					],
				})}
			/>
		</div>
	);
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const hours = ["9h", "11h", "14h", "16h"];

export function HeatmapColours() {
	const [week, setWeek] = useState(0);
	return (
		<div className="grid w-full gap-3">
			<Controls>
				<Action onClick={() => setWeek((value) => value + 1)}>Next week</Action>
			</Controls>
			<Chart
				ariaLabel="Bookings per day and hour"
				height={200}
				definition={defineChart({
					locale: LOCALE,
					color: { domain: [0, 10] },
					marks: [
						cell(
							days.flatMap((day, dayIndex) =>
								hours.map((hour, hourIndex) => ({
									day,
									hour,
									bookings: (dayIndex * 3 + hourIndex * 5 + week * 4) % 11,
								})),
							),
							{ x: "day", y: "hour", color: "bookings" },
						),
					],
				})}
			/>
		</div>
	);
}
