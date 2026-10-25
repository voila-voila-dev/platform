# @voila.dev/platform

## 0.12.0

### Minor Changes

- [#33](https://github.com/voila-voila-dev/platform/pull/33) [`fbcf04f`](https://github.com/voila-voila-dev/platform/commit/fbcf04f627786f8074cc314dd2fd518672120632) Thanks [@emilienbidet](https://github.com/emilienbidet)! - `Screenshot` carries its bytes as `content` (was `png`) with a `contentType` (`ContentType` from `/file`, `image/png` from both adapters).

### Patch Changes

- [#33](https://github.com/voila-voila-dev/platform/pull/33) [`fbcf04f`](https://github.com/voila-voila-dev/platform/commit/fbcf04f627786f8074cc314dd2fd518672120632) Thanks [@emilienbidet](https://github.com/emilienbidet)! - `ScreenshotRequest` is a `Schema.Struct` value object (`ScreenshotRequest.make({ url, width, height })`) instead of a plain interface, so an application can decode a capture request at its boundary.

## 0.11.0

### Minor Changes

- [#31](https://github.com/voila-voila-dev/platform/pull/31) [`c6aaa49`](https://github.com/voila-voila-dev/platform/commit/c6aaa49f62258bdd760042168b1ee9832532d44d) Thanks [@emilienbidet](https://github.com/emilienbidet)! - `maskRows` takes the application's personal data columns, `piiColumns` (a pattern or a predicate on the column name), and the brick no longer ships a list: `isPiiColumn` is removed.
  
  `ColumnDescription`, `JsonRow` and `ReadonlyQueryResult` are value objects (`Schema.Struct`, `Schema.Record`), so an application can use them in its own contracts.

## 0.10.0

### Minor Changes

- [#26](https://github.com/voila-voila-dev/platform/pull/26) [`a3997da`](https://github.com/voila-voila-dev/platform/commit/a3997dac5a60ae373ffdc448f556800f5ae70888) Thanks [@emilienbidet](https://github.com/emilienbidet)! - Add the `cache` brick: `KeyValueCache` (string values with a time to live, an atomic `increment`, typed `CacheMissError` and `CacheTransportError`), `readCachedValue` and `writeCachedValue` for a cache in front of a source of truth, `readSingleUseCacheEntry` for a cache that is the token store, with `/cache/memory` (`inMemoryKeyValueCache`, on the Effect `Clock`) and `/cache/redis` (`redisKeyValueCache`, on the application's `Redis`).

- [#30](https://github.com/voila-voila-dev/platform/pull/30) [`d46ffcd`](https://github.com/voila-voila-dev/platform/commit/d46ffcd3fa4831d2fb21e15be6705588dde3536e) Thanks [@emilienbidet](https://github.com/emilienbidet)! - Add the `readonly-database` brick: the `ReadonlyDatabase` port, `guardQuery` (one read-only statement over a table allowlist, withheld columns, a row cap) and `maskRows` for personal data columns, with `/readonly-database/pg` (`pgReadonlyDatabase`, on `pg`, an optional peer dependency) and `/readonly-database/memory` (`stubReadonlyDatabase`, `unavailableReadonlyDatabase`).

- [#29](https://github.com/voila-voila-dev/platform/pull/29) [`2dc18ee`](https://github.com/voila-voila-dev/platform/commit/2dc18eed5accb801342ecfb2e7726d8255580184) Thanks [@emilienbidet](https://github.com/emilienbidet)! - Add the `screenshot` brick: `Screenshots.capture({ url, width, height })` renders a page in a fresh, signed-out browser and returns its viewport as a `Screenshot` PNG of exactly that size, or a `ScreenshotError`; `/screenshot/bun` (`bunWebViewScreenshots`, one `Bun.WebView` per capture, WebKit on macOS and Chromium elsewhere, `settle` and `timeout` options) and `/screenshot/memory` (`stubScreenshots`).

- [#28](https://github.com/voila-voila-dev/platform/pull/28) [`d66115c`](https://github.com/voila-voila-dev/platform/commit/d66115c5a595ecaed5a0065e7bf17f7977722de1) Thanks [@emilienbidet](https://github.com/emilienbidet)! - Add the spreadsheet brick: `/spreadsheet` describes a styled workbook (`SpreadsheetDocument`, its sheets, rows, cells and images, `cell`/`mergedCell`/`cellStyle`) and writes CSV that Excel opens as is (`serializeCsv`); `SpreadsheetRenderer` turns a document into a file, with `/spreadsheet/xlsx` (`xlsxSpreadsheetRenderer`, on exceljs) and `/spreadsheet/memory` (`stubSpreadsheetRenderer`).

## 0.9.0

### Minor Changes

- [#24](https://github.com/voila-voila-dev/platform/pull/24) [`403906f`](https://github.com/voila-voila-dev/platform/commit/403906fdd218b22deaa802ad923003c6ff5d3837) Thanks [@emilienbidet](https://github.com/emilienbidet)! - `BasisPoints` is the base of every rate: `TaxRate` is `BasisPoints.pipe(Schema.brand("TaxRate"))`, so a `TaxRate` is also `BasisPoints`, and an application brands its own rates the same way. `boundedBasisPoints(label)` is gone. `applyBasisPoints` and `percentFromBasisPoints` take a `BasisPoints` (any rate) instead of a `number`; `basisPointsFromPercent` still returns a plain number for the caller to brand.

## 0.8.0

### Minor Changes

- [#20](https://github.com/voila-voila-dev/platform/pull/20) [`5dab614`](https://github.com/voila-voila-dev/platform/commit/5dab6147c1520b566885af416b6c72071cd11a6e) Thanks [@emilienbidet](https://github.com/emilienbidet)! - `FileRef`, `ImageRef`, `ImagePreview`, `FileLink`, `FileStat`, `FileUpload` and `FileLinkLifetimes` are `Schema.Struct`s instead of `Schema.Class`es: their values are plain objects. Build them with `FileLink.make({...})` instead of `new FileLink({...})`, and check them with `Schema.is(FileLink)` instead of `instanceof`.

- [#20](https://github.com/voila-voila-dev/platform/pull/20) [`5dab614`](https://github.com/voila-voila-dev/platform/commit/5dab6147c1520b566885af416b6c72071cd11a6e) Thanks [@emilienbidet](https://github.com/emilienbidet)! - New `locale` and `location` bricks. `locale` has the ISO `Locale` and `Language` lists and `SupportedLocales.make` for the locales an app renders. `location` has addresses, coordinates, country codes, the `LocationProvider` port with `locateAddress` and `resolveAddressCoordinates`, and `SupportedCountries.make` for an app's markets. `AddressFormatter` writes an address the way its country's post does, for every country (formats from Google libaddressinput), and takes an app's own format per country. Adapters: `/location/ban` (Base Adresse Nationale), `/location/here` (HERE), `/location/memory`, and `routedLocationProvider` to chain them.

- [#23](https://github.com/voila-voila-dev/platform/pull/23) [`2d0ad57`](https://github.com/voila-voila-dev/platform/commit/2d0ad575d057548e00e9a35c8a8ecedae1ad6f7c) Thanks [@emilienbidet](https://github.com/emilienbidet)! - New `search-engine` brick: the `SearchEngine` port for web searches, from a country and in a locale's language, an in-memory engine with synthetic results and a stub in `/search-engine/memory`, and a DataForSEO engine in `/search-engine/dataforseo`, which maps the country and the locale to its own location and language codes. `/location` adds `numericCountryCode`.

## 0.7.0

### Minor Changes

- [#19](https://github.com/voila-voila-dev/platform/pull/19) [`9d5d46c`](https://github.com/voila-voila-dev/platform/commit/9d5d46c2882efa2a4041973869c3aa61387b8069) Thanks [@emilienbidet](https://github.com/emilienbidet)! - Add the `money` brick: `Money` in minor units with an ISO 4217 `Currency` and its `currencyDecimals`, `formatMoney` through `Intl`, `parseMoneyInput` and `moneyInput` for what a form shows, and the basis-point rates (`BasisPoints`, `TaxRate`, `applyBasisPoints`).

## 0.6.0

### Minor Changes

- [#16](https://github.com/voila-voila-dev/platform/pull/16) [`d768e26`](https://github.com/voila-voila-dev/platform/commit/d768e2669082f23c029f98d3bcf09b7cd6b86dac) Thanks [@emilienbidet](https://github.com/emilienbidet)! - Core exports the `EmailAddress` and `Phone` (E.164) branded value objects, so bricks can share them without depending on an email or phone brick.

### Patch Changes

- [#18](https://github.com/voila-voila-dev/platform/pull/18) [`c3a8064`](https://github.com/voila-voila-dev/platform/commit/c3a8064b9f1d81ff1fc0f9fa151cf9096cb39231) Thanks [@emilienbidet](https://github.com/emilienbidet)! - `ContentType` decodes a raw header (`Text/CSV; charset=utf-8` becomes `text/csv`), so `FileRef`s stored with parameters or uppercase types still decode. `ContentType.make` and `Schema.is` stay strict.

## 0.5.0

### Minor Changes

- [#13](https://github.com/voila-voila-dev/platform/pull/13) [`6929729`](https://github.com/voila-voila-dev/platform/commit/6929729795f14aa24c10c40fc7ae2bb7b2f4f177) Thanks [@emilienbidet](https://github.com/emilienbidet)! - Add the `file` brick: `Files.make({ kinds })` declares the application's kinds of files (prefix, visibility, upload rule, image widths) and hands typed keys and upload links; `FileStorage`, `FileDownloads` and `FileTokens` ports with `FileRef`, `ImageRef` and `FileLinkLifetime`; `/file/bun` (`bunS3FileStorage`, `hmacFileTokens`), `/file/http-server` (`serveSecureFile`) and `/file/memory` (`inMemoryFiles`).

## 0.4.1

### Patch Changes

- [#9](https://github.com/voila-voila-dev/platform/pull/9) [`6a8fcbc`](https://github.com/voila-voila-dev/platform/commit/6a8fcbc53201c5156993365b1fd9d99cc3652083) Thanks [@emilienbidet](https://github.com/emilienbidet)! - `xlsxImportReader` loads exceljs on its first read, so a `BulkImport` declared in code a browser bundle shares no longer pulls exceljs into that bundle.

## 0.4.0

### Minor Changes

- [#7](https://github.com/voila-voila-dev/platform/pull/7) [`42b649f`](https://github.com/voila-voila-dev/platform/commit/42b649f8d155d2b9f7fdd81ab995ef594c86e54a) Thanks [@emilienbidet](https://github.com/emilienbidet)! - bulk-import becomes a library the importing domain calls, typed by its schema. Breaking:
  
  - A draft is now an import intent, bound to its schema: `BulkImport.make({ target, columns, check? }, { readers, limits? })` gives `create`, `get`, `editCell`, `importNextBatch`, `importAll`, `discard` and `template`, plus the `Intent`, `Column`, `CreatePayload` and `EditCellPayload` schemas for the importing domain's endpoints. The columns, the rows and the records handed over are typed by the schema, and another target's intent is not found. `get` decodes the stored intent: one whose columns changed fails with `SchemaError`.
  - The use cases, `ImportSchemas`, `ImportFileFields`, `/bulk-import/http` (`BulkImportsApiGroup`) and `/bulk-import/http-server` (`bulkImportsHandlers`) are gone: the importing domain gates and serves its own.
  - An intent keeps only its rows and the import's progress. `fileName`, `format`, `targetId`, `targetLabel`, `createdByUserId`, `createdAt`, `updatedAt`, `importedAt`, `expiresAt`, `importedRowCount` and `outcome` are gone: the importing domain keeps the file, what the request was for, who made it and when, next to the intent's id. Intents no longer expire, so `draftLifetimeDays` and `PurgeExpiredImportDraftsUseCase` are gone too.
  - The import answers for each row (`"created"`, `"updated"` or `{ rejected }`), kept on the row; `ImportIntent.summary` counts them. Each entry it gets carries the row's `index`, stable across retries. `ImportOutcome` is gone.
  - Concurrent changes no longer overwrite each other: an intent has a `version`, and a batch is leased to the import that took it (`ImportLimits.batchLeaseMillis`, 5 minutes by default). Both fail with `ImportIntentConflictError`. The table is `import_intent (id, version, data)`, and `ImportIntentRepository` has `insert` and `update(intent, expectedVersion)` instead of `save`.
  - `ImportIntentAlreadyImportedError` and `ImportIntentNotEditableError` are one `ImportIntentStatusError { id, status }`.
  - Each column decodes its cell with an Effect `Schema` (`Codec<A, string>`) instead of `normalize` and `validate`; `headerAliases` is now `aliases`, a column's `label` is matched as a header too, and `cellMatchesSchema` is gone. An invalid cell's issue carries the schema's message, or the column's `message`. A schema's `check` flags rows across their columns. An edited cell is kept as its schema encodes it, and an edit outside the columns or the rows fails (`ImportIntentCellNotFoundError`).
  - A file missing a required column is refused (`ImportColumnsMissingError`) instead of drafted with the `missingColumn` issue on every row.
  - `inMemoryBulkImport()` (`/bulk-import/memory`) provides what a `BulkImport` needs in the importing domain's tests.
  - No longer exported: `parseCsv`, `CsvDelimiter`, `decodeImportTable`, `revalidateImportRows`, `validImportRows`, `DecodedImport`, `addImportOutcome`, `emptyImportOutcome`, `importFormatOf`, `ImportTarget`.
  - Core exports `NonNegativeInt`, an integer at least 0.
  - `csvImportReader` and `jsonImportReader` moved to `/bulk-import/csv` and `/bulk-import/json`, like `/bulk-import/xlsx`. Each import lists the readers it accepts, so the `ImportReaders` reference is gone.

## 0.3.1

### Patch Changes

- [#5](https://github.com/voila-voila-dev/platform/pull/5) [`a9ca3f4`](https://github.com/voila-voila-dev/platform/commit/a9ca3f4e677061054031c304ceb097111161df3d) Thanks [@emilienbidet](https://github.com/emilienbidet)! - bulk-import reads files as spreadsheets actually write them: Excel's Windows-1252 CSV, XLSX dates as ISO 8601 instead of the server's locale, and lines of bare separators dropped instead of becoming empty rows.
  
  Its literals are lowercase, like the rest of the package: draft statuses (`reviewing`, `importing`, `imported`), row issues (`missingColumn`, `required`, `invalidValue`, `duplicate`) and file rejections (`tooLarge`, `tooManyRows`, `empty`, `unreadable`, `unsupportedFormat`).

## 0.3.0

### Minor Changes

- [#3](https://github.com/voila-voila-dev/platform/pull/3) [`99751c5`](https://github.com/voila-voila-dev/platform/commit/99751c50e0f8464780a883f201bf278ea670c739) Thanks [@emilienbidet](https://github.com/emilienbidet)! - Add `bulk-import`: a file (CSV, JSON, or XLSX through `/bulk-import/xlsx`) read into a draft validated against the target's columns, reviewed and fixed cell by cell, then imported batch by batch by the application. Formats, schemas and limits are the application's to provide.
