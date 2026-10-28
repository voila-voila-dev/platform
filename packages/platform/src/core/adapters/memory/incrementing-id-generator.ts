import { Effect, Layer } from "effect";
import { IdGeneratorService } from "#core/services/id-generator-service";
import { Id } from "#core/value-objects/id";

export function incrementingIdGenerator() {
	let counter = 0;
	const generated: Array<Id> = [];
	return {
		generated,
		layer: Layer.succeed(IdGeneratorService, {
			generate: () =>
				Effect.sync(() => {
					counter += 1;
					const id = Id.make(
						`00000000-0000-0000-0000-${String(counter).padStart(12, "0")}`,
					);
					generated.push(id);
					return id;
				}),
		}),
	};
}
