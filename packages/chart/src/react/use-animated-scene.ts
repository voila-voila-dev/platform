import { cancelFrame, frame, shouldReduceMotion } from "@voila.dev/motion";
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
		if (!changed || !timing || !store || shouldReduceMotion()) {
			store?.snap(scene);
			setShown(scene);
			return;
		}
		store.retarget(scene, performance.now());
		function tick() {
			const now = performance.now();
			if (store?.settled(now)) {
				cancelFrame(tick);
				setShown(scene);
				return;
			}
			setShown(store?.frame(now) ?? scene);
		}
		tick();
		frame.update(tick, true);
		return () => cancelFrame(tick);
	}, [scene, trigger, timing]);

	return shown;
}
