import { Layer } from "effect";
import { incrementingIdGenerator } from "#core/adapters/memory/incrementing-id-generator";
import { inMemoryFileStorage } from "#file/adapters/memory/in-memory-file-storage";
import { inMemoryFileTokens } from "#file/adapters/memory/in-memory-file-tokens";
import { secureFileDownloads } from "#file/lib/secure-file-downloads";

export const IN_MEMORY_SECURE_FILES_URL =
	"https://files.memory.test/secure-files";

// Everything the file brick needs, for the calling domain's tests.
export function inMemoryFiles() {
	const storage = inMemoryFileStorage();
	const tokens = inMemoryFileTokens();
	return {
		storage,
		tokens,
		layer: Layer.mergeAll(
			storage.layer,
			tokens.layer,
			secureFileDownloads({ baseUrl: IN_MEMORY_SECURE_FILES_URL }).pipe(
				Layer.provide(tokens.layer),
			),
			incrementingIdGenerator().layer,
		),
	};
}
