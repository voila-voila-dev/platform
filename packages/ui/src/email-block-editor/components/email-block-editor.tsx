import type { ReactNode } from "react";
import type { EmailEditorBlockLike } from "#/email-block-editor/document/types.ts";
import { EmailEditor } from "#/email-block-editor/parts/namespace.ts";
import type { EmailEditorRootProps } from "#/email-block-editor/parts/root.tsx";

interface Props<Block extends EmailEditorBlockLike>
	extends Omit<EmailEditorRootProps<Block>, "children"> {
	/** Replaces the neutral header placeholder above the blocks with your own
	 * chrome. */
	headerSlot?: ReactNode;
	/** Replaces the neutral footer placeholder below the card. */
	footerSlot?: ReactNode;
	/** Fields for the document as a whole — a subject line, a preheader. Sits
	 * above the canvas when the layout is compact, at the top of the settings
	 * column when it is wide. */
	documentSettings?: ReactNode;
}

/**
 * The parts arranged the usual way: a toolbar, the canvas, a settings column
 * beside it, and a bottom sheet in its place below `lg`.
 *
 * Reach for `EmailEditor.*` when you want a different arrangement — this is
 * that composition, with no options you would have to undo.
 */
export function EmailBlockEditor<Block extends EmailEditorBlockLike>({
	headerSlot,
	footerSlot,
	documentSettings,
	...root
}: Props<Block>) {
	return (
		<EmailEditor.Root {...root}>
			<EmailEditor.Layout>
				<EmailEditor.Toolbar />
				{documentSettings === undefined ? null : (
					<EmailEditor.DocumentSettings>
						{documentSettings}
					</EmailEditor.DocumentSettings>
				)}
				<EmailEditor.Canvas>
					<EmailEditor.Card>
						<EmailEditor.CardHeader render={headerSlot} />
						<EmailEditor.Blocks />
					</EmailEditor.Card>
					<EmailEditor.CardFooter render={footerSlot} />
				</EmailEditor.Canvas>
				<EmailEditor.Sidebar />
			</EmailEditor.Layout>
			<EmailEditor.SettingsSheet />
		</EmailEditor.Root>
	);
}
