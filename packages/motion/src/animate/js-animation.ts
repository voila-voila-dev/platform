import { thenable } from "#/animate/controls.ts";
import { iterationTime, planGenerator, totalDuration } from "#/animate/plan.ts";
import type {
	AnimationControls,
	AnimationOptions,
	AnimationState,
} from "#/animate/types.ts";
import { cancelFrame, type FrameData, frame, now } from "#/frame/frame.ts";
import { mix } from "#/interpolate/mix.ts";

export interface JsAnimationConfig<T> {
	/** At least two: the caller resolves a lone target against the current value. */
	readonly keyframes: readonly T[];
	readonly options: AnimationOptions;
	/** Seconds. */
	readonly delay: number;
	/** The velocity the value has now, carried into a spring. */
	readonly velocity: number;
	apply(value: T): void;
	onComplete?(): void;
}

export interface JsAnimation<T> extends AnimationControls {
	/** The value and velocity at the current time: where an interruption starts from. */
	current(): { readonly value: T; readonly velocity: number };
}

/**
 * An animation stepped by the frame loop: plain values, objects, SVG
 * attributes and CSS variables — whatever the Web Animations API can't play.
 */
export function jsAnimation<T>(config: JsAnimationConfig<T>): JsAnimation<T> {
	const { keyframes, options, delay, apply } = config;
	const { generator, positional } = planGenerator(
		keyframes,
		options,
		config.velocity,
	);
	const segments = positional
		? keyframes.slice(1).map((to, index) => mix(keyframes[index] as T, to as T))
		: [];
	const active = totalDuration(generator.duration, options);
	const duration = delay + active;
	const endsReversed =
		options.repeatType === "reverse" && (options.repeat ?? 0) % 2 === 1;
	const last = keyframes[endsReversed ? 0 : keyframes.length - 1] as T;

	let time = 0;
	let speed = 1;
	let state: AnimationState = "running";
	let previous = now();
	let resolve: () => void = () => {};
	const finished = new Promise<void>((done) => {
		resolve = done;
	});

	function valueAt(position: number): T {
		if (!positional) return position as T;
		const index = Math.min(
			Math.max(Math.floor(position), 0),
			segments.length - 1,
		);
		return (segments[index] as (progress: number) => T)(position - index);
	}

	function sample() {
		const elapsed = Math.max(0, time - delay);
		return generator.at(iterationTime(elapsed, generator.duration, options));
	}

	function render() {
		if (time < delay) return;
		apply(time >= duration ? last : valueAt(sample().value));
	}

	function settle(next: AnimationState) {
		state = next;
		cancelFrame(tick);
		resolve();
	}

	function tick(data: FrameData) {
		time = Math.max(0, time + ((data.timestamp - previous) / 1000) * speed);
		previous = data.timestamp;
		if (time < duration) {
			render();
			return;
		}
		time = duration;
		render();
		settle("finished");
		config.onComplete?.();
	}

	function play() {
		if (state === "running") return;
		previous = now();
		state = "running";
		frame.update(tick, true);
	}

	frame.update(tick, true);
	render();

	return {
		...thenable(finished),
		get time() {
			return time;
		},
		set time(seconds) {
			time = Math.min(Math.max(seconds, 0), duration);
			render();
		},
		get speed() {
			return speed;
		},
		set speed(rate) {
			speed = rate;
		},
		duration,
		get state() {
			return state;
		},
		play,
		pause() {
			if (state !== "running") return;
			state = "paused";
			cancelFrame(tick);
		},
		stop: () => settle("finished"),
		cancel() {
			apply(keyframes[0] as T);
			settle("finished");
		},
		complete() {
			if (state === "finished") return;
			time = duration;
			render();
			settle("finished");
			config.onComplete?.();
		},
		attachTimeline: () => false,
		current() {
			const { value, velocity } = sample();
			return {
				value: time < delay ? (keyframes[0] as T) : valueAt(value),
				velocity: positional || time < delay ? 0 : velocity,
			};
		},
	};
}
