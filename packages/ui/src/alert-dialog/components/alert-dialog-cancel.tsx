import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import type * as React from "react";
import { Button } from "#/button/components/button.tsx";

interface Props
	extends AlertDialogPrimitive.Close.Props,
		Pick<React.ComponentProps<typeof Button>, "variant" | "size"> {}

export function AlertDialogCancel({
	className,
	variant = "outline",
	size = "default",
	...props
}: Props) {
	return (
		<AlertDialogPrimitive.Close
			data-slot="alert-dialog-cancel"
			className={className}
			render={<Button variant={variant} size={size} />}
			{...props}
		/>
	);
}
