/** What ticks the frame loop: the browser's frames by default, a test clock when injected. */
export interface FrameDriver {
	request(tick: (timestamp: number) => void): void;
	cancel(): void;
	/** Milliseconds, on the same clock as the timestamps handed to `tick`. */
	now(): number;
}

function clock(): number {
	return typeof performance === "undefined" ? Date.now() : performance.now();
}

/** Read lazily so importing on the server never touches the browser globals. */
function browserDriver(): FrameDriver {
	let handle: number | ReturnType<typeof setTimeout> | undefined;
	const hasAnimationFrame = typeof requestAnimationFrame === "function";
	return {
		request(tick) {
			handle = hasAnimationFrame
				? requestAnimationFrame(tick)
				: setTimeout(() => tick(clock()), 1000 / 60);
		},
		cancel() {
			if (handle === undefined) return;
			if (hasAnimationFrame) cancelAnimationFrame(handle as number);
			else clearTimeout(handle);
			handle = undefined;
		},
		now: clock,
	};
}

let injected: FrameDriver | undefined;
let fallback: FrameDriver | undefined;
const driverListeners = new Set<(previous: FrameDriver) => void>();

export function frameDriver(): FrameDriver {
	if (injected) return injected;
	fallback ??= browserDriver();
	return fallback;
}

/** `undefined` restores the browser's frames. */
export function setFrameDriver(driver: FrameDriver | undefined): void {
	const previous = frameDriver();
	injected = driver;
	for (const listener of driverListeners) listener(previous);
}

/** The loop listens so a driver swapped mid-animation carries the pending frame over. */
export function onFrameDriverChange(
	listener: (previous: FrameDriver) => void,
): () => void {
	driverListeners.add(listener);
	return () => driverListeners.delete(listener);
}
