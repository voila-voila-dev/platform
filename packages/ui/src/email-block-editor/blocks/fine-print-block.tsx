import { AsteriskIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { FinePrintBlockView } from "#/email-block-editor/blocks/fine-print-block-view.tsx";
import type { EmailEditorFinePrintBlock } from "#/email-block-editor/document/types.ts";

export const finePrintBlockDefinition: EmailBlockDefinition<EmailEditorFinePrintBlock> =
	{
		label: "Fine print",
		icon: AsteriskIcon,
		View: FinePrintBlockView,
		Settings: null,
	};
