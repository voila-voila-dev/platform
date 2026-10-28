import { Layer } from "effect";
import {
	RateLimiter as EffectRateLimiter,
	type Redis,
} from "effect/persistence";
import { rateLimiterFromStore } from "#rate-limiting/lib/rate-limiter-from-store";
import type { RateLimiterService } from "#rate-limiting/services/rate-limiter-service";

// One count per key across every instance, on the application's `Redis`
// (e.g. `BunRedis.layer` from @effect/platform-bun). Give environments that
// share a server their own prefix.
export function redisRateLimiter(
	options: { readonly prefix?: string } = {},
): Layer.Layer<RateLimiterService, never, Redis.Redis> {
	return rateLimiterFromStore.pipe(
		Layer.provide(
			EffectRateLimiter.layerStoreRedis({
				prefix: options.prefix ?? "rate-limit:",
			}),
		),
	);
}
