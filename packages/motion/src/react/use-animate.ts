import * as React from "react";
import { type Animate, createAnimate } from "#/animate/animate.ts";
import type { AnimationControls } from "#/animate/types.ts";

export interface AnimationScope<T extends Element = Element> {
	current: T | null;
	/** The animations started through this scope and still running. */
	readonly animations: AnimationControls[];
}

/**
 * A ref to put on an element, and an `animate` whose selectors only match
 * inside it. Every animation started through it stops on unmount, so a
 * component never animates a node React already removed.
 */
export function useAnimate<T extends Element = HTMLElement>(): readonly [
	AnimationScope<T>,
	Animate,
] {
	const [scope] = React.useState<AnimationScope<T>>(() => ({
		current: null,
		animations: [],
	}));
	const [scoped] = React.useState(() => {
		const base = createAnimate(() => scope.current);
		function tracked(...args: Parameters<typeof base>): AnimationControls {
			const controls = (base as (...a: unknown[]) => AnimationControls)(
				...args,
			);
			scope.animations.push(controls);
			controls.finished.then(() => {
				const index = scope.animations.indexOf(controls);
				if (index !== -1) scope.animations.splice(index, 1);
			});
			return controls;
		}
		return tracked as Animate;
	});
	React.useEffect(
		() => () => {
			for (const controls of scope.animations.splice(0)) controls.stop();
		},
		[scope],
	);
	return [scope, scoped] as const;
}
