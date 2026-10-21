# Plan: extract tries' `platform/file` into `@voila.dev/platform/file`

## Context

`file` is the next leaf brick. Its only tries dependencies are identity (Actor, Gate, UseCase, UserId), `platform/id` and `platform/core`, and about 12 domains depend on it. `bulk-import` (0.4.1, tries#2452/#2453) is the model to follow:
- The brick is a schema-bound library that domains call.
- Context lives in the caller's tables.
- Adapters ship as subpaths.

Facts from reading the code (tries `origin/main`; local `main` is 17 commits behind and must be pulled first):
- The folder has **34 files and 1,422 lines**: 26 production files, 6 tests and 2 extra test helpers.
- The storage service is called **`StorageService`**, not `FileStorageService`. Keys come from **`FileKeyPrefix`**, an object of 25 hardcoded prefixes in `value-objects/file-keys.ts`. There is no `FileKeys` object.
- **There is no files table.** Every domain stores a `FileRef`/`ImageRef` in its own table: inside the aggregate's `data` jsonb, as typed jsonb (`user.image`, `organization.logo`, `story_media.file`), or as flattened columns (`provider_verification.background_doc_*`, `whatsapp_conversation_message.attachment_*`).
- Production storage is **`Bun.S3Client`** (no `@aws-sdk` anywhere). Video is **Cloudflare Stream over plain fetch**. Files tokens are **HMAC over Web Crypto**. No server SDK lands in a web bundle today: front ends import only value objects plus `image-variants` and `minted-url-cache`.
- These exports are never used outside the folder: `PUBLIC_FILE_KEY_PREFIXES`, `fileKeyOwnerId`, `mimeFromExtension`, and the interfaces `FileUploadTicket`/`FileDownloadTicket`/`FileStat`/`VideoDirectUpload`/`VideoPlaybackToken`.
- `canReadFileKey` is used only by the two download-URL use cases.

## 1. Inventory of `platform/file`

| File | Fate | Reason |
|---|---|---|
| errors/invalid-upload-error | **generalised** → `FileUploadRejectedError { reason: "unsupportedContentType" \| "tooLarge" \| "empty" }` | Typed reason, like `ImportFileRejectedError`. `platform/image` keeps its own error for normalisation failures. |
| errors/invalid-files-token-error | **stays in tries** | Tokens are tries-specific (principle 4). |
| errors/video-stream-error | **stays in tries** (`platform/video`) | Video is out of this brick (Q1). |
| lib/extension-from-content-type | **brick** (`extensionFromContentType`) | Generic, 5 prod uses. |
| lib/image-variants | **brick** (`narrowestVariantKeyCovering`) | Generic; used by app, mobile and the api. |
| lib/minted-url-cache | **brick** (`createMintedUrlCache`) | Pure client code with no dependencies, used by app and mobile; it avoids creating a new shared tries package. |
| lib/request-upload-ticket | **generalised** → `files.requestUpload(kind, …)` | Prefix, content types and max size come from the declared kind. |
| policies/validate-upload | **generalised** → `files.validateUpload(kind, …)` | Limits come from the kind. Its tests move to the brick. |
| policies/owns-file-key, read-file, rewrite-file | **stay in tries** (`platform/file-access`) | Role-based access rules (principle 4). They use `files.parse(key)` to find the owner segment. |
| services/file-storage-service | **generalised** → `FileStorage` port | Drop `consumeUploadAuthorization` (it only exists for the local-disk dev proxy). Merge `getDownloadBytes`/`readBytes` into `read` plus the `readFile` helper. |
| services/file-storage-service.test-helper | **replaced** by `/file/memory` `inMemoryFileStorage()` | Used by 70 test files. |
| services/files-token-service (+ test-helper) | **brick** (`FileTokens`, `hmacFileTokens`) | Decision 2 (section 8). |
| services/video-stream-service (+ test-helper) | **stays in tries** (`platform/video`) | Q1. |
| use-cases/complete-file-upload | **stays in tries** (`file-access`) | Only for the local dev upload proxy. |
| use-cases/get-file-download-url(s) | **stay in tries** (`file-access`) | User-facing endpoints with tries' gate (principle 1). |
| use-cases/get-secure-file-bytes → brick `serveSecureFile`; read-file-bytes | **stays in tries** (`file-access`) | Token route and system read used by tries routes. |
| use-cases/index | **stays in tries** | Feeds `use-case-registry.ts`. |
| value-objects/file-keys | **split**: the mechanism goes to the brick (`Files.make({ kinds })`); the 25 prefixes, public list and widths become tries' kinds declaration | The prefixes are tries config. `PUBLIC_FILE_KEY_PREFIXES` and `fileKeyOwnerId` **disappear** (dead outside the folder; replaced by the kind's `visibility` and `files.parse`). |
| value-objects/file-ref, image-ref, image-preview | **brick** (`FileRef`, `ImageRef`, `ImagePreview`, `imageVariantKey`) | Generic and persisted by callers. `withDeclaredVariantWidths` becomes `files.withDeclaredVariantWidths`. |
| value-objects/video-stream-state | **stays in tries** (`platform/video`) | Q1. |
| value-objects/extension-to-mime | **brick** (`contentTypeOfKey`) | `mimeFromExtension` is no longer exported (dead). It also replaces the duplicate map in `local-storage-service.ts`. |
| tests (`file-keys`, `image-variants`, `minted-url-cache`, the 2 use cases) | move to wherever their subject goes | |

