import * as React from "react";
import { ChatMessageActionsHostContext } from "#/chat/context/chat-message-actions-host-context.ts";
import { ContextMenuItem } from "#/context-menu/components/context-menu-item.tsx";
import { cn } from "#/lib/utils.ts";
import { menuItemVariants } from "#/menu/components/menu-variants.ts";

interface Props extends React.ComponentProps<typeof ContextMenuItem> {
	/**
	 * The action's glyph. Shown beside the label in the menu and on the
	 * long-press card, and alone in the hover bar — which is the one host with
	 * no room for words, so an action without an icon does not appear there.
	 */
	icon?: React.ReactNode;
	/**
	 * Accessible name where only the icon shows. Defaults to `children` when
	 * those are a plain string, which covers every ordinary action.
	 */
	label?: string;
}

/**
 * One entry of the message menu. A thin pass-through over the context-menu
 * item so a caller composes with `Chat.*` throughout and never has to know
 * which primitive the menu is built on — `variant="destructive"` still tints
 * the one action that cannot be undone.
 *
 * The same element renders three ways, so one `actions` tree serves all three
 * hosts: a menu item on right-click, a full-width button on the long-press
 * card, and an icon-only button in the hover bar.
 */
export function ChatMessageAction({ icon, label, ...props }: Props) {
	const host = React.useContext(ChatMessageActionsHostContext);
	const {
		className,
		inset,
		variant = "default",
		onClick,
		disabled,
		children,
	} = props;

	if (host === null) {
		return (
			<ContextMenuItem data-slot="chat-message-action" {...props}>
				{icon}
				{children}
			</ContextMenuItem>
		);
	}

	const run = (event: React.MouseEvent<HTMLButtonElement>) => {
		onClick?.(event as unknown as Parameters<NonNullable<typeof onClick>>[0]);
		host.close();
	};

	if (host.host === "bar") {
		// Words do not fit in the bar, so an action with no glyph would have no
		// way to name itself; it stays in the menu, where it reads fine.
		if (icon === undefined) {
			return null;
		}
		return (
			<button
				type="button"
				data-slot="chat-message-action"
				data-variant={variant}
				disabled={disabled === true}
				aria-label={
					label ?? (typeof children === "string" ? children : undefined)
				}
				className={cn(
					"flex size-8 shrink-0 items-center justify-center rounded-full outline-none transition-colors",
					"hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-ring/50",
					"disabled:pointer-events-none disabled:opacity-50",
					variant === "destructive" &&
						"text-destructive hover:bg-destructive/10",
					"[&_svg]:size-4.5 [&_svg]:shrink-0",
					className,
				)}
				onClick={run}
			>
				{icon}
			</button>
		);
	}

	return (
		<button
			type="button"
			data-slot="chat-message-action"
			data-inset={inset || undefined}
			data-variant={variant}
			disabled={disabled === true}
			className={cn(
				menuItemVariants({ variant }),
				"w-full py-2 active:bg-accent",
				variant === "destructive" && "active:bg-destructive/10",
				className,
			)}
			onClick={run}
		>
			{icon}
			{children}
		</button>
	);
}
