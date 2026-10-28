import * as React from "react";
import { useMessageScrollerContext } from "#/chat/context/message-scroller-context.ts";

/** Imperative scroll commands: scrollToEnd, scrollToStart, scrollToMessage. */
export function useChatScroller() {
	const { scrollToEnd, scrollToMessage, scrollToStart } =
		useMessageScrollerContext();

	return React.useMemo(
		() => ({
			scrollToEnd,
			scrollToMessage,
			scrollToStart,
		}),
		[scrollToEnd, scrollToMessage, scrollToStart],
	);
}
