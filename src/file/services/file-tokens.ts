import { Context, type DateTime, type Effect } from "effect";
import type { InvalidFileTokenError } from "#file/errors/invalid-file-token-error";
import type { FileKey } from "#file/value-objects/file-key";

// A token grants reading one key until it expires: it is the whole
// authorization of a secure download link.
export class FileTokens extends Context.Service<
	FileTokens,
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
>()("@voila.dev/platform/FileTokens") {}
