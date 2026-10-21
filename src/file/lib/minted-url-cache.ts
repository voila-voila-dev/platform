import type { Exit } from "effect";

// Never hand back a URL about to expire in the middle of loading the media.
const EXPIRY_MARGIN_MS = 60_000;

interface MintedTicket {
	readonly url: string;
	readonly expiresAt: Date;
}

// A batch endpoint answers de-duplicated, so each ticket names its key.
export interface KeyedMintedTicket extends MintedTicket {
	readonly key: string;
}

export type MintedUrlCache = ReturnType<typeof createMintedUrlCache>;

// Client side: minted URLs are kept until they near expiry, and mints run one
// at a time, since callers usually write through one shared mutation whose
// result two concurrent mints would overwrite.
export function createMintedUrlCache() {
	const minted = new Map<string, { url: string; expiresAt: number }>();
	let queue: Promise<unknown> = Promise.resolve();

	function cached(key: string): string | null {
		const entry = minted.get(key);
		if (entry === undefined) return null;
		return entry.expiresAt - EXPIRY_MARGIN_MS > Date.now() ? entry.url : null;
	}

	function store(key: string, url: string, expiresAtMs: number): void {
		minted.set(key, { url, expiresAt: expiresAtMs });
	}

	function enqueue<A>(task: () => Promise<A>): Promise<A> {
		const run = queue.then(task, task);
		queue = run.then(
			() => undefined,
			() => undefined,
		);
		return run;
	}

	async function resolve(
		key: string,
		request: () => Promise<Exit.Exit<MintedTicket, unknown>>,
	): Promise<string | null> {
		const hit = cached(key);
		if (hit !== null) return hit;
		const exit = await enqueue(request);
		if (exit._tag !== "Success") return null;
		store(key, exit.value.url, exit.value.expiresAt.getTime());
		return exit.value.url;
	}

	// Asks only for the keys not held. Keys the answer lacks (a denial, a
	// vanished file) are absent from the result, so one never blanks the others.
	async function resolveAll(
		keys: ReadonlyArray<string>,
		request: (
			missing: ReadonlyArray<string>,
		) => Promise<Exit.Exit<ReadonlyArray<KeyedMintedTicket>, unknown>>,
	): Promise<ReadonlyMap<string, string>> {
		const resolved = new Map<string, string>();
		const missing: Array<string> = [];
		for (const key of keys) {
			const hit = cached(key);
			if (hit === null) missing.push(key);
			else resolved.set(key, hit);
		}
		if (missing.length === 0) return resolved;

		const exit = await enqueue(() => request(missing));
		if (exit._tag !== "Success") return resolved;
		for (const ticket of exit.value) {
			store(ticket.key, ticket.url, ticket.expiresAt.getTime());
			resolved.set(ticket.key, ticket.url);
		}
		return resolved;
	}

	// `resolveAll` in chunks, publishing after each so a large set fills in
	// batch by batch.
	async function resolveAllBatched(input: {
		readonly keys: ReadonlyArray<string>;
		readonly batchSize: number;
		readonly request: (
			missing: ReadonlyArray<string>,
		) => Promise<Exit.Exit<ReadonlyArray<KeyedMintedTicket>, unknown>>;
		readonly isCancelled: () => boolean;
		readonly onResolved: (resolved: ReadonlyMap<string, string>) => void;
	}): Promise<void> {
		const resolved = new Map<string, string>();
		for (let start = 0; start < input.keys.length; start += input.batchSize) {
			const batch = input.keys.slice(start, start + input.batchSize);
			const batchUrls = await resolveAll(batch, input.request);
			if (input.isCancelled()) return;
			for (const [key, url] of batchUrls) resolved.set(key, url);
			input.onResolved(new Map(resolved));
		}
	}

	return { cached, store, enqueue, resolve, resolveAll, resolveAllBatched };
}
