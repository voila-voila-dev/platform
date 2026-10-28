import type {
	ContentEditorApi,
	ContentToolbarItem,
} from "#/content-editor/features/feature-definition.tsx";

/**
 * The mounted toolbar controls that can open an item's form, so a key can
 * open it too. The same item can be on screen twice, in the toolbar and in
 * the floating toolbar over the selection; the floating one mounts with the
 * selection, after the toolbar, and it is the one next to the text, so the
 * control registered last wins.
 */
export interface ContentPopoverHosts {
	readonly register: (key: string, open: () => void) => () => void;
	readonly open: (key: string) => void;
	/** A mounted inspector hands over how to focus its first field. */
	readonly registerInspector: (focus: () => boolean) => () => void;
	/** Focuses the inspector's first field; false when none is on screen. */
	readonly focusInspector: () => boolean;
}

export function createPopoverHosts(): ContentPopoverHosts {
	const hosts: Array<{ readonly key: string; readonly open: () => void }> = [];
	const inspectors: Array<() => boolean> = [];
	return {
		registerInspector: (focus) => {
			inspectors.push(focus);
			return () => {
				inspectors.splice(inspectors.indexOf(focus), 1);
			};
		},
		focusInspector: () => inspectors.some((focus) => focus()),
		register: (key, open) => {
			const host = { key, open };
			hosts.push(host);
			return () => {
				hosts.splice(hosts.indexOf(host), 1);
			};
		},
		open: (key) => {
			const matching = hosts.filter((host) => host.key === key);
			matching[matching.length - 1]?.open();
		},
	};
}

/**
 * Hands the item to the inspector when it edits the element under the
 * caret and one is on screen. True when it did, and the form must stay shut.
 */
export function focusInspectorFor(
	item: ContentToolbarItem,
	editor: ContentEditorApi,
	hosts: ContentPopoverHosts,
): boolean {
	return item.editedInInspector?.(editor) === true && hosts.focusInspector();
}
