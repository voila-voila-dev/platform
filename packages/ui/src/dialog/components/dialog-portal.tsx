import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

interface Props extends DialogPrimitive.Portal.Props {}

export function DialogPortal(props: Props) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}
