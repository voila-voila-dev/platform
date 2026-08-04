import { MegaphoneIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { HighlightBlockSettings } from "#/email-block-editor/blocks/highlight-block-settings.tsx";
import { HighlightBlockView } from "#/email-block-editor/blocks/highlight-block-view.tsx";
import type { EmailEditorHighlightBlock } from "#/email-block-editor/document/types.ts";

export const highlightBlockDefinition: EmailBlockDefinition<EmailEditorHighlightBlock> =
	{
		label: "Highlight",
		icon: MegaphoneIcon,
		View: HighlightBlockView,
		Settings: HighlightBlockSettings,
	};
