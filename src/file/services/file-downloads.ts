import { Context, type Effect } from "effect";
import type { FileLink } from "#file/services/file-storage";
import type { FileKey } from "#file/value-objects/file-key";

export class FileDownloads extends Context.Service<
	FileDownloads,
	{
		readonly link: (key: FileKey) => Effect.Effect<FileLink>;
	}
>()("@voila.dev/platform/FileDownloads") {}
