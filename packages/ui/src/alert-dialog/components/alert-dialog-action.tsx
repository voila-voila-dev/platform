import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import type * as React from "react";
import { Button } from "#/button/components/button.tsx";

interface Props
	extends AlertDialogPrimitive.Close.Props,
		Pick<React.ComponentProps<typeof Button>, "variant" | "size"> {}

export function AlertDialogAction({
	className,
	variant = "default",
	size = "default",
	...props
}: Props) {
	return (
		<AlertDialogPrimitive.Close
			data-slot="alert-dialog-action"
			className={className}
			render={<Button variant={variant} size={size} />}
			{...props}
		/>
	);
}
