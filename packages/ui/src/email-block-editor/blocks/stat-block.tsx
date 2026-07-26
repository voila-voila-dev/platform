import { ChartBarIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { StatBlockSettings } from "#/email-block-editor/blocks/stat-block-settings.tsx";
import { StatBlockView } from "#/email-block-editor/blocks/stat-block-view.tsx";
import type { EmailEditorStatBlock } from "#/email-block-editor/document/types.ts";

export const statBlockDefinition: EmailBlockDefinition<EmailEditorStatBlock> = {
	label: "Key figure",
	icon: ChartBarIcon,
	View: StatBlockView,
	Settings: StatBlockSettings,
};
