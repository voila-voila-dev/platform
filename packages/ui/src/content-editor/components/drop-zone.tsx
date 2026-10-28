import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { type DragEvent, useRef, useState } from "react";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import { useTakeFiles } from "#/content-editor/hooks/use-take-files.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

/**
 * Makes everything it wraps a drop target for files, the toolbar and an
 * attachments tray as much as the canvas, with an overlay while files are
 * dragged over it. A file dropped here goes where it would on the canvas:
 * an image inline at the caret, the rest to `onDropFiles`.
 */
export function ContentEditorDropZone({
	className,
	render,
	children,
	...props
}: Props) {
	const { labels, readOnly } = useContentEditorConfig();
	const takeFiles = useTakeFiles();
	const [dragging, setDragging] = useState(false);
	// dragenter and dragleave fire for every child the pointer crosses, so the
	// overlay follows a depth that is back to 0 only once the drag left the zone.
	const depth = useRef(0);

	const carriesFiles = (event: DragEvent) =>
		!readOnly && event.dataTransfer.types.includes("Files");
	const reset = () => {
		depth.current = 0;
		setDragging(false);
	};

	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn("relative", className),
				onDragEnter: (event) => {
					if (carriesFiles(event)) {
						depth.current += 1;
						setDragging(true);
					}
				},
				onDragLeave: (event) => {
					if (carriesFiles(event)) {
						depth.current = Math.max(0, depth.current - 1);
						setDragging(depth.current > 0);
					}
				},
				onDragOver: (event) => {
					// Without it the browser refuses the drop outside the canvas.
					if (carriesFiles(event)) {
						event.preventDefault();
					}
				},
				// The canvas takes a drop on itself and stops it there, so the
				// overlay is cleared on the way down rather than on the way up.
				onDropCapture: reset,
				onDrop: (event) => {
					if (carriesFiles(event) && takeFiles(event.dataTransfer)) {
						event.preventDefault();
					}
				},
				children: (
					<>
						{children}
						{dragging ? (
							<div
								data-slot="content-editor-drop-overlay"
								className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg border-2 border-primary border-dashed bg-background/85 font-medium text-primary text-sm"
							>
								{labels.chrome.dropToUpload}
							</div>
						) : null}
					</>
				),
			},
			props,
		),
		render,
		state: { slot: "content-editor-drop-zone", dragging },
	});
}
