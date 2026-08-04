import { ColumnsIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { GridBlockSettings } from "#/email-block-editor/blocks/grid-block-settings.tsx";
import { GridBlockView } from "#/email-block-editor/blocks/grid-block-view.tsx";
import type { EmailEditorGridBlock } from "#/email-block-editor/document/types.ts";

export const gridBlockDefinition: EmailBlockDefinition<EmailEditorGridBlock> = {
	type: "grid",
	label: "Columns",
	icon: ColumnsIcon,
	createEmpty: (id) => ({
		id,
		type: "grid",
		desktopColumns: 2,
		mobileColumns: 1,
		children: [],
	}),
	View: GridBlockView,
	Settings: GridBlockSettings,
	// What makes a grid a container, said once here rather than as nine
	// `type === "grid"` tests scattered through the reducer and the dnd layer.
	// No `accepts`: the default — anything that is not itself a container —
	// is exactly the one-level-of-nesting rule the model already had.
	container: {
		children: (block) => block.children,
		withChildren: (block, children) => ({
			...block,
			children: children as EmailEditorGridBlock["children"],
		}),
		layout: "grid",
	},
};
