import { animateElements } from "#/animate/dom.ts";
import { jsAnimation } from "#/animate/js-animation.ts";
import type {
	AnimationControls,
	AnimationOptions,
	DOMKeyframes,
	ElementTarget,
	Keyframes,
	ValueAnimationOptions,
} from "#/animate/types.ts";
import { animateMotionValue, animateObject } from "#/animate/value.ts";
import { animateSequence, type Segment } from "#/sequence/sequence.ts";
import {
	isMotionValue,
	type MotionValue,
	motionValue,
} from "#/value/motion-value.ts";

export interface Animate {
	/** Elements: a selector, an element or a list. Played by the browser where it can. */
	(
		target: ElementTarget,
		keyframes: DOMKeyframes,
		options?: AnimationOptions,
	): AnimationControls;
	/** A motion value, from wherever it is now. */
	<T>(
		value: MotionValue<T>,
		target: Keyframes<T>,
		options?: ValueAnimationOptions<T>,
	): AnimationControls;
	/** A number, a colour, a path… from one value to another, read in `onUpdate`. */
	<T extends number | string>(
		from: T,
		to: Keyframes<T>,
		options: ValueAnimationOptions<T>,
	): AnimationControls;
	/** The keys of a plain object, written back into it. */
	<T extends object>(
		object: T,
		keyframes: { readonly [K in keyof T]?: Keyframes<T[K]> },
		options?: ValueAnimationOptions<T>,
	): AnimationControls;
	/** A timeline of segments. */
	(sequence: readonly Segment[], options?: AnimationOptions): AnimationControls;
}

function isElementList(target: unknown): target is ArrayLike<Element> {
	return (
		typeof target === "object" &&
		target !== null &&
		"length" in target &&
		(Array.from(target as ArrayLike<unknown>).every(
			(item) => typeof Element !== "undefined" && item instanceof Element,
		) as boolean)
	);
}

/** A label object is a plain `{ name }`: a form element also has a `name`. */
function isSegment(item: unknown): boolean {
	return (
		typeof item === "string" ||
		Array.isArray(item) ||
		(typeof item === "object" &&
			item !== null &&
			Object.getPrototypeOf(item) === Object.prototype &&
			"name" in item)
	);
}

function isSequence(target: unknown, second: unknown): target is Segment[] {
	return (
		Array.isArray(target) &&
		(second === undefined || !Array.isArray(second)) &&
		target.length > 0 &&
		target.every(isSegment)
	);
}

/** `animate`, with selectors looked up inside `scope` (the whole document by default). */
export function createAnimate(scope?: () => ParentNode | null): Animate {
	function elementsOf(target: unknown): readonly Element[] {
		if (typeof target === "string") {
			const root =
				scope?.() ?? (typeof document === "undefined" ? null : document);
			return root ? Array.from(root.querySelectorAll(target)) : [];
		}
		if (typeof Element !== "undefined" && target instanceof Element)
			return [target];
		return Array.from(target as ArrayLike<Element>);
	}

	function animateOne(
		target: unknown,
		keyframes: unknown,
		options: AnimationOptions = {},
	): AnimationControls {
		if (isMotionValue(target)) {
			return animateMotionValue(
				target,
				keyframes as Keyframes<unknown>,
				options,
			);
		}
		const domKeyframes =
			typeof keyframes === "object" &&
			keyframes !== null &&
			!Array.isArray(keyframes);
		if (
			domKeyframes &&
			(typeof target === "string" ||
				(typeof Element !== "undefined" && target instanceof Element) ||
				isElementList(target))
		) {
			return animateElements(
				elementsOf(target),
				keyframes as DOMKeyframes,
				options,
				jsAnimation,
			);
		}
		if (typeof target === "number" || typeof target === "string") {
			return animateMotionValue(
				motionValue(target),
				keyframes as Keyframes<unknown>,
				options,
			);
		}
		return animateObject(
			target as object,
			keyframes as Record<string, Keyframes<unknown>>,
			options,
		);
	}

	function targetsOf(target: unknown): readonly object[] {
		const isDom =
			typeof target === "string" ||
			(typeof Element !== "undefined" && target instanceof Element) ||
			isElementList(target);
		return isDom ? elementsOf(target) : [target as object];
	}

	return ((target: unknown, second?: unknown, options?: AnimationOptions) =>
		isSequence(target, second)
			? animateSequence(
					target,
					(second as AnimationOptions) ?? {},
					animateOne,
					targetsOf,
				)
			: animateOne(target, second, options)) as Animate;
}

export const animate: Animate = createAnimate();
