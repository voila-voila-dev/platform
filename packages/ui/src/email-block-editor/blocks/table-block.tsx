import { TableIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { TableBlockSettings } from "#/email-block-editor/blocks/table-block-settings.tsx";
import { TableBlockView } from "#/email-block-editor/blocks/table-block-view.tsx";
import type { EmailEditorTableBlock } from "#/email-block-editor/document/types.ts";

export const tableBlockDefinition: EmailBlockDefinition<EmailEditorTableBlock> =
	{
		type: "table",
		label: "Table",
		icon: TableIcon,
		createEmpty: (id) => ({
			id,
			type: "table",
			columns: [
				{ label: "", align: "left" },
				{ label: "", align: "right" },
			],
			rows: [["", ""]],
			headerRow: true,
		}),
		View: TableBlockView,
		Settings: TableBlockSettings,
	};
