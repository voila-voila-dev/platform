import * as React from "react";
import { useMessageScrollerContext } from "#/chat/context/message-scroller-context.ts";

/** Visible message ids + the current anchored turn, lazily tracked. */
export function useChatScrollerVisibility() {
	const { observeVisibility, unobserveVisibility, visibilityStore } =
		useMessageScrollerContext();
	const subscribe = React.useCallback(
		(listener: () => void) =>
			visibilityStore.subscribe(
				listener,
				observeVisibility,
				unobserveVisibility,
			),
		[observeVisibility, unobserveVisibility, visibilityStore],
	);

	return React.useSyncExternalStore(
		subscribe,
		visibilityStore.getSnapshot,
		visibilityStore.getSnapshot,
	);
}
