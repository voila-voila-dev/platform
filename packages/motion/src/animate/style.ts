import type { KeyframeValue } from "#/animate/types.ts";

type TransformProperty = "translate" | "scale" | "rotate" | "transform";

interface TransformChannel {
	readonly property: TransformProperty;
	readonly unit: string;
	readonly identity: number;
	/** The channel alone as a value of its property, the other axes at identity. */
	readonly alone: (value: string) => string;
}

/**
 * The transforms with no CSS property of their own (`rotate` takes one axis,
 * and skew has none): they go through `transform`, in this order, after
 * `translate`, `rotate` and `scale`.
 */
const LISTED = ["rotateX", "rotateY", "skew", "skewX", "skewY"];

/**
 * The independent transforms. Each animates its CSS property alone with
 * `composite: "add"`, so `x` and `y` run as two compositor animations that
 * sum, and one can be interrupted without touching the other.
 */
export const TRANSFORMS: Readonly<Record<string, TransformChannel>> = {
	x: { property: "translate", unit: "px", identity: 0, alone: (v) => `${v}` },
	y: {
		property: "translate",
		unit: "px",
		identity: 0,
		alone: (v) => `0px ${v}`,
	},
	z: {
		property: "translate",
		unit: "px",
		identity: 0,
		alone: (v) => `0px 0px ${v}`,
	},
	scale: { property: "scale", unit: "", identity: 1, alone: (v) => `${v}` },
	scaleX: { property: "scale", unit: "", identity: 1, alone: (v) => `${v} 1` },
	scaleY: { property: "scale", unit: "", identity: 1, alone: (v) => `1 ${v}` },
	rotate: {
		property: "rotate",
		unit: "deg",
		identity: 0,
		alone: (v) => `${v}`,
	},
	...Object.fromEntries(
		LISTED.map((key) => [
			key,
			{
				property: "transform",
				unit: "deg",
				identity: 0,
				// The whole list, the others at identity: accumulated onto the
				// inline list, every function keeps its place whatever starts when.
				alone: (v: string) =>
					LISTED.map((one) => `${one}(${one === key ? v : "0deg"})`).join(" "),
			},
		]),
	),
};

const UNITLESS = new Set([
	"opacity",
	"zIndex",
	"fontWeight",
	"lineHeight",
	"flexGrow",
	"flexShrink",
	"order",
	"fillOpacity",
	"strokeOpacity",
	"strokeMiterlimit",
	"aspectRatio",
	"pathLength",
]);

/** A keyframe as CSS: numbers take the property's unit. */
export function withUnit(key: string, value: KeyframeValue): string {
	if (typeof value === "string") return value;
	const unit =
		TRANSFORMS[key]?.unit ??
		(UNITLESS.has(key) || key.startsWith("--") ? "" : "px");
	return `${value}${unit}`;
}

/** Committed transform values per element, the ones no animation is driving. */
const committed = new WeakMap<Element, Map<string, KeyframeValue>>();
const animating = new WeakMap<Element, Set<string>>();

function entries<T>(
	map: WeakMap<Element, T>,
	element: Element,
	fresh: () => T,
) {
	const existing = map.get(element);
	if (existing) return existing;
	const created = fresh();
	map.set(element, created);
	return created;
}

export function committedTransform(element: Element, key: string): number {
	const value = committed.get(element)?.get(key);
	return typeof value === "number"
		? value
		: Number.parseFloat(value ?? "") || (TRANSFORMS[key]?.identity ?? 0);
}

function channel(element: Element, key: string): string {
	const channelDef = TRANSFORMS[key] as TransformChannel;
	if (animating.get(element)?.has(key))
		return `${channelDef.identity}${channelDef.unit}`;
	return withUnit(key, committed.get(element)?.get(key) ?? channelDef.identity);
}

/** Writes the committed transforms inline, with every animating channel at its identity. */
export function writeTransforms(element: Element) {
	const style = (element as HTMLElement).style;
	const at = (key: string) => channel(element, key);
	style.translate = `${at("x")} ${at("y")} ${at("z")}`;
	const uniform = Number.parseFloat(at("scale"));
	style.scale = `${uniform * Number.parseFloat(at("scaleX"))} ${uniform * Number.parseFloat(at("scaleY"))}`;
	style.rotate = at("rotate");
	// `transform` stays the page's on an element that never animates these.
	if (
		LISTED.some(
			(key) =>
				committed.get(element)?.has(key) || animating.get(element)?.has(key),
		)
	) {
		style.transform = LISTED.map((key) => `${key}(${at(key)})`).join(" ");
	}
}

export function beginTransform(element: Element, key: string) {
	entries(animating, element, () => new Set()).add(key);
	writeTransforms(element);
}

export function commitTransform(
	element: Element,
	key: string,
	value: KeyframeValue,
) {
	entries(committed, element, () => new Map()).set(key, value);
	animating.get(element)?.delete(key);
	writeTransforms(element);
}

export function cssName(key: string): string {
	return key.startsWith("--")
		? key
		: key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/** Moves things on screen, as opposed to fading or tinting them: what reduced motion turns off. */
export function isMovement(key: string): boolean {
	return !/opacity|color|fill|stroke$|filter/i.test(key);
}
