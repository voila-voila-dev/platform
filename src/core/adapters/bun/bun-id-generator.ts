import { Effect, Layer } from "effect";
import { IdGeneratorService } from "#core/services/id-generator-service";
import { Id } from "#core/value-objects/id";

export const bunIdGenerator = Layer.succeed(IdGeneratorService, {
	generate: () => Effect.sync(() => Id.make(Bun.randomUUIDv7())),
});
