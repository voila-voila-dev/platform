import { CursorClickIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { ButtonBlockSettings } from "#/email-block-editor/blocks/button-block-settings.tsx";
import { ButtonBlockView } from "#/email-block-editor/blocks/button-block-view.tsx";
import type { EmailEditorButtonBlock } from "#/email-block-editor/document/types.ts";

export const buttonBlockDefinition: EmailBlockDefinition<EmailEditorButtonBlock> =
	{
		type: "button",
		label: "Button",
		icon: CursorClickIcon,
		createEmpty: (id) => ({
			id,
			type: "button",
			label: "",
			href: "",
			align: "center",
			variant: "primary",
		}),
		View: ButtonBlockView,
		Settings: ButtonBlockSettings,
	};