`platform/core/lib/normalize-content-type` (one line) is copied into the brick's `lib/`. The constants `upload-constraints.ts` and `file-download.ts` stay in tries `configuration/` and are used by the kinds declaration.

## 2. Consumers

Changes common to every consumer:
- Imports move from `#platform/file/…` / `@tries.care/domain/platform/file/…` to `@voila.dev/platform/file`.
- Keys are built with `TriesFiles.key(kind, …segments)` instead of string concatenation with `FileKeyPrefix.x`.
- `StorageService` becomes `FileStorage`.
- `fakeStorageService()` becomes `inMemoryFileStorage()`.

| Domain | Uses today | What changes |
|---|---|---|
| email | `putBytes` (hand-built keys `email-attachments/…`, `inbound-attachments/…`), `getDownloadBytes`. Refs in `email_log`/`inbound_email.attachments` jsonb. | Two new **private kinds** for those prefixes (they are missing from `FileKeyPrefix` today). `getDownloadBytes` becomes `readFile`. |
| signature | `FileRef`/`ImageRef` in `signature_request.data`; `putBytes`, `getDownloadBytes`, `getDownloadUrl` | Key `TriesFiles.key("signatureRequest", id, "signed.pdf")`. |
| documents | `statObject`, `putBytes`, `getDownloadUrl` (`documentOwnerGate` stays) | `stat`, `put`, `downloadUrl`. |
| image | `putBytes`/`statObject`/`getDownloadBytes`/`delete`, `imageVariantKey`, `imageVariantWidthsForKey`, `InvalidUploadError`, `canRewriteFileKey` | Widths come from `TriesFiles.variantWidths(key)`. Its own error replaces `InvalidUploadError`. The gate uses `file-access`. This domain is the next brick. |
| content, email-marketing | `requestUploadTicket` (`contentImage`, `marketingImage`) | `TriesFiles.requestUpload("contentImage", …)`. |
| messaging (core, support, whatsapp) | `requestUploadTicket`, `validateUpload`, `statObject`, `delete` + variants, `getDownloadUrl`, `readBytes`/`putBytes`, `extensionFromContentType`, `VideoStreamService`, `VideoStreamState`. `whatsapp_conversation_message.attachment_*` columns. | File parts move to the brick. Video parts move to tries `platform/video`. Columns are unchanged. |
| invoicing | `FileRef` in `invoice.data`, `putBytes`, `getDownloadUrl`; `invoice` prefix | Mechanical. |
| automation | `automationRun`/`automationFile` prefixes, `putBytes`, `getDownloadBytes`, `delete`, `getDownloadUrl`, `FileRef` in `automation_run.steps` | Mechanical. |
| phone | `phoneRecording` prefix, `putBytes`, `readBytes`, `FileRef` in `phone_call.data` | Mechanical. |
| identity | `ImageRef` (`user.image`), `requestUploadTicket(userAvatar)`, `withDeclaredVariantWidths` | `TriesFiles.requestUpload` and `TriesFiles.withDeclaredVariantWidths`. |
| integrations | `FileRef` type | Import only. |
| organization, practitioner, shop, financials, staffing, tries/story, blog, performer | Prefixes, `requestUploadTicket`, `validateUpload`, `putBytes`, `extensionFromContentType`, `ImageRef`/`FileRef`; `ownsFileKey` (practitioner); `VideoStreamService` (story) | Mechanical. `ownsFileKey` comes from `file-access`. Story video goes to `platform/video`. |
| architecture | Storage adapters (s3, local, mirrored, wrangler), HMAC tokens, Cloudflare Stream, 25 repositories mapping refs | s3 is replaced by `bunS3FileStorage`. local, mirrored, fallback and wrangler implement or decorate the `FileStorage` port. Repositories change imports only. |
| application / api / app / mobile / ui-shop / tries.care | Files RPC, `http-errors/platform.ts`, routes `/files`, `/secure-files`, `image-at-width`, `shop-images`, `static-files`, og-card; front ends use value objects, variants and the minted cache | Imports change. The ui-shop allow-list is updated (`@voila.dev/platform/file` plus the kinds declaration). |

