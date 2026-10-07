import * as React from "react";
import {
	onReducedMotionChange,
	shouldReduceMotion,
} from "#/accessibility/reduced-motion.ts";

function serverSnapshot(): boolean {
	return false;
}

/**
 * Whether motion should be reduced, following the global policy and the
 * reader's setting as either changes. False on the server: the first client
 * render matches, then corrects itself.
 */
export function useReducedMotion(): boolean {
	return React.useSyncExternalStore(
		onReducedMotionChange,
		() => shouldReduceMotion(),
		serverSnapshot,
	);
}
