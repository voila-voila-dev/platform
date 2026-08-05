import { ColumnsIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { GridBlockSettings } from "#/email-block-editor/blocks/grid-block-settings.tsx";
import { GridBlockView } from "#/email-block-editor/blocks/grid-block-view.tsx";
import type {
	EmailEditorBlockLike,
	EmailEditorGridBlock,
} from "#/email-block-editor/document/types.ts";

/**
 * The multi-column row, over whatever may sit in a cell. `Leaf` is a type
 * parameter so the block union derived from a definition list carries the
 * right children type — a grid of *these* blocks, not of the ones the package
 * happens to ship.
 */
export const createGridBlockDefinition = <
	Leaf extends EmailEditorBlockLike,
>(): EmailBlockDefinition<EmailEditorGridBlock<Leaf>> => ({
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
	// No `accepts`: the default — anything that is not itself a container — is
	// exactly the one-level-of-nesting rule the model already had.
	container: {
		children: (block) => block.children,
		withChildren: (block, children) => ({
			...block,
			children: children as ReadonlyArray<Leaf>,
		}),
		layout: "grid",
	},
});
