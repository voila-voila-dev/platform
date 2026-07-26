import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

interface Props extends DialogPrimitive.Close.Props {}

export function DialogClose(props: Props) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}
