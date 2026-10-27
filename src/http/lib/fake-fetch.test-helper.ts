import type { Fetch } from "#http/lib/fetch";

export interface FakeFetchCall {
	readonly url: string;
	readonly init: RequestInit;
}

/**
 * A `fetch` scripted per call, recording each one: `respond` returns a
 * `Response`, or throws to stand for a network failure.
 */
export function fakeFetch(
	respond: (url: string, init: RequestInit, attempt: number) => Response,
): { readonly calls: Array<FakeFetchCall>; readonly fetch: Fetch } {
	const calls: Array<FakeFetchCall> = [];
	const fetch: Fetch = async (input, init) => {
		const url = input instanceof Request ? input.url : String(input);
		calls.push({ url, init: init ?? {} });
		return respond(url, init ?? {}, calls.length);
	};
	return { calls, fetch };
}
