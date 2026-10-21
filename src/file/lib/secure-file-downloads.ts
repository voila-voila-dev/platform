import { DateTime, Effect, Layer } from "effect";
import { FileDownloads } from "#file/services/file-downloads";
import { FileLinkLifetime } from "#file/services/file-link-lifetime";
import { FileTokens } from "#file/services/file-tokens";
import type { FileKey } from "#file/value-objects/file-key";
import { FileLink } from "#file/value-objects/file-link";

export function encodeFileKeyPath(key: FileKey): string {
	return key.split("/").map(encodeURIComponent).join("/");
}

export function secureFileDownloads(options: { readonly baseUrl: string }) {
	return Layer.effect(
		FileDownloads,
		Effect.gen(function* () {
			const tokens = yield* FileTokens;
			return {
				link: (key) =>
					Effect.gen(function* () {
						const lifetimes = yield* FileLinkLifetime;
						const expiresAt = DateTime.addDuration(
							yield* DateTime.now,
							lifetimes.download,
						);
						const token = yield* tokens.mint({ key, expiresAt });
						return new FileLink({
							url: `${options.baseUrl}/${encodeFileKeyPath(key)}?token=${token}`,
							expiresAt: DateTime.toDateUtc(expiresAt),
						});
					}),
			};
		}),
	);
}
