import type * as React from "react";
import { Button } from "#/button/components/button.tsx";

interface Props extends React.ComponentProps<typeof Button> {}

export function AttachmentAction({
	className,
	variant = "ghost",
	size = "icon-xs",
	...props
}: Props) {
	return (
		<Button
			data-slot="attachment-action"
			variant={variant}
			size={size}
			className={className}
			{...props}
		/>
	);
}
