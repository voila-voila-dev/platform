import { createContext, useContext } from "react";
import {
	type ContentEditorTheme,
	DEFAULT_CONTENT_EDITOR_THEME,
} from "#/content-editor/theme.ts";

/**
 * The theme on its own, apart from the editor's config: the card views read
 * it, and the email block editor renders those same views without a content
 * editor around them. Outside any provider it is the defaults, so a view
 * rendered on its own still looks right.
 */
const ContentEditorThemeContext = createContext<ContentEditorTheme>(
	DEFAULT_CONTENT_EDITOR_THEME,
);

export const ContentEditorThemeProvider = ContentEditorThemeContext.Provider;

export function useContentEditorTheme(): ContentEditorTheme {
	return useContext(ContentEditorThemeContext);
}
