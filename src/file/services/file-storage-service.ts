import { Context, type Effect, type Option } from "effect";
import type { ContentType } from "#file/value-objects/content-type";
import type { FileKey } from "#file/value-objects/file-key";
import type { FileLink } from "#file/value-objects/file-link";
import type { FileStat } from "#file/value-objects/file-stat";

export class FileStorageService extends Context.Service<
	FileStorageService,
	{
		readonly uploadUrl: (input: {
			readonly key: FileKey;
			readonly contentType: ContentType;
			readonly contentLength: number;
		}) => Effect.Effect<FileLink>;
		readonly put: (input: {
			readonly key: FileKey;
			readonly bytes: Uint8Array;
			readonly contentType: ContentType;
		}) => Effect.Effect<void>;
		readonly read: (key: FileKey) => Effect.Effect<Option.Option<Uint8Array>>;
		readonly stat: (key: FileKey) => Effect.Effect<Option.Option<FileStat>>;
		readonly delete: (key: FileKey) => Effect.Effect<void>;
	}
>()("@voila.dev/platform/FileStorageService") {}
