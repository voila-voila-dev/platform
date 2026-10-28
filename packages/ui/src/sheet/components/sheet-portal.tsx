import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";

interface Props extends SheetPrimitive.Portal.Props {}

export function SheetPortal(props: Props) {
	return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}
