import * as React from "react";
import { useMessageScrollerContext } from "#/chat/context/message-scroller-context.ts";

/**
 * Which edges the viewport can still scroll toward. While the reader follows
 * the live end, `end` stays false — so `!end` reads as "following the
 * conversation".
 */
export function useChatScrollerScrollable() {
	const { stateStore } = useMessageScrollerContext();

	return React.useSyncExternalStore(
		stateStore.subscribe,
		stateStore.getSnapshot,
		stateStore.getSnapshot,
	);
}
