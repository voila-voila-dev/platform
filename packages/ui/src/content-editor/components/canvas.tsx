import { PlateContent, type PlateContentProps } from "platejs/react";
import { useRegisterContentEditorPart } from "#/content-editor/components/layout.tsx";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import { useRunHotkey } from "#/content-editor/hooks/use-run-hotkey.ts";
import { useTakeFiles } from "#/content-editor/hooks/use-take-files.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends Omit<PlateContentProps, "placeholder" | "readOnly"> {
	/** Shown in the empty document; defaults to the `chrome.placeholder` label. */
	placeholder?: string;
}

/**
 * The editable surface: the document, with its placeholder and focus ring.
 * A drop or a paste that carries files goes to the feature that takes them
 * (an image to the image feature) and the rest to the host's `onDropFiles`,
 * in the capture phase so slate-react's own drop handling never sees it;
 * text keeps Plate's own handling. A key an item declares as its `hotkey`
 * does what pressing that item does.
 */
export function ContentEditorCanvas({
	className,
	placeholder,
	onDropCapture,
	onPasteCapture,
	onKeyDown,
	...props
}: Props) {
	const { labels, mode, readOnly } = useContentEditorConfig();
	const takeFiles = useTakeFiles();
	const runHotkey = useRunHotkey();
	useRegisterContentEditorPart("canvas");

	return (
		<PlateContent
			data-slot="content-editor-canvas"
			placeholder={placeholder ?? labels.chrome.placeholder}
			readOnly={readOnly}
			aria-label={labels.chrome.editor}
			aria-multiline={mode !== "single-line"}
			onDropCapture={(event) => {
				if (takeFiles(event.dataTransfer)) {
					event.preventDefault();
					event.stopPropagation();
					return;
				}
				onDropCapture?.(event);
			}}
			onKeyDown={(event) => {
				if (runHotkey(event)) {
					event.preventDefault();
					return;
				}
				onKeyDown?.(event);
			}}
			onPasteCapture={(event) => {
				if (takeFiles(event.clipboardData)) {
					event.preventDefault();
					event.stopPropagation();
					return;
				}
				onPasteCapture?.(event);
			}}
			data-mode={mode}
			className={cn(
				"w-full outline-none",
				mode === "single-line"
					? "h-8 min-h-0 overflow-hidden rounded-lg border border-input bg-transparent px-2.5 py-1 text-base whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30 [&_[data-slate-node=element]]:truncate"
					: "min-h-(--content-editor-min-height) max-w-(--content-editor-prose-width) rounded-md px-3 py-2 text-sm leading-relaxed focus-visible:ring-2 focus-visible:ring-ring/50 [&_[data-slate-node=element]+[data-slate-node=element]]:mt-(--content-editor-block-gap)",
				className,
			)}
			{...props}
		/>
	);
}
ContentEditorCanvas.slot = "main" as const;
