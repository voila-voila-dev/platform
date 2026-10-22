# file

Stores the application's files and hands out links to upload and download them.

Users never call it directly. A domain (documents, messaging…) gates its own use cases and endpoints, and keeps the file's `FileRef` or `ImageRef` in its own table, next to what the file is for. The brick has no table of its own.

## Declare the kinds of files

```ts
import { ContentType, Files } from "@voila.dev/platform/file";

const IMAGES = ["image/png", "image/jpeg", "image/webp"].map(ContentType.make);

export const AppFiles = Files.make({
	defaultVariantWidths: [320, 640, 1280],
	kinds: {
		userAvatar: {
			prefix: "user-avatar/",
			visibility: "public",
			upload: { contentTypes: IMAGES, maxBytes: 10 * 1024 * 1024 },
			variantWidths: [64, 128, 256],
		},
		businessProof: {
			prefix: "business-proof/",
			visibility: "private",
			upload: { contentTypes: [ContentType.make("application/pdf")], maxBytes: 20 * 1024 * 1024 },
		},
		invoice: { prefix: "invoice/", visibility: "private" },
	},
});
```

- A key is the kind's prefix followed by segments the kind's domain gives meaning to: `AppFiles.key("invoice", orderId, "F-001.pdf")`. `AppFiles.parse(key)` reads them back.
- `visibility: "public"` files may be served to anyone holding the key (`AppFiles.isPublic(key)`). A key matching no kind is private.
- Only a kind with an `upload` rule takes `requestUpload` or `validateUpload`; the others fail to compile.
- `variantWidths` are the widths an image of the kind is also stored at (`imageVariantKey`). `withDeclaredVariantWidths` drops the others from a preview the browser sent.

## Use it in the domain's use cases

```ts
// A `FileUpload`: the browser PUTs the file to `uploadUrl`; the domain then stores a `FileRef` with the key.
const { key, uploadUrl, expiresAt } = yield* AppFiles.requestUpload("businessProof", {
	scope: profileId,
	contentType,
	contentLength,
});

yield* (yield* FileStorage).put({ key, bytes, contentType: ContentType.make("application/pdf") });
const bytes = yield* readFile(key); // fails with FileNotFoundError
const link = yield* (yield* FileDownloads).link(key); // a `FileLink`: { url, expiresAt }
```

## Serve the downloads

A download link points at the application's own route, with a token that grants reading that one key until it expires, so the bucket never appears in a URL the browser sees:

```ts
const FileLayers = Layer.mergeAll(
	bunS3FileStorage({ endpoint, bucket, credentials }),
	secureFileDownloads({ baseUrl: `${apiUrl}/secure-files` }),
).pipe(Layer.provideMerge(hmacFileTokens(secret)));

HttpRouter.add("GET", "/secure-files/*", Effect.gen(function* () {
	const request = yield* HttpServerRequest.HttpServerRequest;
	return yield* serveSecureFile(new URL(request.url, apiUrl), { path: "/secure-files" });
}));
```

Every failure answers the same 404. The answer is cached by that browser only, for the link's lifetime.

`FileLinkLifetime` sets how long upload and download links last (15 minutes each by default).

## Content types

A `ContentType` is `type/subtype`, lowercase, without parameters. `ContentType.make` only takes that form; decoding (a stored `FileRef`, a request body) also takes a raw header such as `Text/CSV; charset=utf-8` and keeps `text/csv`, so refs written before the brand still decode. A header from outside (a browser, an inbound email) becomes one through `normalizeContentType` (an `Option`) or `normalizeContentTypeOrOctetStream`; `requestUpload` and `validateUpload` take the raw header and normalize it themselves.

## Errors

| Error | When |
| --- | --- |
| `FileUploadRejectedError` | `reason`: `unsupportedContentType`, `empty`, `tooLarge` |
| `FileNotFoundError` | `readFile` of a key with no file |
| `InvalidFileTokenError` | a token forged, expired or minted for another key |

A storage failure is a defect.

## Adapters

- **`/file/bun`:** `bunS3FileStorage` on Bun's built-in S3 client (any S3-compatible store), and `hmacFileTokens`. Its tests run against the store at `S3_ENDPOINT`.
- **`/file/http-server`:** `serveSecureFile`.
- **`/file/memory`:** `inMemoryFiles()` provides storage, tokens, download links and an id generator for the calling domain's tests; `inMemoryFileStorage()` and `inMemoryFileTokens()` alone.

On the client, `createMintedUrlCache()` keeps the links the application's endpoints minted until they near expiry.