## 3. Public API (`@voila.dev/platform/file`)

```ts
// value-objects
export const FileKey = Schema.NonEmptyString.pipe(Schema.brand("FileKey")); // Q3
export class FileRef extends Schema.Class<FileRef>("FileRef")({ key: FileKey, contentType: Schema.String, sizeBytes: Schema.Int, originalFilename: Schema.optional(Schema.String) }) {}
export class ImagePreview extends Schema.Class<ImagePreview>("ImagePreview")({ width, height, placeholder, variantWidths: Schema.Array(Schema.Int) }) {}
export class ImageRef extends Schema.Class<ImageRef>("ImageRef")({ ...FileRef.fields, preview: Schema.optional(ImagePreview) }) {}
export function imageVariantKey(key: FileKey, width: number): FileKey;
export function narrowestVariantKeyCovering(ref: ImageRef, targetPx: number): FileKey;
export function contentTypeOfKey(key: string): string;
export function extensionFromContentType(contentType: string): string;
export function createMintedUrlCache(): MintedUrlCache; // + KeyedMintedTicket

// errors
export class FileUploadRejectedError extends Schema.TaggedError<…>()("FileUploadRejectedError", { reason: FileUploadRejection }) {}
export class FileNotFoundError extends Schema.TaggedError<…>()("FileNotFoundError", { key: FileKey }) {}

// services
export interface FileLink { readonly url: string; readonly expiresAt: Date }
export interface FileStat { readonly contentType: string; readonly sizeBytes: number }
export class FileStorage extends Context.Service<FileStorage, {
  readonly uploadUrl: (input: { key: FileKey; contentType: string; contentLength: number }) => Effect.Effect<FileLink>;
  readonly downloadUrl: (key: FileKey) => Effect.Effect<FileLink>;
  readonly put: (input: { key: FileKey; bytes: Uint8Array; contentType: string }) => Effect.Effect<void>;
  readonly read: (key: FileKey) => Effect.Effect<Option.Option<Uint8Array>>;
  readonly stat: (key: FileKey) => Effect.Effect<Option.Option<FileStat>>;
  readonly delete: (key: FileKey) => Effect.Effect<void>;
}>()("@voila.dev/platform/FileStorage") {}
// Storage failures stay defects, as they are in tries today.
export const FileLinkLifetime = Context.Reference<{ uploadSeconds: number; downloadSeconds: number }>(
  "@voila.dev/platform/FileLinkLifetime", { defaultValue: () => ({ uploadSeconds: 900, downloadSeconds: 900 }) });
export function readFile(key: FileKey): Effect.Effect<Uint8Array, FileNotFoundError, FileStorage>;

// lib/files.ts — bound to the app's kinds
export interface FileKind {
  readonly prefix: `${string}/`;
  readonly visibility: "public" | "private";
  readonly upload?: { readonly contentTypes: ReadonlyArray<string>; readonly maxBytes: number };
  readonly variantWidths?: ReadonlyArray<number>;
}
export const Files = { make: <const Kinds extends Record<string, FileKind>>(config: { kinds: Kinds; defaultVariantWidths?: ReadonlyArray<number> }) => … };
// returns:
//   kinds
//   key(kind, ...segments): FileKey
//   parse(key): Option<{ kind: keyof Kinds; segments: string[] }>
//   isPublic(key): boolean            // default-deny
//   variantWidths(key): ReadonlyArray<number>
//   withDeclaredVariantWidths(ref: ImageRef): ImageRef
//   validateUpload(kind: UploadableKind<Kinds>, { contentType, contentLength }): Effect<void, FileUploadRejectedError>
//   requestUpload(kind: UploadableKind<Kinds>, { scope?, contentType, contentLength }):
//     Effect<{ key: FileKey } & FileLink, FileUploadRejectedError, FileStorage | IdGenerator>
// `UploadableKind` only accepts kinds that declare `upload`, so the caller can't
// request an upload for e.g. "invoice".
```

