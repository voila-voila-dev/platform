import type { Icon } from "@phosphor-icons/react";
import type {
	AnyPlatePlugin,
	PlateEditor,
	PlateElementProps,
} from "platejs/react";
import type { ComponentType, FunctionComponent } from "react";
import type { ContentFeatureReader } from "#/content-editor/features/reader-definition.tsx";
import type { ContentEditorLabels } from "#/content-editor/labels.ts";

/**
 * The editor half of a feature: what one node kind or one behaviour needs
 * from Plate and what it puts in the chrome. Extends the reader half, so a
 * feature is authored once and the registry derives the plugin list, the
 * component map, the toolbar, the slash menu, the renderer and the
 * serializer from it, where the source editor kept five lists by hand.
 */
export type ContentEditorMode = "block" | "inline" | "single-line";

/** What a host wires that a feature cannot assume. Today only image upload. */
export type ContentCapability = "upload-image";

export type ContentEditorApi = PlateEditor;

export interface ContentUploadedImage {
	readonly url: string;
	readonly width?: number;
	readonly height?: number;
}

export interface ContentPluginContext {
	readonly mode: ContentEditorMode;
	/** The block types the indent and list machinery may act on. */
	readonly indentableTypes: ReadonlyArray<string>;
}

export interface ContentItemContext {
	readonly labels: ContentEditorLabels;
	readonly uploadImage: ((file: File) => Promise<ContentUploadedImage>) | null;
}

export type ContentToolbarGroup =
	| "history"
	| "text"
	| "block"
	| "list"
	| "insert"
	| "table";

export interface ContentToolbarItem {
	readonly key: string;
	readonly group: ContentToolbarGroup;
	readonly icon: Icon;
	/** The label key under `labels.items`. */
	readonly label: string;
	/** Keys rendered through `Kbd`, e.g. `["⌘", "B"]`. */
	readonly kbd?: ReadonlyArray<string>;
	readonly isActive?: (editor: ContentEditorApi) => boolean;
	readonly isDisabled?: (editor: ContentEditorApi) => boolean;
	/** Shown only while this predicate holds (the table controls inside a table). */
	readonly isVisible?: (editor: ContentEditorApi) => boolean;
	readonly run: (editor: ContentEditorApi, context: ContentItemContext) => void;
	/** When present, the item opens this instead of running (a link form). */
	readonly Popover?: ComponentType<{ readonly onClose: () => void }>;
	/** When present, the item opens a menu of these instead of running. */
	readonly menu?: ReadonlyArray<ContentToolbarItem>;
}

export interface ContentSlashItem {
	readonly key: string;
	readonly icon: Icon;
	readonly label: string;
	readonly keywords: ReadonlyArray<string>;
	readonly run: (editor: ContentEditorApi, context: ContentItemContext) => void;
}

/**
 * How a feature takes files the user drops on or pastes into the canvas.
 * The first feature whose `accepts` says yes gets each file.
 */
export interface ContentFileHandler {
	readonly accepts: (file: File) => boolean;
	readonly insert: (
		editor: ContentEditorApi,
		files: ReadonlyArray<File>,
		context: ContentItemContext,
	) => void;
}

export interface ContentFeature extends ContentFeatureReader {
	readonly plugins: (
		context: ContentPluginContext,
	) => ReadonlyArray<AnyPlatePlugin>;
	readonly files?: ContentFileHandler;
	/** Canvas element per node type; a table registers four. */
	readonly components?: Readonly<
		Record<string, FunctionComponent<PlateElementProps>>
	>;
	readonly toolbar?: ReadonlyArray<ContentToolbarItem>;
	readonly floating?: ReadonlyArray<ContentToolbarItem>;
	readonly slash?: ReadonlyArray<ContentSlashItem>;
	/** Hidden, and its items with it, unless the host wired the capability. */
	readonly requires?: ReadonlyArray<ContentCapability>;
	/** Which editor modes carry this feature; defaults to block editors only for block features. */
	readonly allowIn?: (mode: ContentEditorMode) => boolean;
}
