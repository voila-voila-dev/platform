# @voila.dev/platform

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
