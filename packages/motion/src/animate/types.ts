import type { ReducedMotionPolicy } from "#/accessibility/reduced-motion.ts";
import type { EasingDefinition } from "#/easing/types.ts";
import type { SpringOptions } from "#/generators/types.ts";

export type Delay = number | ((index: number, total: number) => number);

export interface AnimationOptions extends SpringOptions {
	/**
	 * "spring" by default for two numeric keyframes, "tween" otherwise. A tween
	 * lasts `duration` seconds (0.3 by default); a spring's `duration` is its
	 * perceived duration.
	 */
	readonly type?: "spring" | "tween";
	readonly delay?: Delay;
	readonly ease?: EasingDefinition | readonly EasingDefinition[];
	/** Where each keyframe sits, 0 to 1, for a tween over several keyframes. */
	readonly times?: readonly number[];
	readonly repeat?: number;
	readonly repeatType?: "loop" | "reverse";
	/** Units per second, for a spring. Defaults to the velocity the value already has. */
	readonly velocity?: number;
	/** Overrides the global policy for this animation. */
	readonly reducedMotion?: ReducedMotionPolicy;
}

export interface ValueAnimationOptions<T> extends AnimationOptions {
	readonly onUpdate?: (value: T) => void;
	readonly onComplete?: () => void;
}

export type AnimationState = "running" | "paused" | "finished";

/**
 * What every `animate` call returns, whatever drives it. Awaitable: it
 * resolves when the animation finishes, is stopped or is cancelled.
 */
export interface AnimationControls extends PromiseLike<void> {
	readonly finished: Promise<void>;
	/** Seconds since the start, delay included. Settable to scrub. */
	time: number;
	speed: number;
	/** Seconds from the start to the end, delay included. */
	readonly duration: number;
	readonly state: AnimationState;
	play(): void;
	pause(): void;
	/** Stops where it is: the value stays as painted. */
	stop(): void;
	/** Stops and goes back to where it started. */
	cancel(): void;
	/** Jumps to the end. */
	complete(): void;
	/** Lets a native scroll or view timeline drive it; false when part of it runs in JavaScript. */
	attachTimeline(timeline: AnimationTimeline): boolean;
}

export type KeyframeValue = number | string;
export type Keyframes<T = KeyframeValue> = T | readonly T[];

/**
 * DOM keyframes: any CSS property (camelCase), a CSS variable (`--name`),
 * the independent transforms (`x`, `y`, `z`, `scale`, `scaleX`, `scaleY`,
 * `rotate`), or an SVG attribute. A single value animates from the current
 * one; an array lists every keyframe. Numbers take the property's unit (px,
 * deg) when it has one.
 */
export type DOMKeyframes = Readonly<Record<string, Keyframes>>;

export type ElementTarget = Element | string | ArrayLike<Element>;
