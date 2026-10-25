import { Effect, Schema } from "effect";
import type { KeyValueCacheService } from "#cache/services/key-value-cache-service";

// The value already comes from the source of truth, so a failed write is
// logged and skipped rather than failing the caller.
export function writeCachedValue<A, I>(
	cache: KeyValueCacheService["Service"],
	options: {
		readonly key: string;
		readonly schema: Schema.Codec<A, I>;
		readonly value: A;
		readonly ttlSeconds: number;
	},
): Effect.Effect<void> {
	return Schema.encodeEffect(options.schema)(options.value).pipe(
		Effect.flatMap((encoded) =>
			cache
				.set(options.key, JSON.stringify(encoded), options.ttlSeconds)
				.pipe(
					Effect.catchTag("CacheTransportError", (error) =>
						Effect.logWarning(
							`cache write failed for ${options.key}: ${error.reason}`,
						),
					),
				),
		),
		Effect.catchTag("SchemaError", () => Effect.void),
	);
}
