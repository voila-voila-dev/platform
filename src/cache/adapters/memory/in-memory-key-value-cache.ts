import { Clock, Effect, Layer } from "effect";
import { CacheMissError } from "#cache/errors/cache-miss-error";
import { KeyValueCacheService } from "#cache/services/key-value-cache-service";

// Expiry reads the Effect `Clock`, so a test moves time with `TestClock`. A
// test may seed or inspect `store` directly; an entry written there never
// expires.
export function inMemoryKeyValueCache() {
	const store = new Map<string, string>();
	const expiries = new Map<string, number>();

	function live(key: string, now: number) {
		const expiresAt = expiries.get(key);
		if (expiresAt !== undefined && expiresAt <= now) {
			store.delete(key);
			expiries.delete(key);
		}
		return store.get(key);
	}

	function write(key: string, value: string, expiresAt: number) {
		store.set(key, value);
		expiries.set(key, expiresAt);
	}

	return {
		store,
		layer: Layer.succeed(
			KeyValueCacheService,
			KeyValueCacheService.of({
				get: (key) =>
					Effect.flatMap(Clock.currentTimeMillis, (now) => {
						const value = live(key, now);
						return value === undefined
							? Effect.fail(new CacheMissError({ key }))
							: Effect.succeed(value);
					}),
				set: (key, value, ttlSeconds) =>
					Effect.map(Clock.currentTimeMillis, (now) =>
						write(key, value, now + ttlSeconds * 1000),
					),
				increment: (key, ttlSeconds) =>
					Effect.map(Clock.currentTimeMillis, (now) => {
						const value = live(key, now);
						const total = value === undefined ? 1 : Number(value) + 1;
						write(
							key,
							String(total),
							(value === undefined ? undefined : expiries.get(key)) ??
								now + ttlSeconds * 1000,
						);
						return total;
					}),
				delete: (key) =>
					Effect.sync(() => {
						store.delete(key);
						expiries.delete(key);
					}),
			}),
		),
	};
}
