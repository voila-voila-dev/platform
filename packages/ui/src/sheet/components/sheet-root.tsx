import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";

interface Props extends SheetPrimitive.Root.Props {}

export function SheetRoot(props: Props) {
	return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}
