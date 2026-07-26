import * as ResizablePrimitive from "react-resizable-panels";

interface Props extends ResizablePrimitive.PanelProps {}

export function ResizablePanel(props: Props) {
	return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}
