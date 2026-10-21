---
"@voila.dev/platform": minor
---

bulk-import becomes a library the importing domain calls, typed by its schema. Breaking:

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
