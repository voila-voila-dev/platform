import { MessageScrollerProvider } from "#/chat/components/message-scroller-provider.tsx";

/**
 * Headless scroll-state provider for a transcript. Owns follow-bottom,
 * turn anchoring, prepend preservation and visibility tracking; renders no
 * DOM. `autoScroll` keeps a reader at the live edge pinned to new content.
 */
export const ChatProvider = MessageScrollerProvider;
