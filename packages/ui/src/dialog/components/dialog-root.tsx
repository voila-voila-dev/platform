import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

interface Props extends DialogPrimitive.Root.Props {}

export function DialogRoot(props: Props) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}
