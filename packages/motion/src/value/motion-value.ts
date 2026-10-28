import { now } from "#/frame/frame.ts";

export type MotionValueEvent =
	| "change"
	| "animationStart"
	| "animationComplete"
	| "animationCancel";

/** What `animate()` hands a value it drives; `finished` lets the value announce the end. */
export interface MotionValueAnimation {
	stop(): void;
	readonly finished?: PromiseLike<unknown>;
}

export interface MotionValue<T = number> {
	get(): T;
	/** Sets the value and tracks its velocity. */
	set(value: T): void;
	/** Sets the value with no velocity and stops any animation. */
	jump(value: T): void;
	/** Units per second; 0 for a non-number or a value left alone for 30 ms. */
	getVelocity(): number;
	getPrevious(): T | undefined;
	on(event: "change", listener: (value: T) => void): () => void;
	on(
		event: Exclude<MotionValueEvent, "change">,
		listener: () => void,
	): () => void;
	/** Stops the running animation (`animationCancel`), then `animationStart`. */
	start(animation: MotionValueAnimation): void;
	/** Stops the running animation, if any, with `animationCancel`. */
	stop(): void;
	isAnimating(): boolean;
	destroy(): void;
}

const STALE_AFTER = 30;
const values = new WeakSet<object>();

export function isMotionValue(value: unknown): value is MotionValue<unknown> {
	return typeof value === "object" && value !== null && values.has(value);
}

export function motionValue<T>(initial: T): MotionValue<T> {
	let current = initial;
	let updatedAt = now();
	let last: T | undefined;
	let previous: T | undefined;
	let previousAt = updatedAt;
	let animation: MotionValueAnimation | undefined;
	const listeners = new Map<MotionValueEvent, Set<(value?: T) => void>>();

	function emit(event: MotionValueEvent): void {
		for (const listener of listeners.get(event) ?? []) listener(current);
	}

	function stop(): void {
		const running = animation;
		if (!running) return;
		// Cleared first: the animation's own stop may call back into this value.
		animation = undefined;
		running.stop();
		emit("animationCancel");
	}

	const value: MotionValue<T> = {
		get: () => current,
		set(next) {
			const time = now();
			// Two sets in one frame keep the previous frame's sample, so velocity
			// spans real time instead of dividing by zero.
			if (time !== updatedAt) {
				previous = current;
				previousAt = updatedAt;
			}
			last = current;
			current = next;
			updatedAt = time;
			emit("change");
		},
		jump(next) {
			stop();
			last = current;
			current = next;
			previous = undefined;
			updatedAt = now();
			previousAt = updatedAt;
			emit("change");
		},
		getVelocity() {
			const elapsed = updatedAt - previousAt;
			if (
				typeof current !== "number" ||
				typeof previous !== "number" ||
				elapsed <= 0 ||
				now() - updatedAt > STALE_AFTER
			) {
				return 0;
			}
			return ((current - previous) / elapsed) * 1000;
		},
		getPrevious: () => last,
		// One implementation behind both overloads: a lifecycle listener ignores the argument.
		on: ((event: MotionValueEvent, listener: (value?: T) => void) => {
			const set = listeners.get(event) ?? new Set();
			listeners.set(event, set);
			set.add(listener);
			return () => {
				set.delete(listener);
			};
		}) as MotionValue<T>["on"],
		start(next) {
			stop();
			animation = next;
			emit("animationStart");
			next.finished?.then(() => {
				if (animation !== next) return;
				animation = undefined;
				emit("animationComplete");
			});
		},
		stop,
		isAnimating: () => animation !== undefined,
		destroy() {
			stop();
			listeners.clear();
		},
	};
	values.add(value);
	return value;
}
