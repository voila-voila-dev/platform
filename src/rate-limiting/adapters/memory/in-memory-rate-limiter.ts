import { Layer } from "effect";
import { RateLimiter as EffectRateLimiter } from "effect/persistence";
import { rateLimiterFromStore } from "#rate-limiting/lib/rate-limiter-from-store";

// Counts per process: development and single-instance deployments.
export const inMemoryRateLimiter = rateLimiterFromStore.pipe(
	Layer.provide(EffectRateLimiter.layerStoreMemory),
);
