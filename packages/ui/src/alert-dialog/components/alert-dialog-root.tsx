import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";

interface Props extends AlertDialogPrimitive.Root.Props {}

export function AlertDialogRoot(props: Props) {
	return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}
