import { ResizableHandle } from "#/resizable/components/resizable-handle.tsx";
import { ResizablePanel } from "#/resizable/components/resizable-panel.tsx";
import { ResizablePanelGroup } from "#/resizable/components/resizable-panel-group.tsx";

/**
 * The Resizable parts as one namespace.
 */
export const Resizable = {
	// `PanelGroup` is the root; the alias keeps the part name the underlying
	// library uses.
	Root: ResizablePanelGroup,
	Handle: ResizableHandle,
	Panel: ResizablePanel,
	PanelGroup: ResizablePanelGroup,
};
