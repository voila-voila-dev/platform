import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";

interface Props extends SheetPrimitive.Close.Props {}

export function SheetClose(props: Props) {
	return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}
