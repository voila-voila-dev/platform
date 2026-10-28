import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { Button } from "#/button/components/button.tsx";
import type { ButtonVariants } from "#/button/components/button-variants.ts";

interface Props
	extends AlertDialogPrimitive.Close.Props,
		Pick<ButtonVariants, "variant" | "size"> {}

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
