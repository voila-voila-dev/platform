import {
	MessageScrollerContext,
	MessageScrollerItemContext,
} from "#/chat/context/message-scroller-context.ts";
import { useMessageScrollerController } from "#/chat/hooks/use-message-scroller-controller.ts";
import type { MessageScrollerProviderProps } from "#/chat/lib/message-scroller-types.ts";

export function MessageScrollerProvider({
	autoScroll = false,
	children,
	defaultScrollPosition = "end",
	scrollEdgeThreshold,
	scrollPreviousItemPeek,
	scrollMargin,
}: MessageScrollerProviderProps) {
	const { context, registerMessage } = useMessageScrollerController({
		autoScroll,
		defaultScrollPosition,
		scrollEdgeThreshold,
		scrollPreviousItemPeek,
		scrollMargin,
	});

	return (
		<MessageScrollerContext.Provider value={context}>
			<MessageScrollerItemContext.Provider value={registerMessage}>
				{children}
			</MessageScrollerItemContext.Provider>
		</MessageScrollerContext.Provider>
	);
}
