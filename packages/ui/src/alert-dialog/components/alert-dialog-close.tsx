import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";

interface Props extends AlertDialogPrimitive.Close.Props {}

export function AlertDialogClose(props: Props) {
	return (
		<AlertDialogPrimitive.Close data-slot="alert-dialog-close" {...props} />
	);
}
