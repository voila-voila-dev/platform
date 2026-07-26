import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { toolbarButtonClassName } from "#/email-block-editor/lib/inline-format.ts";

interface Props {
	label: string;
	active?: boolean;
	coarsePointer: boolean;
	onClick?: () => void;
	onMouseDown?: (event: { preventDefault: () => void }) => void;
	children: React.ReactNode;
}

/** An icon button sized for the block toolbar's touch target floor. */
export function ToolbarIconButton({
	label,
	active = false,
	coarsePointer,
	onClick,
	onMouseDown,
	children,
}: Props) {
	return (
		<Button
			variant="ghost"
			size={coarsePointer ? "icon" : "icon-sm"}
			aria-label={label}
			aria-pressed={active || undefined}
			className={toolbarButtonClassName(coarsePointer, active)}
			onMouseDown={onMouseDown}
			onClick={onClick}
		>
			{children}
		</Button>
	);
}
