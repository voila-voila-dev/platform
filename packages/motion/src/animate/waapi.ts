import { thenable } from "#/animate/controls.ts";
import type { JsAnimation } from "#/animate/js-animation.ts";
import { iterationTime, planGenerator } from "#/animate/plan.ts";
import { cssName } from "#/animate/style.ts";
import type {
	AnimationOptions,
	AnimationState,
	KeyframeValue,
} from "#/animate/types.ts";
import { linearEasing, supportsLinearEasing } from "#/easing/linear-css.ts";
import { easingToCss, resolveEasing } from "#/easing/named.ts";
import type { EasingDefinition } from "#/easing/types.ts";
import type { Generator } from "#/generators/types.ts";

export interface WaapiConfig {
	readonly element: Element;
	/** The CSS property the browser animates. */
	readonly property: string;
	readonly keyframes: readonly KeyframeValue[];
	/** A keyframe as the property's CSS value. */
	format(value: KeyframeValue): string;
	readonly options: AnimationOptions;
	readonly delay: number;
	readonly velocity: number;
	readonly composite: CompositeOperation;
	/** Writes the value that stays once the animation is gone. */
	commit(value: KeyframeValue): void;
	onComplete?(): void;
}

const SAMPLE_STEP = 1 / 60;

function cssEasing(definition: EasingDefinition, duration: number): string {
	return (
		easingToCss(definition) ?? linearEasing(resolveEasing(definition), duration)
	);
}

/**
 * The browser keyframes and easing. Two keyframes on a spring become one
 * `linear()` easing sampled from the spring, so the compositor plays the
 * exact curve. Without `linear()`, or when the spring starts and ends at the
 * same value (a flick of velocity), the spring is sampled into keyframes.
 */
function browserKeyframes(
	config: WaapiConfig,
	generator: Generator,
	positional: boolean,
): { keyframes: Keyframe[]; easing: string } {
	const { keyframes, format, property, options } = config;
	const duration = generator.duration;
	const [from, to] = keyframes;
	const springs =
		options.type !== "tween" && keyframes.length === 2 && !options.ease;
	const span =
		typeof from === "number" && typeof to === "number" ? to - from : 1;
	if (springs && span !== 0 && supportsLinearEasing()) {
		const progress = (t: number) => {
			const { value } = generator.at(t * duration);
			return positional ? value : (value - (from as number)) / span;
		};
		return {
			keyframes: keyframes.map((frame) => ({ [property]: format(frame) })),
			easing: linearEasing(progress, duration),
		};
	}
	if (springs && !positional) {
		const count = Math.max(2, Math.ceil(duration / SAMPLE_STEP) + 1);
		return {
			keyframes: Array.from({ length: count }, (_unused, index) => {
				const offset = index / (count - 1);
				return {
					[property]: format(generator.at(offset * duration).value),
					offset,
				};
			}),
			easing: "linear",
		};
	}
	const ease = options.ease ?? "easeOut";
	return {
		keyframes: keyframes.map((frame, index) => ({
			[property]: format(frame),
			offset: options.times?.[index] ?? index / (keyframes.length - 1),
			easing: cssEasing(
				Array.isArray(ease) && typeof ease[0] !== "number"
					? ((ease as readonly EasingDefinition[])[index] ?? "linear")
					: (ease as EasingDefinition),
				duration,
			),
		})),
		easing: "linear",
	};
}

const STATES: Record<AnimationPlayState, AnimationState> = {
	running: "running",
	paused: "paused",
	finished: "finished",
	idle: "finished",
};

/** One CSS property of one element, played by the Web Animations API. */
export function waapiAnimation(
	config: WaapiConfig,
): JsAnimation<KeyframeValue> {
	const { element, keyframes, options, delay, commit } = config;
	const { generator, positional } = planGenerator(
		keyframes,
		options,
		config.velocity,
	);
	const iterations = (options.repeat ?? 0) + 1;
	const { keyframes: frames, easing } = browserKeyframes(
		config,
		generator,
		positional,
	);
	const animation = element.animate(frames, {
		duration: generator.duration * 1000,
		delay: delay * 1000,
		iterations,
		direction: options.repeatType === "reverse" ? "alternate" : "normal",
		easing,
		fill: "both",
		composite: config.composite,
	});
	const last = keyframes[
		options.repeatType === "reverse" && iterations % 2 === 0
			? 0
			: keyframes.length - 1
	] as KeyframeValue;

	let settled = false;
	/** What stayed on screen when it settled: where a following animation starts. */
	let held: KeyframeValue = keyframes[0] as KeyframeValue;
	let resolve: () => void = () => {};
	const finished = new Promise<void>((done) => {
		resolve = done;
	});

	function current() {
		if (settled) return { value: held, velocity: 0 };
		const elapsed = (Number(animation.currentTime) || 0) / 1000 - delay;
		if (elapsed <= 0)
			return { value: keyframes[0] as KeyframeValue, velocity: 0 };
		const state = generator.at(
			iterationTime(elapsed, generator.duration, options),
		);
		if (!positional) return state;
		// The browser mixes colours and strings itself: ask it what it painted.
		const painted =
			config.composite === "replace"
				? getComputedStyle(element).getPropertyValue(cssName(config.property))
				: "";
		return { value: painted || last, velocity: 0 };
	}

	function settle(value: KeyframeValue | undefined) {
		if (settled) return;
		settled = true;
		if (value !== undefined) {
			held = value;
			commit(value);
		}
		animation.cancel();
		resolve();
	}

	animation.finished.then(
		() => {
			if (settled) return;
			settle(last);
			config.onComplete?.();
		},
		() => settle(undefined),
	);

	return {
		...thenable(finished),
		get time() {
			return (Number(animation.currentTime) || 0) / 1000;
		},
		set time(seconds) {
			animation.currentTime = seconds * 1000;
		},
		get speed() {
			return animation.playbackRate;
		},
		set speed(rate) {
			animation.playbackRate = rate;
		},
		duration: delay + generator.duration * iterations,
		get state() {
			return settled ? "finished" : STATES[animation.playState];
		},
		play: () => animation.play(),
		pause: () => animation.pause(),
		stop: () => settle(current().value),
		cancel: () => settle(keyframes[0]),
		// The browser refuses to finish an endless animation: settle on its last frame instead.
		complete: () =>
			iterations === Number.POSITIVE_INFINITY
				? settle(last)
				: animation.finish(),
		attachTimeline(timeline) {
			animation.timeline = timeline;
			return true;
		},
		current,
	};
}
