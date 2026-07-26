import type * as React from "react";
import { Dialog } from "#/dialog/components/dialog.tsx";
import { cn } from "#/lib/utils.ts";

interface Props
	extends Omit<React.ComponentProps<typeof Dialog.Root>, "children"> {
	title?: string;
	description?: string;
	className?: string;
	showCloseButton?: boolean;
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
