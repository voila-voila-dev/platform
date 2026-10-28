import type * as React from "react";

const CHAT_LINK_PATTERN = /https?:\/\/[^\s<>"']+/g;

interface Props extends Omit<React.ComponentProps<"span">, "children"> {
	children: string;
	onLinkClick?: (url: string) => void;
}

export function ChatMessageText({
	children,
	onLinkClick,
	className,
	...props
}: Props) {
	const nodes: React.ReactNode[] = [];
	let lastIndex = 0;
	for (const match of children.matchAll(CHAT_LINK_PATTERN)) {
		// Trailing punctuation belongs to the sentence, not the URL.
		const url = match[0].replace(/[.,;:!?)\]]+$/, "");
		if (match.index > lastIndex) {
			nodes.push(children.slice(lastIndex, match.index));
		}
		nodes.push(
			<a
				key={`${match.index}-${url}`}
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="underline underline-offset-2 hover:opacity-80"
				onClick={(clickEvent) => {
					if (onLinkClick === undefined) {
						return;
					}
					clickEvent.preventDefault();
					onLinkClick(url);
				}}
			>
				{url}
			</a>,
		);
		lastIndex = match.index + url.length;
	}
	if (lastIndex < children.length) {
		nodes.push(children.slice(lastIndex));
	}
	return (
		// A single wrapping element so the linkified fragments stay one inline
		// flow inside the bubble's flex column.
		<span data-slot="chat-message-text" className={className} {...props}>
			{nodes}
		</span>
	);
}
