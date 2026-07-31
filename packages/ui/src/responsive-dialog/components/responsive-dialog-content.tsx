import type * as React from "react";
import type { DialogContentSize } from "#/dialog/components/dialog.tsx";
import { Dialog } from "#/dialog/components/dialog.tsx";
import { Drawer } from "#/drawer/components/drawer.tsx";
import { useResponsiveDialogIsMobile } from "#/responsive-dialog/context/responsive-dialog-context.ts";

interface Props {
	/** Classes for the panel on both surfaces. */
	className?: string;
	/** Header, body and footer parts. */
	children?: React.ReactNode;
	/** Desktop dialog width — the mobile drawer is always full-width. */
	size?: DialogContentSize;
	/** Draws the X in the corner. */
	showCloseButton?: boolean;
	/** Accessible name for that X. This package ships no translations. */
	closeButtonLabel?: string;
	/** Classes for the backdrop behind the panel. `className` styles the panel itself. */
	overlayClassName?: string;
	/**
	 * Whether opening moves focus into the content (the default). Pass `false`
	 * when the first field is a text input you don't want to focus on open —
	 * on a phone that focus opens the keyboard over the content you just asked to
	 * see. The content stays reachable by tab either way.
	 */
	autoFocus?: boolean;
}

export function ResponsiveDialogContent({
	className,
	children,
	size = "sm",
	showCloseButton = true,
	closeButtonLabel = "Close",
	overlayClassName,
	autoFocus = true,
}: Props) {
	const isMobile = useResponsiveDialogIsMobile("ResponsiveDialog.Content");
	if (isMobile) {
		return (
			<Drawer.Content
				className={className}
				showCloseButton={showCloseButton}
				closeButtonLabel={closeButtonLabel}
				overlayClassName={overlayClassName}
				onOpenAutoFocus={
					autoFocus ? undefined : (event) => event.preventDefault()
				}
			>
				{children}
			</Drawer.Content>
		);
	}
	return (
		<Dialog.Content
			className={className}
			size={size}
			showCloseButton={showCloseButton}
			closeButtonLabel={closeButtonLabel}
			overlayClassName={overlayClassName}
			initialFocus={autoFocus}
		>
			{children}
		</Dialog.Content>
	);
}
