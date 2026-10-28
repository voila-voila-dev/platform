import { shouldReduceMotion } from "#/accessibility/reduced-motion.ts";
import { finishedControls, groupControls } from "#/animate/controls.ts";
import type { JsAnimation, JsAnimationConfig } from "#/animate/js-animation.ts";
import {
	beginTransform,
	commitTransform,
	committedTransform,
	cssName,
	isMovement,
	TRANSFORMS,
	withUnit,
} from "#/animate/style.ts";
import type {
	AnimationControls,
	AnimationOptions,
	DOMKeyframes,
	KeyframeValue,
} from "#/animate/types.ts";
import { waapiAnimation } from "#/animate/waapi.ts";

/** Attributes an SVG element animates in JavaScript: `d` morphs, the rest are geometry. */
const SVG_ATTRIBUTES: Readonly<Record<string, string>> = {
	d: "d",
	points: "points",
	viewBox: "viewBox",
	cx: "cx",
	cy: "cy",
	r: "r",
	rx: "rx",
	ry: "ry",
	x1: "x1",
	y1: "y1",
	x2: "x2",
	y2: "y2",
	attrX: "x",
	attrY: "y",
	attrWidth: "width",
	attrHeight: "height",
};

/**
 * Plays what the browser can't (SVG attributes, CSS variables) on the frame
 * loop. Injected, so an entry that only needs the browser's half never loads
 * the interpolators.
 */
export type ScriptedChannel = (
	config: JsAnimationConfig<KeyframeValue>,
) => JsAnimation<KeyframeValue>;

/**
 * The independent transforms add up. The listed ones (`transform`)
 * accumulate: function by function, so their order never depends on which
 * started first.
 */
const COMPOSITES: Readonly<Record<string, CompositeOperation>> = {
	translate: "add",
	scale: "add",
	rotate: "add",
	transform: "accumulate",
};

const running = new WeakMap<Element, Map<string, JsAnimation<KeyframeValue>>>();

interface Channel {
	read(): KeyframeValue;
	write(value: KeyframeValue): void;
	readonly native: boolean;
}

function channelOf(element: Element, key: string): Channel {
	const style = (element as HTMLElement).style;
	const attribute =
		element instanceof SVGElement ? SVG_ATTRIBUTES[key] : undefined;
	if (TRANSFORMS[key]) {
		return {
			read: () => committedTransform(element, key),
			write: (value) => commitTransform(element, key, value),
			native: true,
		};
	}
	if (attribute) {
		return {
			read: () => element.getAttribute(attribute) ?? "",
			write: (value) => element.setAttribute(attribute, String(value)),
			native: false,
		};
	}
	const name = cssName(key);
	return {
		read: () => getComputedStyle(element).getPropertyValue(name).trim(),
		write: (value) => style.setProperty(name, withUnit(key, value)),
		// An unregistered custom property only animates discretely in the browser.
		native: !key.startsWith("--"),
	};
}

function asTarget(read: KeyframeValue, target: KeyframeValue): KeyframeValue {
	return typeof target === "number" && typeof read === "string"
		? Number.parseFloat(read) || 0
		: read;
}

function animateChannel(
	element: Element,
	key: string,
	value: KeyframeValue | readonly KeyframeValue[],
	options: AnimationOptions,
	delay: number,
	scripted: ScriptedChannel | undefined,
): AnimationControls {
	const channel = channelOf(element, key);
	const list: readonly KeyframeValue[] = Array.isArray(value) ? value : [value];
	const target = list.at(-1) as KeyframeValue;
	const animations = running.get(element) ?? new Map();
	running.set(element, animations);
	const previous = animations.get(key);
	const now = previous?.current();
	previous?.stop();
	const from = now?.value ?? asTarget(channel.read(), target);
	const keyframes = list.length > 1 ? list : [from, target];
	if (
		(shouldReduceMotion(options.reducedMotion) && isMovement(key)) ||
		(!channel.native && !scripted)
	) {
		channel.write(target);
		return finishedControls();
	}
	const reduced = shouldReduceMotion(options.reducedMotion)
		? { ...options, type: "tween" as const, bounce: 0 }
		: options;
	const config = {
		keyframes,
		options: reduced,
		delay,
		velocity: list.length > 1 ? 0 : (now?.velocity ?? 0),
	};
	const transform = TRANSFORMS[key];
	if (transform) beginTransform(element, key);
	const animation = channel.native
		? waapiAnimation({
				...config,
				element,
				property: transform?.property ?? key,
				format: (frame) =>
					transform
						? transform.alone(withUnit(key, frame))
						: withUnit(key, frame),
				composite: COMPOSITES[transform?.property ?? ""] ?? "replace",
				commit: channel.write,
			})
		: (scripted as ScriptedChannel)({ ...config, apply: channel.write });
	animations.set(key, animation);
	animation.finished.then(() => {
		if (animations.get(key) === animation) animations.delete(key);
	});
	return animation;
}

/** Every key of every element, each its own animation, under one set of controls. */
export function animateElements(
	elements: readonly Element[],
	keyframes: DOMKeyframes,
	options: AnimationOptions,
	scripted?: ScriptedChannel,
): AnimationControls {
	const { delay } = options;
	return groupControls(
		elements.flatMap((element, index) => {
			const start =
				typeof delay === "function"
					? delay(index, elements.length)
					: (delay ?? 0);
			return Object.entries(keyframes).map(([key, value]) =>
				animateChannel(element, key, value, options, start, scripted),
			);
		}),
	);
}
