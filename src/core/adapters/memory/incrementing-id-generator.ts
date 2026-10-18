import { Effect, Layer } from "effect";
import { Id } from "#core/ids/id";
import { IdGenerator } from "#core/services/id-generator";

export function incrementingIdGenerator() {
	let counter = 0;
	const generated: Array<Id> = [];
	return {
		generated,
		layer: Layer.succeed(IdGenerator, {
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
