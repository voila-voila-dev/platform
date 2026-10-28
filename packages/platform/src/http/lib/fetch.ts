// Narrower than `typeof fetch` so a test double is a plain async function:
// runtimes add members to the global (Bun's `preconnect`) no caller uses.
export type Fetch = (
	input: string | URL | Request,
	init?: RequestInit,
) => Promise<Response>;

// Looked up on each call, so a stub installed after an adapter was built is still reached.
export const globalFetch: Fetch = (input, init) => fetch(input, init);
