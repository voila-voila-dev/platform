import { Effect, Option } from "effect";
import { FileNotFoundError } from "#file/errors/file-not-found-error";
import { FileStorageService } from "#file/services/file-storage-service";
import type { FileKey } from "#file/value-objects/file-key";

export function readFile(key: FileKey) {
	return Effect.flatMap(
		Effect.flatMap(FileStorageService, (storage) => storage.read(key)),
		Option.match({
			onNone: () => Effect.fail(new FileNotFoundError({ key })),
			onSome: Effect.succeed,
		}),
	);
}
