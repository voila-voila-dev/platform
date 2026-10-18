import { Effect, Layer } from "effect";
import { IdGenerator } from "#core/services/id-generator";
import { Id } from "#core/value-objects/id";

export const bunIdGenerator = Layer.succeed(IdGenerator, {
	generate: () => Effect.sync(() => Id.make(Bun.randomUUIDv7())),
});
