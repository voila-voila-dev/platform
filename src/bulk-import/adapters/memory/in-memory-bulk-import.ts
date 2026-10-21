import { Layer } from "effect";
import { inMemoryImportIntentRepository } from "#bulk-import/adapters/memory/in-memory-import-intent-repository";
import { incrementingIdGenerator } from "#core/adapters/memory/incrementing-id-generator";

// Everything a `BulkImport` needs, for the importing domain's tests.
export function inMemoryBulkImport() {
	const intents = inMemoryImportIntentRepository();
	return {
		intents,
		layer: Layer.mergeAll(intents.layer, incrementingIdGenerator().layer),
	};
}
