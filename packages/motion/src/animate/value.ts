import { shouldReduceMotion } from "#/accessibility/reduced-motion.ts";
import { finishedControls, groupControls } from "#/animate/controls.ts";
import { jsAnimation } from "#/animate/js-animation.ts";
import type {
	AnimationControls,
	AnimationOptions,
	Keyframes,
	ValueAnimationOptions,
} from "#/animate/types.ts";
import { cancelFrame, frame } from "#/frame/frame.ts";
import type { MotionValue } from "#/value/motion-value.ts";

function startDelay(options: AnimationOptions): number {
	return typeof options.delay === "function"
		? options.delay(0, 1)
		: (options.delay ?? 0);
}

/**
 * A motion value towards a target on the frame loop. Whatever the value is
 * doing now — mid-spring, dragged — is where the new animation starts, at
 * the same speed.
 */
export function animateMotionValue<T>(
	value: MotionValue<T>,
	target: Keyframes<T>,
	options: ValueAnimationOptions<T> = {},
): AnimationControls {
	const list: readonly T[] = Array.isArray(target) ? target : [target as T];
	const keyframes = list.length > 1 ? list : [value.get(), list[0] as T];
	const velocity = value.getVelocity();
	value.stop();
	if (shouldReduceMotion(options.reducedMotion)) {
		value.jump(keyframes.at(-1) as T);
		options.onUpdate?.(value.get());
		options.onComplete?.();
		return finishedControls();
	}
	const animation = jsAnimation({
		keyframes,
		options,
		delay: startDelay(options),
		velocity: list.length > 1 ? 0 : velocity,
		apply(next: T) {
			value.set(next);
			options.onUpdate?.(next);
		},
		onComplete: options.onComplete,
	});
	value.start(animation);
	return animation;
}

/** Each numeric or mixable key of a plain object, written back into the object. */
export function animateObject<T extends object>(
	object: T,
	keyframes: { readonly [K in keyof T]?: Keyframes<T[K]> },
	options: ValueAnimationOptions<T> = {},
): AnimationControls {
	const record = object as Record<string, unknown>;
	const reduce = shouldReduceMotion(options.reducedMotion);
	const controls = Object.entries(keyframes).map(([key, target]) => {
		const list: readonly unknown[] = Array.isArray(target) ? target : [target];
		const frames = list.length > 1 ? list : [record[key], list[0]];
		if (reduce) {
			record[key] = frames.at(-1);
			return finishedControls();
		}
		return jsAnimation({
			keyframes: frames,
			options,
			delay: startDelay(options),
			velocity: 0,
			apply(next) {
				record[key] = next;
			},
		});
	});
	if (reduce) options.onUpdate?.(object);
	// One update per frame for the whole object, after every key has moved.
	const group = groupControls(controls);
	const notify = options.onUpdate;
	if (notify && !reduce) {
		const each = () => notify(object);
		frame.render(each, true);
		group.finished.then(() => {
			cancelFrame(each);
			notify(object);
		});
	}
	group.finished.then(() => options.onComplete?.());
	return group;
}
