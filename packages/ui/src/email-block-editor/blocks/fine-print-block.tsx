import { AsteriskIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { FinePrintBlockView } from "#/email-block-editor/blocks/fine-print-block-view.tsx";
import type { EmailEditorFinePrintBlock } from "#/email-block-editor/document/types.ts";

export const finePrintBlockDefinition: EmailBlockDefinition<EmailEditorFinePrintBlock> =
	{
		type: "finePrint",
		label: "Fine print",
		icon: AsteriskIcon,
		createEmpty: (id) => ({ id, type: "finePrint", spans: [] }),
		View: FinePrintBlockView,
		Settings: null,
		richText: true,
	};
