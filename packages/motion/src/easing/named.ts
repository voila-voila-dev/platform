import { cubicBezier } from "#/easing/cubic-bezier.ts";
import type {
	CubicBezier,
	Easing,
	EasingDefinition,
	EasingName,
} from "#/easing/types.ts";

function reverse(easing: Easing): Easing {
	return (progress) => 1 - easing(1 - progress);
}

function mirror(easing: Easing): Easing {
	return (progress) =>
		progress <= 0.5
			? easing(2 * progress) / 2
			: (2 - easing(2 * (1 - progress))) / 2;
}

/** The named easings that are plain CSS curves, so WAAPI plays them natively. */
const BEZIERS: Partial<Record<EasingName, CubicBezier>> = {
	easeIn: [0.42, 0, 1, 1],
	easeOut: [0, 0, 0.58, 1],
	easeInOut: [0.42, 0, 0.58, 1],
	backIn: [0.31, 0.01, 0.66, -0.59],
	backOut: [0.33, 1.53, 0.69, 0.99],
};

export const linear: Easing = (progress) => progress;
export const easeIn = cubicBezier(0.42, 0, 1, 1);
export const easeOut = cubicBezier(0, 0, 0.58, 1);
export const easeInOut = cubicBezier(0.42, 0, 0.58, 1);
export const circIn: Easing = (progress) =>
	1 - Math.sin(Math.acos(Math.min(1, Math.max(0, progress))));
export const circOut = reverse(circIn);
export const circInOut = mirror(circIn);
export const backIn = cubicBezier(0.31, 0.01, 0.66, -0.59);
export const backOut = cubicBezier(0.33, 1.53, 0.69, 0.99);
export const backInOut = mirror(backIn);
export const anticipate: Easing = (progress) => {
	const doubled = progress * 2;
	return doubled < 1
		? 0.5 * backIn(doubled)
		: 0.5 * (2 - 2 ** (-10 * (doubled - 1)));
};

const NAMED: Record<EasingName, Easing> = {
	linear,
	easeIn,
	easeOut,
	easeInOut,
	circIn,
	circOut,
	circInOut,
	backIn,
	backOut,
	backInOut,
	anticipate,
};

export function resolveEasing(definition: EasingDefinition): Easing {
	if (typeof definition === "function") {
		return definition;
	}
	if (typeof definition === "string") {
		return NAMED[definition];
	}
	return cubicBezier(...definition);
}

function bezierCss([x1, y1, x2, y2]: CubicBezier): string {
	return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}

/** A CSS `<easing-function>` for the definition, or undefined when only sampling can express it. */
export function easingToCss(definition: EasingDefinition): string | undefined {
	if (typeof definition === "function") {
		return undefined;
	}
	if (typeof definition !== "string") {
		return bezierCss(definition);
	}
	if (definition === "linear") {
		return "linear";
	}
	const bezier = BEZIERS[definition];
	return bezier === undefined ? undefined : bezierCss(bezier);
}
