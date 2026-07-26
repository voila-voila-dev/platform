import { MinusIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { DividerBlockView } from "#/email-block-editor/blocks/divider-block-view.tsx";
import type { EmailEditorDividerBlock } from "#/email-block-editor/document/types.ts";

export const dividerBlockDefinition: EmailBlockDefinition<EmailEditorDividerBlock> =
	{
		label: "Divider",
		icon: MinusIcon,
		View: DividerBlockView,
		Settings: null,
	};
