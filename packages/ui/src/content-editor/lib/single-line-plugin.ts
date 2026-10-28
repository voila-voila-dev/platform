import { createPlatePlugin } from "platejs/react";

/**
 * One paragraph, no breaks: Enter is swallowed, a document seeded with
 * several blocks is folded into its first, and a second top-level block
 * that appears later (a paste) is merged back, so a single-line editor
 * holds what a text input holds, marks and links included.
 */
export const SingleLinePlugin = createPlatePlugin({
	key: "single-line",
	// Plate reads nothing back from this hook: the seed is folded in place.
	normalizeInitialValue: ({ editor }) => {
		const [first, ...rest] = editor.children;
		if (first === undefined || rest.length === 0) {
			return;
		}
		editor.children = [
			{
				...first,
				children: [
					...first.children,
					...rest.flatMap((block) => [{ text: " " }, ...block.children]),
				],
			},
		];
	},
}).overrideEditor(({ editor, tf: { normalizeNode } }) => ({
	transforms: {
		insertBreak: () => {},
		insertSoftBreak: () => {},
		normalizeNode: (entry, options) => {
			const [, path] = entry;
			if (path.length === 0 && editor.children.length > 1) {
				editor.tf.mergeNodes({ at: [1] });
				return;
			}
			normalizeNode(entry, options);
		},
	},
}));
