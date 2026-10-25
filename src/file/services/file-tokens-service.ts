import { Context, type DateTime, type Effect } from "effect";
import type { InvalidFileTokenError } from "#file/errors/invalid-file-token-error";
import type { FileKey } from "#file/value-objects/file-key";

export class FileTokensService extends Context.Service<
	FileTokensService,
	{
		readonly mint: (grant: {
			readonly key: FileKey;
			readonly expiresAt: DateTime.Utc;
		}) => Effect.Effect<string>;
		readonly verify: (input: {
			readonly key: FileKey;
			readonly token: string;
		}) => Effect.Effect<void, InvalidFileTokenError>;
	}
>()("@voila.dev/platform/FileTokensService") {}
