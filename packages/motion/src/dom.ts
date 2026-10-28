import { animateElements } from "#/animate/dom.ts";
import type {
	AnimationControls,
	AnimationOptions,
	DOMKeyframes,
	ElementTarget,
} from "#/animate/types.ts";
import { resolveElements } from "#/view/resolve-elements.ts";

export type {
	AnimationControls,
	AnimationOptions,
	DOMKeyframes,
	ElementTarget,
} from "#/animate/types.ts";
export { spring } from "#/generators/spring.ts";
export { stagger } from "#/stagger/stagger.ts";

/**
 * `animate` for elements only, every property played by the browser: CSS
 * properties and the independent transforms, with springs as `linear()`.
 * What it can't hand to the browser (SVG attributes, CSS variables) jumps to
 * its last keyframe: use the full `animate` for those.
 */
export function animate(
	target: ElementTarget,
	keyframes: DOMKeyframes,
	options: AnimationOptions = {},
): AnimationControls {
	return animateElements(
		resolveElements(target as Element | string | readonly Element[]),
		keyframes,
		options,
	);
}
