# @voila.dev/platform

The technical bricks of a B2B platform on Effect, in one package with one subpath per module.

```ts
import { UserId } from "@voila.dev/platform"; // the core
import { TrackedLink } from "@voila.dev/platform/link-tracking/link";
import { drizzleTrackedLinkRepository } from "@voila.dev/platform/link-tracking/link/drizzle";
```

## Layout

The core sits at the root. Everything else is a **module**: a brick, or a subdomain nested inside one. Every module has the same shape, at any depth:

```
src/
  index.ts                     @voila.dev/platform: the core, re-exporting src/core
  core/                        what every module builds on, and nothing else
    adapters/<name>/index.ts   /<name>: the core's own adapters (memory, drizzle, bun, http-server)
  <module>/
    index.ts                   /<module>: its domain, ports and use cases
    aggregates/ entities/ value-objects/ services/ use-cases/
    errors/ events/ payloads/ constants/ lib/
    http/index.ts              /<module>/http: its HttpApi contract
    adapters/<name>/index.ts   /<module>/<name>: one implementation of its ports
    <submodule>/               any other folder: a module with the same shape
```

## Modules

| Module | Exports |
|---|---|
| core | `.` (ids and shared value objects, `Actor`, `Gate`, `UseCase`, `IdGenerator`, `SecureRandom`, `CurrentActor`, `DatabaseError`), `/memory`, `/drizzle`, `/bun`, `/http-server` |
| cache | `/cache` (`KeyValueCache`, `CacheMissError`, `CacheTransportError`, `readCachedValue`, `writeCachedValue`, `readSingleUseCacheEntry`), `/cache/memory` (`inMemoryKeyValueCache`), `/cache/redis` (`redisKeyValueCache`, on the application's `Redis`) |
| rate-limiting | `/rate-limiting` (`RateLimiter`, `RateLimitedError`), `/rate-limiting/memory` (`inMemoryRateLimiter`, `stubRateLimiter`), `/rate-limiting/redis` (`redisRateLimiter`, on the application's `Redis`) |
| search | `/search` (`Pagination`, `PagedResult`, filters, `makeSearchUseCase`, `SearchBudget`), `/search/memory`, `/search/drizzle` (`pagedQuery`, accent-insensitive search, `searchFunctionsSql`) |
| locale | `/locale` (`Locale`, `Language`, `SupportedLocales`) |
| location | `/location` (`Address`, `LocatedAddress`, `Coordinates`, `CountryCode`, `LocationProvider`, `routedLocationProvider`, `AddressFormatter`, `SupportedCountries`, `locateAddress`, `resolveAddressCoordinates`, `distanceKm`, `countryName`), `/location/memory` (`inMemoryLocationProvider`, `stubLocationProvider`), `/location/ban` (`banLocationProvider`, France), `/location/here` (`hereLocationProvider`, every country) |
| search-engine | `/search-engine` (`SearchEngine`, `SearchEngineQuery`, `SearchEngineResult`, `SearchEngineError`), `/search-engine/memory` (`inMemorySearchEngine`, `stubSearchEngine`), `/search-engine/dataforseo` (`dataForSeoSearchEngine`) |
| readonly-database | `/readonly-database` (`ReadonlyDatabase`, `ReadonlyQueryResult`, `ColumnDescription`, `JsonRow`, `guardQuery`, `QueryPolicy`, `maskRows`, `QueryRejectedError`, `ReadonlyQueryError`), `/readonly-database/memory` (`stubReadonlyDatabase`, `unavailableReadonlyDatabase`), `/readonly-database/pg` (`pgReadonlyDatabase`, on pg) |
| bulk-import | `/bulk-import` (`BulkImport`, `ImportSchema`, `ImportIntent`, `ImportLimits`), `/csv` (`csvImportReader`), `/json` (`jsonImportReader`), `/memory` (`inMemoryBulkImport`), `/drizzle` (`importIntentTable`), `/xlsx` (`xlsxImportReader`, on exceljs) |
| money | `/money` (`Money`, `Currency`, `currencyDecimals`, `formatMoney`, `parseMoneyInput`, `BasisPoints`, `TaxRate`) |
| screenshot | `/screenshot` (`Screenshots`, `ScreenshotRequest`, `Screenshot`, `ScreenshotError`), `/screenshot/memory` (`stubScreenshots`), `/screenshot/bun` (`bunWebViewScreenshots`, on `Bun.WebView`: WebKit on macOS, Chromium elsewhere) |
| spreadsheet | `/spreadsheet` (`SpreadsheetDocument`, `SpreadsheetSheet`, `SpreadsheetImage`, `cell`, `mergedCell`, `cellStyle`, `serializeCsv`, `SpreadsheetRenderer`), `/spreadsheet/memory` (`stubSpreadsheetRenderer`), `/spreadsheet/xlsx` (`xlsxSpreadsheetRenderer`, on exceljs) |
| file | `/file` (`Files`, `FileStorage`, `FileDownloads`, `FileTokens`, `FileRef`, `ImageRef`, `FileLinkLifetime`), `/file/memory` (`inMemoryFiles`), `/file/bun` (`bunS3FileStorage`, `hmacFileTokens`), `/file/http-server` (`serveSecureFile`) |
| link-tracking/link | `/link-tracking/link`, `/http` (`TrackedLinksApiGroup`), `/memory`, `/drizzle` (tables, repository, `trackedLinkSearchIndexesSql`), `/http-server` (`trackedLinksHandlers`) |
| link-tracking/click | `/link-tracking/click`, `/memory`, `/drizzle`, `/http-server` (`redirectToLink`) |

For example:

```
src/link-tracking/
  index.ts                     /link-tracking (re-exports link and click)
  link/                        /link-tracking/link
    http/                      /link-tracking/link/http
    adapters/memory/           /link-tracking/link/memory
    adapters/drizzle/          /link-tracking/link/drizzle
    adapters/http-server/      /link-tracking/link/http-server
  click/                       /link-tracking/click
    adapters/memory/           /link-tracking/click/memory
    adapters/drizzle/          /link-tracking/click/drizzle
src/email/
  adapters/resend/             /email/resend
  adapters/ses/                /email/ses
```

## Rules

`test/structure.test.ts` checks these rules on every run:

- **Files import each other through `#`** (`#link-tracking/link/aggregates/tracked-link`), never through a relative path. The `#` imports carry no extension, so the same import reads `src/*.ts` in the repository and `dist/*.js` once published.
- **The core imports no module.**
- **A module's domain and contract** may end up in a browser bundle. They never import an adapter, `node:*`, `bun`, or an adapter library.
- **An adapter** imports the domain of its own module and the core, and the domain of a module its module depends on. It imports only adapters of its own name: the core's, and those of the modules its module depends on (`link/drizzle` → `search/drizzle` → `core/drizzle`).
- **A dependency between two modules is declared** in `MODULE_DEPENDENCIES`. A module re-exporting its own submodules is the only exception. A declared dependency that no import uses any more is reported.
- **Every package the code imports is a peer dependency.** A library that only some adapter needs (drizzle-orm, resend…) is optional in `peerDependenciesMeta`.
- **`exports` lists exactly the entry points the folders define**, each with its source and the matching built files. No two entry points may claim the same subpath, such as an adapter named like a submodule.

Two rules hold between modules:

- **No foreign key between two modules.** A module refers to another module's aggregate by its typed id (`UserId`, `TrackedLinkId`): the column gets an index, but no `references()`. Consistency comes from events (`UserDeleted` → each module cleans up) and from archiving instead of deleting. Inside a module, foreign keys are fine.
- **Shared id types live in the core; tables do not.** `UserId` and `OrganizationId` are branded types in `@voila.dev/platform`, as are the value objects many modules pass around (`EmailAddress`, `Phone`). Only the identity module knows its tables.

## HTTP

A module's `http` contract carries no authentication. The application adds its own middleware to the group, which provides `CurrentActor`, and hands the module's handlers to `HttpApiBuilder.group`:

```ts
const Api = HttpApi.make("app").add(TrackedLinksApiGroup.middleware(Authentication));

const TrackedLinksLive = HttpApiBuilder.group(Api, "trackedLinks", (handlers) =>
	handlers
		.handle("search", trackedLinksHandlers.search)
		.handle("create", trackedLinksHandlers.create)
		.handle("update", trackedLinksHandlers.update)
		.handle("archive", trackedLinksHandlers.archive),
);
```

A gate's refusal answers 403. A `DatabaseError` becomes a defect, so a 500.

## Search budget

Every search spends a budget per caller and per surface: 60 a minute per caller, 600 for everyone. `SearchBudget` is a reference with these defaults; the application provides its own limits:

```ts
Layer.succeed(SearchBudget, { windowSeconds: 60, perCaller: 120, global: 1200 });
```

## Bulk import

A file becomes an import intent reviewed before anything is written: it is read into a table, each cell decoded by its column's schema (required, unique), and the problems shown cell by cell until fixed. The valid rows are then imported batch by batch, decoded into typed records.

No user calls bulk import directly: they import contacts, products… The domain that imports declares its schema, gates its own use cases and endpoints, and keeps the intent's id in its own table next to what the request was for (a segment, a source, who asked and when).

```ts
const ContactImportSchema = ImportSchema.make({
	target: "contacts",
	columns: {
		name: { schema: Schema.String, label: "Nom" },
		// What the schema encodes back is the cell kept: here, lowercased.
		email: { schema: EmailAddress, label: "E-mail", unique: true, message: "Une adresse e-mail" },
		phone: { schema: Schema.String, aliases: ["tél"] },
	},
	// Rows whose cells are all valid, checked across their columns.
	check: (record) =>
		record.email === undefined && record.phone === undefined
			? [{ column: "phone", issue: "required", message: "Un e-mail ou un téléphone" }]
			: [],
});

// The formats it accepts; `limits` overrides the `ImportLimits` reference for this import only.
const ContactBulkImport = BulkImport.make(ContactImportSchema, {
	limits: { maxRows: 5_000 },
	readers: [csvImportReader, xlsxImportReader],
});

// In the contacts domain's use cases:
const intent = yield* ContactBulkImport.create({ fileName, content });
yield* contactsImports.insert({ importIntentId: intent.id, segmentId, source, fileName });
yield* ContactBulkImport.editCell(intent.id, { rowIndex, column: "email", value });
// One result per entry, in order. `record` is `{ email?: EmailAddress; name?: string; phone?: string }`,
// `index` is the row's, stable across retries: write by it or by a natural key.
yield* ContactBulkImport.importNextBatch(intent.id, (batch) => upsertContacts(segmentId, batch));
// Or every batch at once, in a background job.
yield* ContactBulkImport.importAll(intent.id, (batch) => upsertContacts(segmentId, batch));
ImportIntent.summary(intent); // { rows, invalid, created, updated, rejected, remaining }

// For its endpoints:
ContactBulkImport.Intent; // response
Schema.Struct({ ...ContactBulkImport.CreatePayload.fields, segmentId: SegmentId }); // upload
ContactBulkImport.EditCellPayload; // { rowIndex, column: "name" | "email" | "phone", value }
ContactBulkImport.template(); // a CSV of the labels, to download and fill

// In its tests:
const { layer } = inMemoryBulkImport();
```

An intent is versioned and a batch leased to the import that took it, so concurrent changes fail with `ImportIntentConflictError` instead of overwriting or importing a row twice. A lease outlives a crashed import by `ImportLimits.batchLeaseMillis` (5 minutes by default); the next import then takes the batch again.

`ImportSchema.make` types a schema kept apart from its `BulkImport`, to share it without the readers. Passed inline to another generic call, TypeScript widens what its `check` returns: keep it in a constant, or write it in `BulkImport.make` itself.

```

## Database

The Drizzle adapters export their tables for the application's schema. Search needs SQL that Drizzle cannot declare: run `searchFunctionsSql` once, then each module's search indexes (`trackedLinkSearchIndexesSql`), in migrations of their own.

The package is `sideEffects: false`: no module may run anything when it is loaded.

## Workflow

`*.integration.test.ts` files need a real service and skip without it: `REDIS_URL=redis://localhost:6379 bun run test` runs the Redis ones, and `S3_ENDPOINT` (with `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` and a `platform-test` bucket) the S3 ones.


```sh
bun install
bun run ci   # biome, tsc, tests, build
```

## Publishing

Every pull request that changes what the package ships adds a changeset: `bun changeset`, pick the bump and describe the change for the changelog (`bun changeset --empty` when it ships nothing). The CI refuses a pull request without one.

Merging to `main` opens or updates the "chore: version packages" pull request, which bumps the version and writes `CHANGELOG.md`. Merging that one publishes to npm from `.github/workflows/release.yml`, through npm trusted publishing: no token is stored, the registry trusts the workflow's OIDC token.

In the repository, `exports` and `imports` point at `src/*.ts`, so nothing needs building to run or test. `publishConfig.exports` and `publishConfig.imports` hold the same entries pointing at `dist/*.js`, which is how Effect lays out its package. pnpm swaps those fields on publish, but Bun and npm do not, so `scripts/publish-manifest` does it:

- `prepack` builds, keeps `package.json` aside, and writes the published form.
- `postpack` puts the repository's `package.json` back.

`npm publish`, `bun pm pack` and `bun publish` all run these two hooks. The structure test checks that `publishConfig` mirrors `exports` and `imports`.