Adapters:
- **`/file/memory`**: `inMemoryFileStorage()` returns `{ files: Map, seed, layer }`. It records the real `contentType` passed to `put` (the old fake always reported `image/webp`).
- **`/file/bun`**: `bunS3FileStorage(options)` returns `Layer<FileStorage>`. It is built on `Bun.S3Client`, which is built into Bun, so no peer dependency is added.
  - Options: `{ bucket, endpoint?, region?, credentials: Effect<S3Credentials>, downloadUrl?: (key, expiresAt) => Effect<string> }`. If `downloadUrl` is omitted, downloads use a presigned GET.
  - Retries use an Effect `Schedule`; calls are traced with `Effect.withSpan`.
- There is **no** drizzle adapter (no table) and **no** http-server adapter (the routes stay in tries).

Example in the caller's code. Context lives in the caller: documents/practitioner keep the key in their own aggregate.
```ts
// tries packages/domain/src/configuration/files.ts
export const TriesFiles = Files.make({ defaultVariantWidths: [320, 640, 1280], kinds: {
  userAvatar: { prefix: "user-avatar/", visibility: "public", upload: { contentTypes: IMAGE_CONTENT_TYPES, maxBytes: MAX_IMAGE_UPLOAD_BYTES }, variantWidths: [64, 128, 256] },
  businessProof: { prefix: "business-proof/", visibility: "private", upload: { contentTypes: BUSINESS_PROOF_CONTENT_TYPES, maxBytes: MAX_DOCUMENT_UPLOAD_BYTES } },
  invoice: { prefix: "invoice/", visibility: "private" },
  // … the 25 prefixes + email-attachments + inbound-attachments
}});

// practitioner/verification/use-cases/request-business-proof-upload-use-case.ts
export const RequestBusinessProofUploadUseCase = UseCase.make({
  name: "practitioner.request-business-proof-upload",
  input: Schema.Struct({ actor: Actor, payload: Schema.Struct({ profileId, contentType: Schema.String, contentLength: Schema.Number }) }),
  gate: Gate.self({ staff: "provider.verify" }),
  execute: ({ payload }) => TriesFiles.requestUpload("businessProof", { scope: payload.profileId, ...payload }),
});
// the confirm use case stores `new FileRef({...})` in provider_verification (its own table)
```

## 4. Persistence

- The brick is **stateless**: no table, no migration shipped.
- Every ref stays in its owner's tables (listed above).
- `FileKey` is a brand over a string. The encoded form doesn't change, so existing jsonb decodes as before, and the read check is just "non-empty".
- **No migration in tries**, so no expand/contract and no `migration:destructive-approved` label.
- The only "contract" is on the API: if a front end matches on the `_tag` `InvalidUploadError`, the tries HTTP layer maps `FileUploadRejectedError` back to the old tag for one release. To check: grep `apps/` before T3.

