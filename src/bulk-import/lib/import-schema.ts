import { Schema } from "effect";
import type { ImportCellIssue } from "#bulk-import/value-objects/import-row";

// A cell is trimmed, then decoded by `schema`: what it encodes back is the
// cell's canonical text, the one deduplicated and kept in the intent.
export interface ImportColumn<A = unknown> {
	readonly schema: Schema.Codec<A, string>;
	// Shown to whoever fills the file, and matched as a header like the key and aliases.
	readonly label?: string;
	readonly aliases?: ReadonlyArray<string>;
	readonly required?: boolean;
	readonly unique?: boolean;
	// Replaces the schema's own message on an invalid cell.
	readonly message?: string;
}

export type ImportColumns = Readonly<Record<string, ImportColumn>>;

type ColumnCodec<Column extends ImportColumn> = Schema.Codec<
	Column["schema"]["Type"],
	string
>;

type ImportRecordFields<Columns extends ImportColumns> = {
	readonly [K in keyof Columns]: Columns[K]["required"] extends true
		? ColumnCodec<Columns[K]>
		: Schema.optionalKey<ColumnCodec<Columns[K]>>;
};

export type ImportRecordOf<Columns extends ImportColumns> = Schema.Struct.Type<
	ImportRecordFields<Columns>
>;

// Columns are matched by key, label or alias when the file has a header, in
// declaration order otherwise. The target tells one schema's intents from another's.
export interface ImportSchema<
	Target extends string = string,
	Columns extends ImportColumns = ImportColumns,
> {
	readonly target: Target;
	readonly columns: Columns;
	// Checks a row whose cells are all valid, across its columns.
	check?(
		record: ImportRecordOf<NoInfer<Columns>>,
	): ReadonlyArray<ImportCellIssue<NoInfer<keyof Columns & string>>>;
}

export const ImportSchema = {
	make: <const Target extends string, const Columns extends ImportColumns>(
		schema: ImportSchema<Target, Columns>,
	): ImportSchema<Target, Columns> => schema,
};

export type ImportColumnKey<S extends ImportSchema> = keyof S["columns"] &
	string;

export type ImportRecord<S extends ImportSchema> = ImportRecordOf<S["columns"]>;

// Object.keys types an object's keys as string, whatever the object.
export function importColumnKeys<S extends ImportSchema>(
	schema: S,
): ReadonlyArray<ImportColumnKey<S>> {
	return Object.keys(schema.columns) as Array<ImportColumnKey<S>>;
}

export function isImportColumn<S extends ImportSchema>(
	schema: S,
	column: string,
): column is ImportColumnKey<S> {
	return Object.hasOwn(schema.columns, column);
}

export function importRecordSchema<S extends ImportSchema>(
	schema: S,
): Schema.Struct<ImportRecordFields<S["columns"]>> {
	const fields = Object.fromEntries(
		Object.entries(schema.columns).map(([key, column]) => [
			key,
			column.required === true
				? column.schema
				: Schema.optionalKey(column.schema),
		]),
	);
	return Schema.Struct(fields as ImportRecordFields<S["columns"]>);
}

// Decodes a row's cells, an empty one being an absent value.
export function importRecordDecoder<S extends ImportSchema>(schema: S) {
	const decode = Schema.decodeUnknownExit(importRecordSchema(schema));
	return (values: Readonly<Record<string, string>>) =>
		decode(
			Object.fromEntries(
				Object.entries(values).filter(([, text]) => text !== ""),
			),
		);
}
