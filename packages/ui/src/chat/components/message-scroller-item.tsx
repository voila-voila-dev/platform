import * as React from "react";
import { useMessageScrollerItemContext } from "#/chat/context/message-scroller-context.ts";
import { composeRefs } from "#/chat/lib/compose-refs.ts";
import type { MessageScrollerItemProps } from "#/chat/lib/message-scroller-types.ts";

export function MessageScrollerItem({
	messageId,
	ref,
	scrollAnchor = false,
	...props
}: MessageScrollerItemProps) {
	const registerMessage = useMessageScrollerItemContext();
	const elementRef = React.useRef<HTMLDivElement | null>(null);

	const setItemRef = React.useCallback(
		(element: HTMLDivElement | null) => {
			const previousElement = elementRef.current;

			elementRef.current = element;

			if (messageId) {
				registerMessage(messageId, element, previousElement);
			}

			composeRefs(ref)?.(element);
		},
		[messageId, ref, registerMessage],
	);

	return (
		<div
			ref={setItemRef}
			data-message-id={messageId}
			data-scroll-anchor={scrollAnchor ? "true" : "false"}
			{...props}
		/>
	);
}
