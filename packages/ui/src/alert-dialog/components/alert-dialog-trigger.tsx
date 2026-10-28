import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";

interface Props extends AlertDialogPrimitive.Trigger.Props {}

export function AlertDialogTrigger(props: Props) {
	return (
		<AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
	);
}
