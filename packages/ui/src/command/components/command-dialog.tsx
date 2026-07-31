import type * as React from "react";
import { Dialog } from "#/dialog/components/dialog.tsx";
import { cn } from "#/lib/utils.ts";

interface Props
	extends Omit<React.ComponentProps<typeof Dialog.Root>, "children"> {
	/** Accessible name of the dialog. Visually hidden — the input is the visible cue. */
	title?: string;
	/** Accessible description, also visually hidden. */
	description?: string;
	/** Classes for the dialog panel. */
	className?: string;
	/** Draws the X in the corner. */
	showCloseButton?: boolean;
	/** The `Command` tree: input, list, groups and items. */
	children: React.ReactNode;
}

export function CommandDialog({
	title = "Command Palette",
	description = "Search for a command to run...",
	children,
	className,
	showCloseButton = false,
	...props
}: Props) {
	return (
		<Dialog.Root {...props}>
			<Dialog.Content
				className={cn(
					"top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0",
					className,
				)}
				showCloseButton={showCloseButton}
			>
				<Dialog.Header className="sr-only">
					<Dialog.Title>{title}</Dialog.Title>
					<Dialog.Description>{description}</Dialog.Description>
				</Dialog.Header>
				{children}
			</Dialog.Content>
		</Dialog.Root>
	);
}
