/**
 * What the canvas is sized and coloured with. The variables point at the
 * kit's tokens, so the canvas follows the active theme and dark mode; a host
 * overrides one section at a time.
 */
export interface ContentEditorTheme {
	/** CSS custom properties set on the editor root. */
	readonly variables: {
		readonly "--content-editor-min-height": string;
		readonly "--content-editor-max-height": string;
		readonly "--content-editor-block-gap": string;
		readonly "--content-editor-prose-width": string;
	};
}

export interface ContentEditorThemeInput {
	readonly variables?: Partial<ContentEditorTheme["variables"]>;
}

export const DEFAULT_CONTENT_EDITOR_THEME: ContentEditorTheme = {
	variables: {
		"--content-editor-min-height": "8rem",
		"--content-editor-max-height": "none",
		"--content-editor-block-gap": "0.75rem",
		"--content-editor-prose-width": "48rem",
	},
};

export function mergeContentEditorTheme(
	input: ContentEditorThemeInput | undefined,
): ContentEditorTheme {
	if (input === undefined) {
		return DEFAULT_CONTENT_EDITOR_THEME;
	}
	return {
		variables: {
			...DEFAULT_CONTENT_EDITOR_THEME.variables,
			...input.variables,
		},
	};
}
