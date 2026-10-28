import { shouldReduceMotion } from "@voila.dev/motion";
import * as React from "react";
import {
	createMotionStore,
	type MotionStore,
} from "#/core/motion/motion-store.ts";
import type { ChartTiming } from "#/core/motion/timing.ts";
import type { ChartScene } from "#/core/types.ts";

/**
 * The scene to draw this frame. A data change (`trigger` changed: a new
 * definition, a series toggled) moves from what is on screen to the new
 * scene on springs; one landing mid-flight keeps every node's speed. A
 * resize snaps, since watching bars slide while a window is dragged helps no
 * one. Reduced motion always snaps.
 */
export function useAnimatedScene(
	scene: ChartScene,
	trigger: unknown,
	timing: ChartTiming | null,
): ChartScene {
	const [shown, setShown] = React.useState(scene);
	const triggerRef = React.useRef(trigger);
	// The first render may play once: lines that `enter: "draw"` trace themselves in.
	const introduced = React.useRef(false);
	const introStart = React.useRef<number | null>(null);
	const storeRef = React.useRef<{
		store: MotionStore;
		timing: ChartTiming;
	} | null>(null);

	React.useLayoutEffect(() => {
		const changed = triggerRef.current !== trigger;
		triggerRef.current = trigger;
		if (timing && storeRef.current?.timing !== timing) {
			storeRef.current = { store: createMotionStore(scene, timing), timing };
		}
		const store = storeRef.current?.store;
		const still = !timing || !store || shouldReduceMotion();
		let intro = false;
		if (!still && !changed && !introduced.current) {
			const start = introStart.current ?? performance.now();
			// A re-render mid-intro (the width measured after mount, fonts loaded): the
			// new geometry, drawn from where the intro already is, never from scratch.
			if (introStart.current !== null) store.snap(scene);
			intro = store.introduce(start);
			if (intro) introStart.current = start;
		}
		if (still || (!changed && !intro)) {
			introduced.current = true;
			store?.snap(scene);
			setShown(scene);
			return;
		}
		if (changed) store.retarget(scene, performance.now());
		// One chart needs one callback a frame: a plain requestAnimationFrame
		// keeps motion's shared frame loop out of every chart bundle.
		let request = 0;
		function tick() {
			const now = performance.now();
			if (store?.settled(now)) {
				// Only once it has played: StrictMode's rerun of the effect starts it again.
				introduced.current = true;
				setShown(scene);
				return;
			}
			setShown(store?.frame(now) ?? scene);
			request = requestAnimationFrame(tick);
		}
		tick();
		return () => cancelAnimationFrame(request);
	}, [scene, trigger, timing]);

	return shown;
}
