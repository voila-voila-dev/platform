import { frameDriver, onFrameDriverChange } from "#/frame/driver.ts";

export interface FrameData {
	/** Milliseconds since the previous frame, clamped so a backgrounded tab does not teleport. */
	readonly delta: number;
	readonly timestamp: number;
}

export type FrameCallback = (data: FrameData) => void;

type Schedule = (callback: FrameCallback, keepAlive?: boolean) => FrameCallback;

const PHASES = ["read", "update", "render"] as const;
const IDEAL_DELTA = 1000 / 60;
const MAX_DELTA = 40;

let pending = PHASES.map(() => new Set<FrameCallback>());
let running: Set<FrameCallback> | undefined;
let keepAlive = new Set<FrameCallback>();
let scheduled = false;
let inFrame = false;
let data: FrameData = { delta: IDEAL_DELTA, timestamp: 0 };
let lastTimestamp: number | undefined;

function request(): void {
	if (scheduled) return;
	scheduled = true;
	frameDriver().request(tick);
}

function tick(timestamp: number): void {
	scheduled = false;
	const delta =
		lastTimestamp === undefined
			? IDEAL_DELTA
			: Math.max(1, Math.min(timestamp - lastTimestamp, MAX_DELTA));
	data = { delta, timestamp };
	inFrame = true;
	// Swapping each phase's set as it starts is what makes the scheduling rule
	// hold: a later phase's set is still the one that will run, an earlier or
	// the current phase's set is already the next frame's.
	pending.forEach((_, index) => {
		running = pending[index];
		pending[index] = new Set();
		for (const callback of running) {
			callback(data);
			if (keepAlive.has(callback)) pending[index].add(callback);
		}
	});
	running = undefined;
	inFrame = false;
	const idle = pending.every((set) => set.size === 0);
	lastTimestamp = idle ? undefined : timestamp;
	if (!idle) request();
}

function schedule(phase: number): Schedule {
	return (callback, alive = false) => {
		if (alive) keepAlive.add(callback);
		pending[phase].add(callback);
		request();
		return callback;
	};
}

export const frame: {
	readonly read: Schedule;
	readonly update: Schedule;
	readonly render: Schedule;
} = { read: schedule(0), update: schedule(1), render: schedule(2) };

export function cancelFrame(callback: FrameCallback): void {
	keepAlive.delete(callback);
	running?.delete(callback);
	for (const set of pending) set.delete(callback);
}

export function frameData(): FrameData {
	return data;
}

/** Milliseconds; inside a frame, that frame's timestamp, so every value read in it agrees. */
export function now(): number {
	return inFrame ? data.timestamp : frameDriver().now();
}

/** For tests: forget every callback and the frame clock. */
export function resetFrameLoop(): void {
	if (scheduled) frameDriver().cancel();
	pending = PHASES.map(() => new Set<FrameCallback>());
	keepAlive = new Set();
	scheduled = false;
	lastTimestamp = undefined;
	data = { delta: IDEAL_DELTA, timestamp: 0 };
}

onFrameDriverChange((previous) => {
	if (!scheduled) return;
	previous.cancel();
	scheduled = false;
	request();
});
