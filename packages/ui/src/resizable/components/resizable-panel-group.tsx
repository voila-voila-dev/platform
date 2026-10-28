import * as ResizablePrimitive from "react-resizable-panels";

interface Props extends ResizablePrimitive.GroupProps {}

/**
 * Resizable panel layout (react-resizable-panels v4).
 *
 * Sizing contract: the Group sets inline `height: 100%; width: 100%`, so a
 * height class on the group itself (`h-48`) is silently overridden — give it a
 * sized parent instead, e.g. `<div className="h-48"><Resizable.PanelGroup …>`.
 */
export function ResizablePanelGroup({ className, ...props }: Props) {
	// Layout (display/flex-direction/height/width) comes entirely from the
	// library's inline styles, so no layout classes are needed here.
	return (
		<ResizablePrimitive.Group
			data-slot="resizable-panel-group"
			className={className}
			{...props}
		/>
	);
}
