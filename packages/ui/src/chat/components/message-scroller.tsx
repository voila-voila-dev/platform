import { useMessageScrollerContext } from "#/chat/context/message-scroller-context.ts";
import type { MessageScrollerProps } from "#/chat/lib/message-scroller-types.ts";

export function MessageScroller({ children, ...props }: MessageScrollerProps) {
	const { setRootElement } = useMessageScrollerContext();

	return (
		<div ref={setRootElement} {...props}>
			{children}
		</div>
	);
}
