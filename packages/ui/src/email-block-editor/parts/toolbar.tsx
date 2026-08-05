import type { ReactNode } from "react";
import { AddBlockMenu } from "#/email-block-editor/components/add-block-menu.tsx";
import { PreviewToggle } from "#/email-block-editor/components/preview-toggle.tsx";
import {
	useEmailEditorActions,
	useEmailEditorState,
} from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorSlot } from "#/email-block-editor/parts/layout.tsx";
import { cn } from "#/lib/utils.ts";

interface Props {
	className?: string;
	/** Replaces the default contents. Omit for the preview toggle, plus an
	 * add-block menu while the document is empty. */
	children?: ReactNode;
}

/**
 * The bar above the canvas. Its `stopPropagation` is load-bearing, not
 * defensive: a host commonly deselects the block when the page around the
 * editor is clicked, and without this every toolbar click would deselect
 * first and act on nothing.
 */
export function EmailEditorToolbar({ className, children }: Props) {
	const { document } = useEmailEditorState();
	const { addBlock } = useEmailEditorActions();
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: not a control; it only stops a click from reaching the host's deselect handler.
		<div
			className={cn("flex items-center justify-end gap-2", className)}
			onClick={(event) => event.stopPropagation()}
			onKeyDown={(event) => event.stopPropagation()}
		>
			{children ?? (
				<>
					{document.blocks.length === 0 ? (
						<AddBlockMenu onAdd={(type) => addBlock(type)} />
					) : null}
					<PreviewToggle />
				</>
			)}
		</div>
	);
}

EmailEditorToolbar.slot = "main" satisfies EmailEditorSlot;
