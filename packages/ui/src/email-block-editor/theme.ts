import {
	type ContentEditorTheme,
	type ContentEditorThemeColor,
	type ContentEditorThemeInput,
	DEFAULT_CONTENT_EDITOR_THEME,
	mergeContentEditorTheme,
} from "#/content-editor/theme.ts";

/**
 * The content editor's theme, whose token names this editor introduced. The
 * two editors share one theme so a host's palette, font and preview locale
 * carry over when it moves to the content editor.
 */
export type EmailEditorThemeColor = ContentEditorThemeColor;
export type EmailEditorTheme = Omit<ContentEditorTheme, "variables">;
export type EmailEditorThemeInput = Omit<ContentEditorThemeInput, "variables">;

export const DEFAULT_EMAIL_EDITOR_THEME: EmailEditorTheme =
	DEFAULT_CONTENT_EDITOR_THEME;

export const mergeEmailEditorTheme = (
	theme: EmailEditorThemeInput | undefined,
): EmailEditorTheme => mergeContentEditorTheme(theme);
