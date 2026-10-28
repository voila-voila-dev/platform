import * as React from "react";

/** The narrowest view: a hundredth of the data. */
const MAX_ZOOM = 100;

function clampDomain(
	[from, to]: readonly [number, number],
	[low, high]: readonly [number, number],
): readonly [number, number] {
	const span = Math.min(
		high - low,
		Math.max((high - low) / MAX_ZOOM, to - from),
	);
	const start = Math.min(Math.max(from, low), high - span);
	return [start, start + span];
}

/**
 * The part of a continuous x axis on show. `null` is the whole of it. Zooming
 * keeps the value under the pointer (or the focused value) where it is on
 * screen; panning never leaves the data.
 */
export function useChartZoom(
	full: readonly [number, number] | undefined,
	resetKey: unknown,
) {
	const [domain, setDomain] = React.useState<readonly [number, number] | null>(
		null,
	);
	const keyRef = React.useRef(resetKey);
	if (keyRef.current !== resetKey) {
		keyRef.current = resetKey;
		if (domain !== null) {
			setDomain(null);
		}
	}

	function apply(next: readonly [number, number]) {
		if (full === undefined) return;
		const clamped = clampDomain(next, full);
		setDomain(clamped[0] <= full[0] && clamped[1] >= full[1] ? null : clamped);
	}

	function zoomAround(center: number, factor: number) {
		if (full === undefined) return;
		const [from, to] = domain ?? full;
		const share = to === from ? 0.5 : (center - from) / (to - from);
		const span = (to - from) * factor;
		apply([center - span * share, center - span * share + span]);
	}

	function pan(delta: number) {
		if (full === undefined || domain === null) return;
		apply([domain[0] + delta, domain[1] + delta]);
	}

	return {
		domain,
		zoomAround,
		pan,
		reset: () => setDomain(null),
		span: () => {
			const [from, to] = domain ?? full ?? [0, 1];
			return to - from;
		},
	};
}
