import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as React from "react";
import { useMessageScrollerContext } from "#/chat/context/message-scroller-context.ts";
import { useLatest } from "#/chat/hooks/use-latest.ts";
import type { MessageScrollerButtonProps } from "#/chat/lib/message-scroller-types.ts";

export function MessageScrollerButton({
	behavior = "smooth",
	children,
	direction = "end",
	onClick,
	render,
	tabIndex,
	type = "button",
	...props
}: MessageScrollerButtonProps) {
	const { scrollToEnd, scrollToStart, stateStore } =
		useMessageScrollerContext();
	const onClickRef = useLatest(onClick);
	const subscribe = React.useCallback(
		(listener: () => void) => stateStore.subscribe(listener),
		[stateStore],
	);
	const getSnapshot = React.useCallback(() => {
		const state = stateStore.getSnapshot();

		return direction === "start" ? state.start : state.end;
	}, [direction, stateStore]);
	const isActive = React.useSyncExternalStore(
		subscribe,
		getSnapshot,
		getSnapshot,
	);

	const handleClick = React.useCallback(
		(clickEvent: React.MouseEvent<HTMLButtonElement>) => {
			if (!isActive) {
				return;
			}

			onClickRef.current?.(clickEvent);

			if (!clickEvent.defaultPrevented) {
				clickEvent.currentTarget.blur();

				if (direction === "start") {
					scrollToStart({ behavior });
				} else {
					scrollToEnd({ behavior });
				}
			}
		},
		[behavior, direction, isActive, onClickRef, scrollToEnd, scrollToStart],
	);

	return useRender({
		defaultTagName: "button",
		props: mergeProps<"button">(
			{
				type,
				inert: !isActive,
				tabIndex: isActive ? tabIndex : -1,
				children: children ?? <span>Scroll to {direction}</span>,
				onClick: handleClick,
			},
			props,
		),
		render,
		state: {
			active: isActive,
			direction,
		},
		stateAttributesMapping: {
			active: (value) => ({
				"data-active": value ? "true" : "false",
			}),
		},
	});
}
