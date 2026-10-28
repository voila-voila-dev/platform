import * as React from "react";

/**
 * Which host is rendering the actions, and therefore how each one should look.
 *
 * - `surface`: the long-press card — a full-width button with its label.
 * - `bar`: the hover bar — an icon-only button, the label becoming its
 *   accessible name.
 */
export type ChatMessageActionsHost = "surface" | "bar";

interface ChatMessageActionsHostValue {
	host: ChatMessageActionsHost;
	/** Closes the host once the chosen action has run. */
	close: () => void;
}

/**
 * Set while `Chat.MessageAction` renders somewhere other than the context
 * menu, where there is no menu item to be. The caller composes one `actions`
 * tree and each host presents it its own way.
 */
export const ChatMessageActionsHostContext =
	React.createContext<ChatMessageActionsHostValue | null>(null);
