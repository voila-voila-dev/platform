import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import { HttpServerResponse } from "effect/http";
import { serveSecureFile } from "#file/adapters/http-server/serve-secure-file";
import { inMemoryFiles } from "#file/adapters/memory/in-memory-files";
import { FileDownloads } from "#file/services/file-downloads";
import { ContentType } from "#file/value-objects/content-type";
import { FileKey } from "#file/value-objects/file-key";

const KEY = FileKey.make("signature-request/r1/contrat signé.pdf");

function serve(url: (link: string) => string, seeded = true) {
	const files = inMemoryFiles();
	if (seeded)
		files.storage.files.set(KEY, {
			bytes: new Uint8Array([1, 2, 3]),
			contentType: ContentType.make("application/pdf"),
		});
	return Effect.runPromise(
		Effect.gen(function* () {
			const link = yield* (yield* FileDownloads).link(KEY);
			return yield* serveSecureFile(new URL(url(link.url)), {
				path: "/secure-files",
			});
		}).pipe(Effect.provide(files.layer)),
	);
}

describe("serveSecureFile", () => {
	it("serves the file a download link points at, cached by that browser only", async () => {
		const response = await serve((link) => link);
		expect(response.status).toBe(200);
		expect(response.headers).toMatchObject({
			"cache-control": "private, max-age=900, immutable",
			"x-content-type-options": "nosniff",
			"content-disposition": `inline; filename*=UTF-8''contrat%20sign%C3%A9.pdf`,
		});
		expect(response.body).toMatchObject({ contentType: "application/pdf" });
	});

	it("answers the same 404 for a bad token, another key, no file or a broken path", async () => {
		for (const [rewrite, seeded] of [
			[(link: string) => link.replace(/token=.*/u, "token=forged"), true],
			[(link: string) => link.replace(/\?.*/u, ""), true],
			[(link: string) => link.replace("r1", "r2"), true],
			[(link: string) => link, false],
			[(link: string) => link.replace("/r1/", "/%E0%A4%A/"), true],
			[(link: string) => link.replace("/secure-files/", "/files/"), true],
		] as const) {
			const response = await serve(rewrite, seeded);
			expect(HttpServerResponse.isHttpServerResponse(response)).toBe(true);
			expect(response.status).toBe(404);
		}
	});
});