## 5. Infra and runtime in tries

`voila-platform-layers.ts` gains `PlatformFileStorage`, selected in `runtime/src/layers/adapters.ts`:
- **deployed**: `bunS3FileStorage({ bucket: STORAGE_BUCKET, endpoint, credentials: ecsOrStaticCredentials, downloadUrl: secureFilesUrl })`. `secureFilesUrl` builds `${API_URL}/secure-files/<key>?token=` with `FilesTokenService` (in tries). It is then decorated by tries' **`mirroredFileStorage`** (async copy) and **`fallbackFileStorage`** (read-through on public keys, FILE-02); both are rewritten as decorators over the port.
- **local**: tries' `LocalDiskFileStorage` implements `FileStorage`. Its upload authorization stays internal to it and is exposed to the dev route through a small tries service.
- **scripts**: `WranglerFileStorage` / `DryRun` implement the port.
- **video**: no change (moves to `platform/video`).
- **Signed-URL cache**: client side only (`createMintedUrlCache`). Nothing server side.

Bundling:
- `/file` imports only `effect` and the core (IdGenerator); adapters are excluded by the structure test, and `sideEffects: false` lets the bundler drop unused code. Check with `vite build` that the app's boot budget (400 KB gzip) still holds.
- **Risk:** this is the first time **mobile** (Metro) resolves `@voila.dev/platform`: `exports`, then `imports #*` in `dist`. Verify in T2 with an Expo export build.
- `bun build --compile`: `Bun.S3Client` is built in, Stream uses fetch, the brick has no dynamic import. Nothing to patch. The existing api/worker compile tests are enough.

## 6. PRs

**platform**
1. **P1 `feat(file): file brick`**
   - Adds `src/file/{value-objects,errors,services,lib}`, `adapters/{memory,bun}`, `src/file/README.md`.
   - Adds exports `./file`, `./file/bun`, `./file/memory` (plus `publishConfig`), a README modules row, and a `file → core` entry in `MODULE_DEPENDENCIES`.
   - Includes a minor changeset.
   - *Done when* `bun run ci` is green and the S3 integration test passes on MinIO in CI.
2. **P2 version packages** (opened by the bot), then the release.
   - *Done when* 0.5.0 is on npm with provenance.

**tries** (pull `main` first)
1. **T1 `chore: bump @voila.dev/platform to 0.5.0 + file storage layers`**
   - Adds `configuration/files.ts` (`TriesFiles`).
   - Adds `PlatformFileStorage` plus the decorators (mirror, fallback, local, wrangler) over `FileStorage`.
   - During the transition, tries' `StorageService` is a shim over `FileStorage`, so no consumer changes.
   - *Done when* it is deployed to prod and uploads, downloads, secure-files and mirroring are checked.
2. **T2 value objects** (mechanical codemod)
   - `FileRef`/`ImageRef`/`ImagePreview`/`FileKey`/variants/minted cache/`contentTypeOfKey` now come from the brick, across domain, architecture, application, api, app, mobile, ui-shop and tries.care.
   - *Done when* CI is green, `vite build` stays within budget, and the mobile export builds.
3. **T3 platform consumers**
   - Covers email, signature, documents, image, content, email-marketing, messaging, invoicing, automation, phone, identity, integrations.
   - Moves to `FileStorage`, `TriesFiles.*`, `inMemoryFileStorage`.
   - Creates `platform/video` (port, state, error, fake) and `platform/file-access` (policies, tokens, the 5 use cases, registry).
   - *Done when* it is green and deployed.
4. **T4 business consumers**
   - Covers organization, practitioner, shop, financials, staffing, story, blog, performer.
   - *Done when* it is green and deployed.
5. **T5 delete `platform/file`**
   - Removes the folder, the shim, the `platform/file` entries in `packages/domain/package.json`, and `FileKeyPrefix`.
   - *Done when* grep `platform/file/` returns nothing and it is deployed.
