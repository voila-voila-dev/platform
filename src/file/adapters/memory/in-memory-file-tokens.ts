import { DateTime, Effect, Layer } from "effect";
import { InvalidFileTokenError } from "#file/errors/invalid-file-token-error";
import { FileTokens } from "#file/services/file-tokens";
import type { FileKey } from "#file/value-objects/file-key";

export function inMemoryFileTokens() {
	const minted = new Map<
		string,
		{ readonly key: FileKey; readonly expiresAt: DateTime.Utc }
	>();

	return {
		minted,
		layer: Layer.succeed(FileTokens, {
			mint: (grant) =>
				Effect.sync(() => {
					const token = `token-${minted.size + 1}`;
					minted.set(token, grant);
					return token;
				}),
			verify: ({ key, token }) =>
				Effect.gen(function* () {
					const grant = minted.get(token);
					const now = yield* DateTime.now;
					if (
						grant === undefined ||
						grant.key !== key ||
						!DateTime.isGreaterThan(grant.expiresAt, now)
					)
						return yield* new InvalidFileTokenError();
				}),
		}),
	};
}
