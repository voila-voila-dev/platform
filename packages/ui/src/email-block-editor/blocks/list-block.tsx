import { ListBulletsIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { ListBlockSettings } from "#/email-block-editor/blocks/list-block-settings.tsx";
import { ListBlockView } from "#/email-block-editor/blocks/list-block-view.tsx";
import type { EmailEditorListBlock } from "#/email-block-editor/document/types.ts";

export const listBlockDefinition: EmailBlockDefinition<EmailEditorListBlock> = {
	type: "list",
	label: "List",
	icon: ListBulletsIcon,
	createEmpty: (id) => ({
		id,
		type: "list",
		marker: "bullet",
		items: [{ spans: [] }],
	}),
	View: ListBlockView,
	Settings: ListBlockSettings,
	richText: true,
};
