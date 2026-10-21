import { Context, type Effect } from "effect";
import type { FileKey } from "#file/value-objects/file-key";
import type { FileLink } from "#file/value-objects/file-link";

export class FileDownloads extends Context.Service<
	FileDownloads,
	{
		readonly link: (key: FileKey) => Effect.Effect<FileLink>;
	}
>()("@voila.dev/platform/FileDownloads") {}
