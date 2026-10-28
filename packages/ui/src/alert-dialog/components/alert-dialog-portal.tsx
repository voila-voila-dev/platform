import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";

interface Props extends AlertDialogPrimitive.Portal.Props {}

export function AlertDialogPortal(props: Props) {
	return (
		<AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
	);
}
