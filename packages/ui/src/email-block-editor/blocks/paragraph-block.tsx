import { TextAlignLeftIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { ParagraphBlockSettings } from "#/email-block-editor/blocks/paragraph-block-settings.tsx";
import { ParagraphBlockView } from "#/email-block-editor/blocks/paragraph-block-view.tsx";
import type { EmailEditorParagraphBlock } from "#/email-block-editor/document/types.ts";

export const paragraphBlockDefinition: EmailBlockDefinition<EmailEditorParagraphBlock> =
	{
		type: "paragraph",
		label: "Paragraph",
		icon: TextAlignLeftIcon,
		createEmpty: (id) => ({ id, type: "paragraph", spans: [] }),
		View: ParagraphBlockView,
		Settings: ParagraphBlockSettings,
		richText: true,
	};
