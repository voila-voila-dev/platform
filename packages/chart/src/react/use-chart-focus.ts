import * as React from "react";
import type { ChartFocusStop, findNearest } from "#/core/nearest.ts";
import type { ChartFocusOrder, ChartPoint } from "#/core/types.ts";

/**
 * Which point the reader is on, by the pointer or the keyboard. Focus is held
 * by key, not index, so it stays on the same datum when the data updates
 * around it, and drops cleanly when that datum goes away.
 */
interface FocusState {
	readonly stopKey: string;
	readonly pointKey: string;
	readonly source: "pointer" | "keyboard";
	readonly pinned: boolean;
}

export interface ActiveFocus {
	readonly stop: ChartFocusStop;
	readonly point: ChartPoint;
	readonly source: "pointer" | "keyboard";
	readonly pinned: boolean;
}

interface Options {
	readonly stops: ReadonlyArray<ChartFocusStop>;
	readonly order: ChartFocusOrder;
	readonly hitTest: (x: number, y: number) => ReturnType<typeof findNearest>;
	readonly onFocusChange?: (point: ChartPoint | null) => void;
	readonly onSelect?: (point: ChartPoint | null) => void;
}

/** Points of a stop in screen order across the stop: top to bottom, or left to right. */
function across(
	stop: ChartFocusStop,
	order: ChartFocusOrder,
): ReadonlyArray<ChartPoint> {
	return [...stop.points].sort((left, right) =>
		order === "y" ? left.x - right.x : left.y - right.y,
	);
}

const ALONG_KEYS: Record<
	ChartFocusOrder,
	{ next: string[]; previous: string[] }
> = {
	x: { next: ["ArrowRight"], previous: ["ArrowLeft"] },
	y: { next: ["ArrowDown"], previous: ["ArrowUp"] },
	point: {
		next: ["ArrowRight", "ArrowDown"],
		previous: ["ArrowLeft", "ArrowUp"],
	},
};

const ACROSS_KEYS: Record<
	ChartFocusOrder,
	{ next: string[]; previous: string[] }
> = {
	x: { next: ["ArrowDown"], previous: ["ArrowUp"] },
	y: { next: ["ArrowRight"], previous: ["ArrowLeft"] },
	point: { next: [], previous: [] },
};

export function useChartFocus({
	stops,
	order,
	hitTest,
	onFocusChange,
	onSelect,
}: Options) {
	const [state, setState] = React.useState<FocusState | null>(null);

	const active = React.useMemo<ActiveFocus | null>(() => {
		if (state === null) {
			return null;
		}
		const stop = stops.find((candidate) => candidate.key === state.stopKey);
		const point = stop?.points.find(
			(candidate) => candidate.key === state.pointKey,
		);
		return stop && point
			? { stop, point, source: state.source, pinned: state.pinned }
			: null;
	}, [state, stops]);

	const activeKey = active?.point.key;
	const onFocusChangeRef = React.useRef(onFocusChange);
	onFocusChangeRef.current = onFocusChange;
	// biome-ignore lint/correctness/useExhaustiveDependencies: fires on a change of point, not on every render
	React.useEffect(() => {
		onFocusChangeRef.current?.(active?.point ?? null);
	}, [activeKey]);

	function focusStop(
		index: number,
		source: FocusState["source"],
		pointIndex = 0,
	) {
		const stop = stops[index];
		if (stop === undefined) {
			return;
		}
		const points = across(stop, order);
		const point = points[Math.min(pointIndex, points.length - 1)];
		setState({ stopKey: stop.key, pointKey: point.key, source, pinned: false });
	}

	function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
		if (stops.length === 0) {
			return;
		}
		const stopIndex = active ? stops.indexOf(active.stop) : -1;
		const along = ALONG_KEYS[order];
		const crossing = ACROSS_KEYS[order];
		const { key } = event;
		let handled = true;
		if (along.next.includes(key)) {
			focusStop(
				stopIndex === -1 ? 0 : Math.min(stops.length - 1, stopIndex + 1),
				"keyboard",
			);
		} else if (along.previous.includes(key)) {
			focusStop(stopIndex === -1 ? 0 : Math.max(0, stopIndex - 1), "keyboard");
		} else if (key === "Home") {
			focusStop(0, "keyboard");
		} else if (key === "End") {
			focusStop(stops.length - 1, "keyboard");
		} else if (
			active &&
			(crossing.next.includes(key) || crossing.previous.includes(key))
		) {
			const points = across(active.stop, order);
			const current = points.indexOf(active.point);
			const step = crossing.next.includes(key) ? 1 : -1;
			const next =
				points[Math.min(points.length - 1, Math.max(0, current + step))];
			setState({
				stopKey: active.stop.key,
				pointKey: next.key,
				source: "keyboard",
				pinned: false,
			});
		} else if ((key === "Enter" || key === " ") && active) {
			setState({
				stopKey: active.stop.key,
				pointKey: active.point.key,
				source: "keyboard",
				pinned: !active.pinned,
			});
			onSelect?.(active.pinned ? null : active.point);
		} else if (key === "Escape" && active) {
			setState(
				active.pinned
					? {
							stopKey: active.stop.key,
							pointKey: active.point.key,
							source: "keyboard",
							pinned: false,
						}
					: null,
			);
		} else {
			handled = false;
		}
		if (handled) {
			event.preventDefault();
		}
	}

	function localPoint(
		event: React.PointerEvent<HTMLElement> | React.MouseEvent<HTMLElement>,
	) {
		const box = event.currentTarget.getBoundingClientRect();
		return { x: event.clientX - box.left, y: event.clientY - box.top };
	}

	function onPointerMove(event: React.PointerEvent<HTMLElement>) {
		if (active?.pinned) {
			return;
		}
		const { x, y } = localPoint(event);
		const hit = hitTest(x, y);
		if (hit === null) {
			setState(null);
			return;
		}
		const stop = stops[hit.stop];
		const point = stop.points[hit.point];
		if (stop.key !== state?.stopKey || point.key !== state?.pointKey) {
			setState({
				stopKey: stop.key,
				pointKey: point.key,
				source: "pointer",
				pinned: false,
			});
		}
	}

	function onPointerLeave() {
		if (!active?.pinned) {
			setState(null);
		}
	}

	function onClick(event: React.MouseEvent<HTMLElement>) {
		const { x, y } = localPoint(event);
		const hit = hitTest(x, y);
		if (hit === null) {
			setState(null);
			onSelect?.(null);
			return;
		}
		const stop = stops[hit.stop];
		const point = stop.points[hit.point];
		const unpin = active?.pinned === true && active.point.key === point.key;
		setState({
			stopKey: stop.key,
			pointKey: point.key,
			source: "pointer",
			pinned: !unpin,
		});
		onSelect?.(unpin ? null : point);
	}

	function onFocus(event: React.FocusEvent<HTMLElement>) {
		if (state === null && event.currentTarget.matches(":focus-visible")) {
			focusStop(0, "keyboard");
		}
	}

	function onBlur() {
		setState(null);
	}

	return {
		active,
		handlers: {
			onKeyDown,
			onPointerMove,
			onPointerLeave,
			onClick,
			onFocus,
			onBlur,
		},
	};
}
