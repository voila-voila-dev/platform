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
}

export function createPopoverHosts(): ContentPopoverHosts {
	const hosts: Array<{ readonly key: string; readonly open: () => void }> = [];
	return {
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
