import * as React from "react";
import { useMessageScrollerContext } from "#/chat/context/message-scroller-context.ts";
import { composeRefs } from "#/chat/lib/compose-refs.ts";
import type { MessageScrollerContentProps } from "#/chat/lib/message-scroller-types.ts";

export function MessageScrollerContent({
	"aria-relevant": ariaRelevant,
	children,
	ref,
	role,
	spacerClassName,
	...props
}: MessageScrollerContentProps) {
	const {
		handleContentChange,
		handleResize,
		setContentElement,
		setSpacerElement,
	} = useMessageScrollerContext();
	const contentRef = React.useRef<HTMLDivElement | null>(null);

	const setContentRef = React.useCallback(
		(element: HTMLDivElement | null) => {
			contentRef.current = element;
			setContentElement(element);
			composeRefs(ref)?.(element);
		},
		[ref, setContentElement],
	);

	React.useLayoutEffect(() => {
		const content = contentRef.current;

		if (!content) {
			return;
		}

		handleContentChange();

		if (typeof MutationObserver === "undefined") {
			return;
		}

		const observer = new MutationObserver(() => {
			handleContentChange();
		});

		observer.observe(content, { childList: true });

		return () => observer.disconnect();
	}, [handleContentChange]);

	React.useEffect(() => {
		const content = contentRef.current;

		if (!content || typeof ResizeObserver === "undefined") {
			return;
		}

		// Coalesce into rAF: handleResize mutates the spacer inside this observed
		// element, and resizing an observed element during delivery fires
		// "ResizeObserver loop completed with undelivered notifications".
		let frame = 0;

		const observer = new ResizeObserver(() => {
			window.cancelAnimationFrame(frame);
			frame = window.requestAnimationFrame(handleResize);
		});

		observer.observe(content);

		return () => {
			window.cancelAnimationFrame(frame);
			observer.disconnect();
		};
	}, [handleResize]);

	return (
		<div
			ref={setContentRef}
			role={role ?? "log"}
			aria-relevant={ariaRelevant ?? "additions"}
			{...props}
		>
			{children}
			<div
				ref={setSpacerElement}
				aria-hidden="true"
				data-message-scroller-spacer=""
				hidden
				className={spacerClassName}
			/>
		</div>
	);
}
