import { Context, Effect } from "effect";
import { type Fetch, globalFetch } from "#http/lib/fetch";

// The `fetch` each partner's calls go through. Unprovided (tests, scripts) it
// is the global one; an app provides a recording one so every request lands
// in its log.
export const OutboundFetch = Context.Reference<(partner: string) => Fetch>(
	"@voila.dev/platform/OutboundFetch",
	{ defaultValue: () => () => globalFetch },
);

export function outboundFetch(partner: string): Effect.Effect<Fetch> {
	return Effect.map(OutboundFetch, (fetchFor) => fetchFor(partner));
}
