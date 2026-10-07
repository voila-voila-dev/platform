import * as React from "react";
import { easeOutCubic, tweenScene } from "#/core/motion/tween.ts";
import type { ChartScene } from "#/core/types.ts";

function prefersReducedMotion(): boolean {
	return (
		typeof window !== "undefined" &&
		window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
	);
}

/**
 * The scene to draw this frame. A data change (`trigger` changed: a new
 * definition, a series toggled) tweens from what is on screen to the new
 * scene; a resize snaps, since watching bars slide while a window is dragged
 * helps no one. Reduced motion always snaps. An update that lands mid-tween
 * starts from the frame already painted, so nothing jumps.
 */
export function useAnimatedScene(
	scene: ChartScene,
	trigger: unknown,
	duration: number,
): ChartScene {
	const [shown, setShown] = React.useState(scene);
	const shownRef = React.useRef(scene);
	const triggerRef = React.useRef(trigger);

	React.useLayoutEffect(() => {
		const changed = triggerRef.current !== trigger;
		triggerRef.current = trigger;
		if (!changed || duration <= 0 || prefersReducedMotion()) {
			shownRef.current = scene;
			setShown(scene);
			return;
		}
		const from = shownRef.current;
		// Frame zero now, before paint: nodes that left are gone at once.
		const first = tweenScene(from, scene, 0);
		shownRef.current = first;
		setShown(first);
		const start = performance.now();
		let frame = 0;
		function step(now: number) {
			const t = Math.min(1, (now - start) / duration);
			const next = tweenScene(from, scene, easeOutCubic(t));
			shownRef.current = next;
			setShown(next);
			if (t < 1) {
				frame = requestAnimationFrame(step);
			}
		}
		frame = requestAnimationFrame(step);
		return () => cancelAnimationFrame(frame);
	}, [scene, trigger, duration]);

	return shown;
}
