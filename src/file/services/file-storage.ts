import { Context, type Effect, type Option } from "effect";
import type { FileKey } from "#file/value-objects/file-key";

export interface FileLink {
	readonly url: string;
	readonly expiresAt: Date;
}

export interface FileStat {
	readonly contentType: string;
	readonly sizeBytes: number;
}

// A storage failure is a defect: the callers can do nothing but fail too.
export class FileStorage extends Context.Service<
	FileStorage,
	{
		// Where the browser PUTs the declared file, so its bytes never cross the server.
		readonly uploadUrl: (input: {
			readonly key: FileKey;
			readonly contentType: string;
			readonly contentLength: number;
		}) => Effect.Effect<FileLink>;
		readonly put: (input: {
			readonly key: FileKey;
			readonly bytes: Uint8Array;
			readonly contentType: string;
		}) => Effect.Effect<void>;
		readonly read: (key: FileKey) => Effect.Effect<Option.Option<Uint8Array>>;
		readonly stat: (key: FileKey) => Effect.Effect<Option.Option<FileStat>>;
		readonly delete: (key: FileKey) => Effect.Effect<void>;
	}
>()("@voila.dev/platform/FileStorage") {}
