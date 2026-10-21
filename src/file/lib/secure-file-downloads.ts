import { DateTime, Effect, Layer } from "effect";
import { FileDownloads } from "#file/services/file-downloads";
import { FileLinkLifetime } from "#file/services/file-link-lifetime";
import { FileTokens } from "#file/services/file-tokens";
import type { FileKey } from "#file/value-objects/file-key";

export function encodeFileKeyPath(key: FileKey): string {
	return key.split("/").map(encodeURIComponent).join("/");
}

// Links to the application's own route serving `serveSecureFile` at
// `baseUrl`, so the bucket never appears in a URL the browser sees.
export function secureFileDownloads(options: { readonly baseUrl: string }) {
	return Layer.effect(
		FileDownloads,
		Effect.gen(function* () {
			const tokens = yield* FileTokens;
			return {
				link: (key) =>
					Effect.gen(function* () {
						const { downloadSeconds } = yield* FileLinkLifetime;
						const expiresAt = DateTime.add(yield* DateTime.now, {
							seconds: downloadSeconds,
						});
						const token = yield* tokens.mint({ key, expiresAt });
						return {
							url: `${options.baseUrl}/${encodeFileKeyPath(key)}?token=${token}`,
							expiresAt: DateTime.toDateUtc(expiresAt),
						};
					}),
			};
		}),
	);
}
