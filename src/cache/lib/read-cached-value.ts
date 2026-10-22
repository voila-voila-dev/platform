import { Effect, Option, Schema } from "effect";
import type { KeyValueCache } from "#cache/services/key-value-cache";

// For a cache in front of a source of truth: every failure reads as absent.
// An entry written before a schema change (a deploy) is absent too.
export function readCachedValue<A, I>(
	cache: KeyValueCache["Service"],
	key: string,
	schema: Schema.Codec<A, I>,
): Effect.Effect<Option.Option<A>> {
	return cache.get(key).pipe(
		Effect.catchTag("CacheTransportError", (error) =>
			Effect.logWarning(`cache read failed for ${key}: ${error.reason}`).pipe(
				Effect.andThen(Effect.fail(error)),
			),
		),
		Effect.option,
		Effect.flatMap(
			Option.match({
				onNone: () => Effect.succeedNone,
				onSome: (cached) =>
					Effect.try({
						try: (): unknown => JSON.parse(cached),
						catch: (cause) => cause,
					}).pipe(
						Effect.flatMap(Schema.decodeUnknownEffect(schema)),
						Effect.option,
					),
			}),
		),
	);
}
