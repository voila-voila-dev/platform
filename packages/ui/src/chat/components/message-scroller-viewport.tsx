import * as React from "react";
import { useMessageScrollerContext } from "#/chat/context/message-scroller-context.ts";
import { composeRefs } from "#/chat/lib/compose-refs.ts";
import type { MessageScrollerViewportProps } from "#/chat/lib/message-scroller-types.ts";
import { USER_SCROLL_KEYS } from "#/chat/lib/message-scroller-types.ts";

export function MessageScrollerViewport({
	"aria-label": ariaLabel,
	children,
	onKeyDown,
	onScroll,
	onTouchMove,
	onWheel,
	preserveScrollOnPrepend = true,
	ref,
	role,
	tabIndex,
	...props
}: MessageScrollerViewportProps) {
	const {
		handleResize,
		preserveScrollOnPrependRef,
		setViewportElement,
		syncAfterScroll,
		userScrollIntent,
		viewportRef,
	} = useMessageScrollerContext();

	preserveScrollOnPrependRef.current = preserveScrollOnPrepend;

	const setViewportRef = React.useCallback(
		(element: HTMLDivElement | null) => {
			setViewportElement(element);
			composeRefs(ref)?.(element);
		},
		[ref, setViewportElement],
	);

	function handleScroll(scrollEvent: React.UIEvent<HTMLDivElement>) {
		syncAfterScroll();
		onScroll?.(scrollEvent);
	}

	function handleWheel(wheelEvent: React.WheelEvent<HTMLDivElement>) {
		userScrollIntent();
		onWheel?.(wheelEvent);
	}

	function handleTouchMove(touchEvent: React.TouchEvent<HTMLDivElement>) {
		userScrollIntent();
		onTouchMove?.(touchEvent);
	}

	function handleKeyDown(keyEvent: React.KeyboardEvent<HTMLDivElement>) {
		if (USER_SCROLL_KEYS.has(keyEvent.key)) {
			userScrollIntent();
		}

		onKeyDown?.(keyEvent);
	}

	React.useEffect(() => {
		const viewport = viewportRef.current;

		if (!viewport || typeof ResizeObserver === "undefined") {
			return;
		}

		// Coalesce into rAF: handleResize mutates the spacer inside the observed
		// content, and resizing an observed element during delivery fires
		// "ResizeObserver loop completed with undelivered notifications".
		let frame = 0;

		const observer = new ResizeObserver(() => {
			window.cancelAnimationFrame(frame);
			frame = window.requestAnimationFrame(handleResize);
		});

		observer.observe(viewport);

		return () => {
			window.cancelAnimationFrame(frame);
			observer.disconnect();
		};
	}, [handleResize, viewportRef]);

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: the viewport defaults to role="region" (a focusable scroll area); the handlers only track scroll intent.
		// biome-ignore lint/a11y/useAriaPropsSupportedByRole: aria-label labels the region role applied at runtime.
		<div
			ref={setViewportRef}
			role={role ?? "region"}
			aria-label={ariaLabel ?? "Messages"}
			tabIndex={tabIndex ?? 0}
			onKeyDown={handleKeyDown}
			onScroll={handleScroll}
			onTouchMove={handleTouchMove}
			onWheel={handleWheel}
			{...props}
		>
			{children}
		</div>
	);
}
