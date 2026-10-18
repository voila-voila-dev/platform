import { Effect, Layer } from "effect";
import { Id } from "#core/ids/id";
import { IdGenerator } from "#core/services/id-generator";

export const bunIdGenerator = Layer.succeed(IdGenerator, {
	generate: () => Effect.sync(() => Id.make(Bun.randomUUIDv7())),
});
