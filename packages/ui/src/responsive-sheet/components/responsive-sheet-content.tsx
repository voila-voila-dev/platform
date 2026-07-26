import type * as React from "react";
import { Drawer } from "#/drawer/components/drawer.tsx";
import { useResponsiveSheetIsMobile } from "#/responsive-sheet/context/responsive-sheet-context.ts";
import { Sheet, type SheetContentSize } from "#/sheet/components/sheet.tsx";

interface Props {
	className?: string;
	children?: React.ReactNode;
	/** Desktop panel width — the mobile drawer is always full-width. */
	size?: SheetContentSize;
	showCloseButton?: boolean;
	closeButtonLabel?: string;
	overlayClassName?: string;
	/**
	 * Whether opening moves focus into the content (the default). Pass `false`
	 * when the first field is a text input you don't want to focus on open —
	 * on a phone that focus opens the keyboard over the content you just asked to
	 * see. The content stays reachable by tab either way.
	 */
	autoFocus?: boolean;
}

export function ResponsiveSheetContent({
	className,
	children,
	size = "default",
	showCloseButton = true,
	closeButtonLabel = "Close",
	overlayClassName,
	autoFocus = true,
}: Props) {
	const isMobile = useResponsiveSheetIsMobile("ResponsiveSheet.Content");
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
		<Sheet.Content
			className={className}
			size={size}
			showCloseButton={showCloseButton}
			closeButtonLabel={closeButtonLabel}
			overlayClassName={overlayClassName}
			initialFocus={autoFocus}
		>
			{children}
		</Sheet.Content>
	);
}
