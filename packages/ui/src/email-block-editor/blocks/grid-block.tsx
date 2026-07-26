import { ColumnsIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { GridBlockSettings } from "#/email-block-editor/blocks/grid-block-settings.tsx";
import { GridBlockView } from "#/email-block-editor/blocks/grid-block-view.tsx";
import type { EmailEditorGridBlock } from "#/email-block-editor/document/types.ts";

export const gridBlockDefinition: EmailBlockDefinition<EmailEditorGridBlock> = {
	label: "Columns",
	icon: ColumnsIcon,
	View: GridBlockView,
	Settings: GridBlockSettings,
};
