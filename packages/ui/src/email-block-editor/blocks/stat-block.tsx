import { ChartBarIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { StatBlockSettings } from "#/email-block-editor/blocks/stat-block-settings.tsx";
import { StatBlockView } from "#/email-block-editor/blocks/stat-block-view.tsx";
import type { EmailEditorStatBlock } from "#/email-block-editor/document/types.ts";

export const statBlockDefinition: EmailBlockDefinition<EmailEditorStatBlock> = {
	type: "stat",
	label: "Key figure",
	icon: ChartBarIcon,
	createEmpty: (id) => ({
		id,
		type: "stat",
		value: "",
		label: "",
		description: "",
		align: "center",
	}),
	View: StatBlockView,
	Settings: StatBlockSettings,
};
