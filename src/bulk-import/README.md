# bulk-import

Turns a CSV, JSON or XLSX file into an import intent. Its rows are reviewed and fixed cell by cell, then imported batch by batch as typed records.

Users never call it directly. A domain (contacts, products…) declares its schema, serves its own endpoints, and keeps the intent's id in its own table, next to the request's context (segment, source, author, dates).

## Declare the import

```ts
import { BulkImport } from "@voila.dev/platform/bulk-import";
import { csvImportReader } from "@voila.dev/platform/bulk-import/csv";
import { xlsxImportReader } from "@voila.dev/platform/bulk-import/xlsx";

export const ContactBulkImport = BulkImport.make(
	{
		target: "contacts",
		columns: {
			name: { schema: Schema.String, label: "Nom" },
			email: { schema: EmailAddress, label: "E-mail", unique: true, message: "Une adresse e-mail" },
			phone: { schema: Schema.String, aliases: ["tél"] },
		},
		check: (record) =>
			record.email === undefined && record.phone === undefined
				? [{ column: "phone", issue: "required", message: "Un e-mail ou un téléphone" }]
				: [],
	},
	{ limits: { maxRows: 5_000 }, readers: [csvImportReader, xlsxImportReader] },
);
```

- Each cell is trimmed, then decoded by its column's `schema` (a `Codec<A, string>`). The cell keeps the text the schema encodes back, which is also the text compared for `unique`.
- Header cells are matched against each column's key, `label` and `aliases`, ignoring case and accents. A file without a header is read by column order.
- `check` runs on rows whose cells are all valid, to check across columns.
- `readers` lists the formats this import accepts. `limits` overrides the `ImportLimits` reference (2 MiB, 20,000 rows, batches of 200) for this import only.

## Use it in the domain's use cases

```ts
const intent = yield* ContactBulkImport.create({ fileName, content });
yield* contactsImports.insert({ importIntentId: intent.id, segmentId, fileName });

yield* ContactBulkImport.get(intent.id);
yield* ContactBulkImport.editCell(intent.id, { rowIndex: 2, column: "email", value: "ana@x.fr" });

// One result per entry, in order: "created", "updated" or { rejected: reason }.
yield* ContactBulkImport.importNextBatch(intent.id, (batch) =>
	Effect.forEach(batch, ({ index, record }) => upsertContact(segmentId, record)),
);
yield* ContactBulkImport.importAll(intent.id, importBatch); // every batch, for a background job

ImportIntent.summary(intent); // { rows, invalid, created, updated, rejected, remaining }
yield* ContactBulkImport.discard(intent.id);
```

A row's `index` stays the same across retries. Write each row by its index or by a natural key, so that importing a batch twice does no harm.

## Serve it from the domain's endpoints

| | |
| --- | --- |
| `ContactBulkImport.Intent` | response schema |
| `Schema.Struct({ ...ContactBulkImport.CreatePayload.fields, segmentId })` | upload payload (`content` in base64) |
| `ContactBulkImport.EditCellPayload` | `{ rowIndex, column, value }`, `column` limited to the schema's |
| `ContactBulkImport.template()` | a CSV of the labels, to download and fill |

## Errors

| Error | When |
| --- | --- |
| `ImportFileRejectedError` | `reason`: `tooLarge`, `tooManyRows`, `empty`, `unreadable`, `unsupportedFormat` |
| `ImportColumnsMissingError` | the header lacks a required column |
| `ImportIntentNotFoundError` | no intent with this id for this target |
| `ImportIntentCellNotFoundError` | the edit is outside the schema's columns or the intent's rows |
| `ImportIntentStatusError` | an edit after the import started, or an import of an intent already imported |
| `ImportIntentConflictError` | the intent changed since it was read, or another import holds its batch |
| `SchemaError` | the stored intent's columns no longer match the schema |

## Adapters

- **Storage:** `drizzleImportIntentRepository` with `importIntentTable` (`import_intent (id, version, data)`), from `/bulk-import/drizzle`. Its tests run against the Postgres at `DATABASE_URL`.
- **Tests:** `inMemoryBulkImport()` provides the repository and an id generator, from `/bulk-import/memory`.
- **Readers:** `csvImportReader` from `/bulk-import/csv`, `jsonImportReader` from `/bulk-import/json`, and `xlsxImportReader` from `/bulk-import/xlsx`, which needs `exceljs`. Any `ImportReader` works.
