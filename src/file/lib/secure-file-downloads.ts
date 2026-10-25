import { DateTime, Effect, Layer } from "effect";
import { FileDownloadsService } from "#file/services/file-downloads-service";
import { FileLinkLifetime } from "#file/services/file-link-lifetime";
import { FileTokensService } from "#file/services/file-tokens-service";
import type { FileKey } from "#file/value-objects/file-key";
import { FileLink } from "#file/value-objects/file-link";

export function encodeFileKeyPath(key: FileKey): string {
	return key.split("/").map(encodeURIComponent).join("/");
}

export function secureFileDownloads(options: { readonly baseUrl: string }) {
	return Layer.effect(
		FileDownloadsService,
		Effect.gen(function* () {
			const tokens = yield* FileTokensService;
			return {
				link: (key) =>
					Effect.gen(function* () {
						const lifetimes = yield* FileLinkLifetime;
						const expiresAt = DateTime.addDuration(
							yield* DateTime.now,
							lifetimes.download,
						);
						const token = yield* tokens.mint({ key, expiresAt });
						return FileLink.make({
							url: `${options.baseUrl}/${encodeFileKeyPath(key)}?token=${token}`,
							expiresAt: DateTime.toDateUtc(expiresAt),
						});
					}),
			};
		}),
	);
}
