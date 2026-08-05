export type {
	EmailBlockComponentProps,
	EmailBlockContainer,
	EmailBlockDefinition,
} from "#/email-block-editor/blocks/block-definitions.tsx";
export {
	createEmailBlocks,
	type EmailBlocksOptions,
} from "#/email-block-editor/blocks/create-email-blocks.ts";
export {
	type AnyEmailBlockDefinition,
	createEmailBlockRegistry,
	type EmailEditorBlockOf,
	type EmailEditorRegistry,
} from "#/email-block-editor/blocks/registry.ts";
export { EmailBlockEditor } from "#/email-block-editor/components/email-block-editor.tsx";
export {
	type EmailEditorActionsContextValue,
	type EmailEditorConfigContextValue,
	type EmailEditorStateContextValue,
	useEmailEditor,
	useEmailEditorActions,
	useEmailEditorConfig,
	useEmailEditorLabels,
	useEmailEditorRegistry,
	useEmailEditorState,
	useEmailEditorTheme,
} from "#/email-block-editor/context/email-editor-context.tsx";
export type { SortableBlockHandle } from "#/email-block-editor/dnd/sortable-block-list.ts";
export {
	allEmailEditorBlocks,
	createEmailEditorReducer,
	type EmailEditorAction,
	type EmailEditorContainerId,
	type EmailEditorState,
} from "#/email-block-editor/document/reducer.ts";
export {
	EMAIL_EDITOR_DOCUMENT_VERSION,
	type EmailEditorAlignment,
	type EmailEditorArticleBlock,
	type EmailEditorBlockLike,
	type EmailEditorBuiltInBlock,
	type EmailEditorBuiltInBlockType,
	type EmailEditorBuiltInLeafBlock,
	type EmailEditorBuiltInLeafBlockType,
	type EmailEditorButtonBlock,
	type EmailEditorButtonVariant,
	type EmailEditorCardImage,
	type EmailEditorDividerBlock,
	type EmailEditorDocument,
	type EmailEditorFinePrintBlock,
	type EmailEditorGridBlock,
	type EmailEditorGridColumns,
	type EmailEditorGridMobileColumns,
	type EmailEditorHeadingBlock,
	type EmailEditorHeadingLevel,
	type EmailEditorHighlightBlock,
	type EmailEditorImageBlock,
	type EmailEditorImageOverlay,
	type EmailEditorImageWidth,
	type EmailEditorListBlock,
	type EmailEditorListItem,
	type EmailEditorListMarker,
	type EmailEditorMoney,
	type EmailEditorOfferBlock,
	type EmailEditorParagraphBlock,
	type EmailEditorPreview,
	type EmailEditorProductBlock,
	type EmailEditorRatingBlock,
	type EmailEditorRatingStyle,
	type EmailEditorStatBlock,
	type EmailEditorTableBlock,
	type EmailEditorTableColumn,
	type EmailEditorTextSpan,
	emptyEmailEditorDocument,
} from "#/email-block-editor/document/types.ts";
export {
	DEFAULT_EMAIL_EDITOR_LABELS,
	type EmailEditorBlockLabels,
	type EmailEditorBlockNameLabels,
	type EmailEditorChromeLabels,
	type EmailEditorFieldLabels,
	type EmailEditorLabels,
	type EmailEditorLabelsInput,
	mergeEmailEditorLabels,
} from "#/email-block-editor/labels.ts";
export { EmailEditor } from "#/email-block-editor/parts/namespace.ts";
export type { EmailEditorRootProps } from "#/email-block-editor/parts/root.tsx";
export {
	DEFAULT_EMAIL_EDITOR_THEME,
	type EmailEditorTheme,
	type EmailEditorThemeColor,
	type EmailEditorThemeInput,
	mergeEmailEditorTheme,
} from "#/email-block-editor/theme.ts";
