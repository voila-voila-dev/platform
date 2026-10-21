import { Duration, Effect, Option, Schema } from "effect";
import { HttpServerResponse } from "effect/http";
import { contentTypeOfKey } from "#file/lib/content-type";
import { FileLinkLifetime } from "#file/services/file-link-lifetime";
import { FileStorage } from "#file/services/file-storage";
import { FileTokens } from "#file/services/file-tokens";
import { FileKey } from "#file/value-objects/file-key";

const decodeFileKey = Schema.decodeUnknownOption(FileKey);

function notFound() {
	return HttpServerResponse.text("not found", { status: 404 });
}

export interface ServeSecureFileOptions {
	readonly path: string;
}

function keyFromPath(pathname: string, path: string) {
	const prefix = `${path.replace(/\/+$/u, "")}/`;
	if (!pathname.startsWith(prefix)) return Option.none();
	try {
		return decodeFileKey(
			pathname
				.slice(prefix.length)
				.split("/")
				.filter((segment) => segment.length > 0)
				.map(decodeURIComponent)
				.join("/"),
		);
	} catch {
		return Option.none();
	}
}

export function serveSecureFile(url: URL, options: ServeSecureFileOptions) {
	return Effect.gen(function* () {
		const key = keyFromPath(url.pathname, options.path);
		const token = url.searchParams.get("token");
		if (Option.isNone(key) || token === null) return notFound();

		const verified = yield* Effect.isSuccess(
			(yield* FileTokens).verify({ key: key.value, token }),
		);
		if (!verified) return notFound();
		const bytes = yield* (yield* FileStorage).read(key.value);
		if (Option.isNone(bytes)) return notFound();

		const lifetimes = yield* FileLinkLifetime;
		const fileName = key.value.split("/").at(-1) ?? "file";
		return HttpServerResponse.uint8Array(bytes.value, {
			contentType: contentTypeOfKey(key.value),
			headers: {
				"cache-control": `private, max-age=${Duration.toSeconds(lifetimes.download)}, immutable`,
				"x-content-type-options": "nosniff",
				"content-disposition": `inline; filename*=UTF-8''${encodeURIComponent(fileName)}`,
			},
		});
	});
}
