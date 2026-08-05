import type { Icon } from "@phosphor-icons/react";
import type { ComponentType, ReactNode } from "react";
import type {
	EmailEditorBlockLike,
	EmailEditorPreview,
} from "#/email-block-editor/document/types.ts";

/** What every block component receives, in the canvas and in the sidebar. */
export interface EmailBlockComponentProps<
	B extends EmailEditorBlockLike = EmailEditorBlockLike,
> {
	block: B;
	selected: boolean;
	onChange: (block: B) => void;
	onUploadImage?: (file: File) => Promise<string>;
	/** Which rendering the canvas is showing; a block whose layout differs
	 * between a phone and a desktop client reads it. Defaults to `desktop` in
	 * the settings panel, where it is irrelevant. */
	preview?: EmailEditorPreview;
	/** Container blocks only: the child rows the canvas has already wired for
	 * selection, drag-and-drop and their own toolbars. */
	children?: ReactNode;
}

/**
 * A block that holds other blocks. Declaring this is what makes a block a
 * container: the reducer, the drag-and-drop layer and the canvas consult it
 * instead of testing for the one container type the package happens to ship.
 */
export interface EmailBlockContainer<B extends EmailEditorBlockLike> {
	readonly children: (block: B) => ReadonlyArray<EmailEditorBlockLike>;
	readonly withChildren: (
		block: B,
		children: ReadonlyArray<EmailEditorBlockLike>,
	) => B;
	/** Which types may be dropped in. Defaults to everything that is not itself
	 * a container — the "one level of nesting" rule, without naming a type. */
	readonly accepts?: (type: string) => boolean;
	/** How the canvas arranges the children. */
	readonly layout?: "grid" | "list";
}

/**
 * Everything one editor instance knows about one block type. The definition is
 * the single source of truth: what an empty one looks like, how it renders and
 * is configured, whether its content is rich text, and whether it holds other
 * blocks. Adding a block is writing one of these and passing it to
 * `createEmailBlockRegistry` — there is no central switch to remember, and
 * nothing about it is specific to the blocks this package ships.
 */
export interface EmailBlockDefinition<B extends EmailEditorBlockLike> {
	readonly type: B["type"];
	/** Name shown in the add-block menu, unless `labels.blockNames` overrides
	 * it. A block of your own carries its own copy here. */
	readonly label: string;
	readonly icon: Icon;
	/** A freshly added block, with empty content fields. */
	readonly createEmpty: (id: string) => B;
	/** The WYSIWYG rendering, edited in place on the canvas. */
	readonly View: ComponentType<EmailBlockComponentProps<B>>;
	/** The per-block settings panel; null when the block has none. */
	readonly Settings: ComponentType<EmailBlockComponentProps<B>> | null;
	/** Content edited through the span model, so the toolbar offers
	 * bold/italic/underline/link. */
	readonly richText?: boolean;
	/** Present when the block holds other blocks. */
	readonly container?: EmailBlockContainer<B>;
}
