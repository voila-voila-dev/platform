import { ContextMenuItem } from "#/context-menu/components/context-menu-item.tsx";

interface Props extends React.ComponentProps<typeof ContextMenuItem> {}

/**
 * One entry of the message menu. A thin pass-through over the context-menu
 * item so a caller composes with `Chat.*` throughout and never has to know
 * which primitive the menu is built on — `variant="destructive"` still tints
 * the one action that cannot be undone.
 */
export function ChatMessageAction(props: Props) {
	return <ContextMenuItem data-slot="chat-message-action" {...props} />;
}
