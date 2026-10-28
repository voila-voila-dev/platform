import * as React from "react";
import type {
	MessageScrollerContextValue,
	MessageScrollerRegisterMessage,
} from "#/chat/lib/message-scroller-types.ts";

/** Scroll state and commands for one transcript. */
export const MessageScrollerContext =
	React.createContext<MessageScrollerContextValue | null>(null);

/** Registers a transcript row's DOM node by messageId. */
export const MessageScrollerItemContext =
	React.createContext<MessageScrollerRegisterMessage | null>(null);

export function useMessageScrollerContext() {
	const context = React.useContext(MessageScrollerContext);

	if (!context) {
		throw new Error(
			"useMessageScroller must be used within a MessageScroller.",
		);
	}

	return context;
}

export function useMessageScrollerItemContext() {
	const context = React.useContext(MessageScrollerItemContext);

	if (!context) {
		throw new Error(
			"MessageScrollerItem must be used within a MessageScroller.",
		);
	}

	return context;
}
