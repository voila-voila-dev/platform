import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

interface Props extends DialogPrimitive.Trigger.Props {}

export function DialogTrigger(props: Props) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}
