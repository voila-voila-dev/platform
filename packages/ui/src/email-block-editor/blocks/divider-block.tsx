import { MinusIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import type { EmailEditorDividerBlock } from "#/email-block-editor/document/types.ts";
import { EMAIL_COLOR } from "#/email-block-editor/theme.ts";

/** A horizontal rule. Mirrors the domain `emailDivider` component. */
function DividerBlockView() {
	return (
		<hr className="my-2 border-t" style={{ borderColor: EMAIL_COLOR.border }} />
	);
}

export const dividerBlockDefinition: EmailBlockDefinition<EmailEditorDividerBlock> =
	{
		label: "Divider",
		icon: MinusIcon,
		View: DividerBlockView,
		Settings: null,
	};
