import { ArrowDownIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { MessageScrollerButton } from "#/chat/components/message-scroller-button.tsx";
import { cn } from "#/lib/utils.ts";

type Props = React.ComponentProps<typeof MessageScrollerButton> & {
	/** Accessible name for the icon-only affordance, e.g. "Voir les derniers messages". */
	label: string;
};

/**
 * Floating scroll-to-edge control. Appears (animated) only while overflow
 * exists toward its `direction`; inert otherwise. The visible content defaults
 * to an arrow icon with `label` as the accessible name.
 */
export function ChatScrollButton({
	label,
	className,
	children,
	direction = "end",
	render,
	...props
}: Props) {
	return (
		<MessageScrollerButton
			data-slot="chat-scroll-button"
			direction={direction}
			className={cn(
				"absolute start-1/2 -translate-x-1/2 shadow-md transition-[translate,scale,opacity] duration-200 rtl:translate-x-1/2",
				"data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100",
				"data-[direction=end]:bottom-3 data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-3 data-[direction=start]:data-[active=false]:-translate-y-full data-[direction=start]:[&_svg]:rotate-180",
				className,
			)}
			render={
				render ?? <Button variant="outline" size="icon-sm" shape="pill" />
			}
			{...props}
		>
			{children ?? (
				<>
					<ArrowDownIcon />
					<span className="sr-only">{label}</span>
				</>
			)}
		</MessageScrollerButton>
	);
}