6. No contract migration (no DB change). If T3 kept the `InvalidUploadError` tag at the HTTP layer, **T6** removes that mapping once front ends have redeployed.

## 7. Tests

**Brick**
- Ported from tries: `file-keys.test`, `image-variants.test`, `minted-url-cache.test`.
- New: `files.test` covering key/parse/isPublic/variantWidths/`withDeclaredVariantWidths`/validateUpload (normalised content type, bounds 0 < n ≤ max, finite)/requestUpload, plus type tests that a kind without `upload` is refused.
- One `fileStorageContract(layer)` suite, run against `inMemoryFileStorage` and against `bunS3FileStorage`. The S3 run is `describe.skipIf(process.env.S3_ENDPOINT === undefined)`, with a `minio` service added to `ci.yml`.

**tries keeps**
- `hmac-files-token`, `crypto-wire-format`, `mirrored`/`fallback`/`local` storage, `cloudflare-stream`, `fake-video-stream`.
- `files-route`, `secure-files-route`, `image-at-width`, `static-files-route`, og-card.
- The `file-access` use case tests and the compile tests.
- The 70 consumer tests switch to `inMemoryFileStorage()`. Tests that relied on `statObject` → `image/webp` seed the content type instead.

## 8. Decisions (taken 2026-10-21)

1. **Video stays in tries** (`platform/video`).
2. **Signed download links move into the brick**, which supersedes sections 1, 3 and 5 on that point:
   - `FileTokens` port (`mint`, `verify` → `InvalidFileTokenError`), with `hmacFileTokens(secret)` in `/file/bun`, wire-compatible with tries' `f.<expiry>.<mac>` tokens. The rule refusing the development secret outside local runs stays in tries.
   - `FileDownloads` port (`link(key)`), implemented by `secureFileDownloads({ baseUrl })` from `/file`. `FileStorage` loses `downloadUrl`: it only stores bytes and hands upload links.
   - `serveSecureFile(url, { path })` in `/file/http-server` replaces tries' `/secure-files` handler, `GetSecureFileBytesUseCase`, `FilesTokenService` and the HMAC service.
   - `bunS3FileStorage` takes `{ endpoint, bucket, credentials: () => Promise<S3Credentials> }`, without a `downloadUrl` option.
3. **`FileKey` is branded.**
4. **The tries remainder is `platform/file-access`**: owner and public read policies, the download-URL use cases, the local upload completion and the system read.
5. `platform/image` comes next, as its own step.
6. **Value objects, not interfaces**, which supersedes section 3 on these types:
   - `ContentType` is branded (`type/subtype`, lowercase, no parameters) and types `FileRef.contentType`, `FileStat`, `FileStorage.put`/`uploadUrl` and the kinds' `upload.contentTypes`. Raw headers go through `normalizeContentType` (`Option`) or `normalizeContentTypeOrOctetStream`.
   - `FileLink`, `FileStat`, `FileUpload` (what `requestUpload` returns) and `FileLinkLifetimes` (`upload`/`download` as `Duration`) are `Schema.Class`es, so tries' RPC answers reuse them.
   - `FileRef.sizeBytes` is a non-negative integer.
   - **Before T2**, list the distinct `contentType`s stored in tries' refs (jsonb and the flattened `*_content_type` columns): a value that is not `type/subtype` in lowercase would no longer decode, and needs a data migration normalising it first.

The S3 contract test runs in CI against RustFS: MinIO no longer publishes images.

## Verification

- **platform:** `bun run ci` (biome, tsc, tests, build); the structure test stays green; the MinIO run of the S3 contract test is in CI; `npm pack --dry-run` lists `dist/file/**`.
- **tries:**
  - `bun run ci` / turbo test.
  - `vite build` of the app, checking the boot budget.
  - Expo export of mobile.
  - api and worker `bun build --compile` smoke tests.
  - In prod after T1: upload an avatar, download a private PDF via `/secure-files`, check the object is in the mirror bucket, and check that a story video still plays.
