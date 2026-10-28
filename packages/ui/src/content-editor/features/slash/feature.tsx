import { SlashInputPlugin, SlashPlugin } from "@platejs/slash-command/react";
import type { ContentFeature } from "#/content-editor/features/feature-definition.tsx";
import { SlashInputElement } from "#/content-editor/features/slash/slash-input-element.tsx";

/**
 * Typing `/` opens a menu of every slash item the other features declare.
 * Leave this feature out for an editor without one.
 */
export const slashFeature: ContentFeature = {
	key: "slash",
	plugins: () => [SlashPlugin, SlashInputPlugin],
	components: { slash_input: SlashInputElement },
	allowIn: (mode) => mode === "block",
};
