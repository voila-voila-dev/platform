import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";

interface Props extends SheetPrimitive.Trigger.Props {}

export function SheetTrigger(props: Props) {
	return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}
