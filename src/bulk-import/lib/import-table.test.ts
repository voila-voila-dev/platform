import { describe, expect, it } from "bun:test";

import { Schema, SchemaTransformation } from "effect";
import { parseCsv } from "#bulk-import/adapters/csv/parse-csv";
import { ImportSchema } from "#bulk-import/lib/import-schema";
import {
	decodeImportTable,
	validateImportRows,
} from "#bulk-import/lib/import-table";
import type { ImportRow } from "#bulk-import/value-objects/import-row";

const EmailAddress = Schema.String.pipe(
	Schema.decode(SchemaTransformation.toLowerCase()),
).check(Schema.isPattern(/^[^@\s]+@[^@\s]+\.[^@\s]+$/u));

function rowAt(rows: ReadonlyArray<ImportRow>, index: number): ImportRow {
	const row = rows[index];
	if (row === undefined) throw new Error(`no row ${index}`);
	return row;
}

const contactSchema = ImportSchema.make({
	target: "contacts",
	columns: {
		firstName: { schema: Schema.String, aliases: ["prénom", "first name"] },
		lastName: { schema: Schema.String, aliases: ["nom", "last name"] },
		email: {
			schema: EmailAddress,
			aliases: ["e-mail", "adresse email"],
			required: true,
			unique: true,
		},
	},
});

function decodeCsvRows(text: string) {
	return decodeImportTable(contactSchema, parseCsv(text));
}

function issuesFor(
	result: ReturnType<typeof decodeCsvRows>,
	index: number,
): ReadonlyArray<string> {
	return (
		result.rows[index]?.issues.map(
			(issue) => `${issue.column}:${issue.issue}`,
		) ?? []
	);
}

describe("decodeImportTable", () => {
	it("maps columns by header, accent- and case-insensitively", () => {
		const result = decodeCsvRows(
			"Prénom;NOM;E-Mail\nMarie;Dupont;Marie@Example.FR",
		);

		expect(result.rows).toHaveLength(1);
		expect(rowAt(result.rows, 0).values).toEqual({
			firstName: "Marie",
			lastName: "Dupont",
			// The schema lowercased it, so the dedupe below is case-insensitive too.
			email: "marie@example.fr",
		});
		expect(rowAt(result.rows, 0).issues).toEqual([]);
	});

	it("tolerates reordered columns", () => {
		const result = decodeCsvRows("email,nom,prénom\nm@x.fr,Dupont,Marie");

		expect(rowAt(result.rows, 0).values).toEqual({
			firstName: "Marie",
			lastName: "Dupont",
			email: "m@x.fr",
		});
	});

	it("falls back to positional mapping when no header matches", () => {
		const result = decodeCsvRows("Marie,Dupont,m@x.fr");

		// The single line is DATA, not a discarded header.
		expect(result.rows).toHaveLength(1);
		expect(rowAt(result.rows, 0).values.email).toBe("m@x.fr");
	});

	it("flags an invalid email against the column's schema", () => {
		expect(issuesFor(decodeCsvRows("email\npas-une-adresse"), 0)).toEqual([
			"email:invalidValue",
		]);
	});

	it("flags an empty required cell as required, not invalid", () => {
		expect(issuesFor(decodeCsvRows("prénom,email\nMarie,"), 0)).toEqual([
			"email:required",
		]);
	});

	it("leaves an empty optional cell clean", () => {
		const result = decodeCsvRows("prénom,email\n,m@x.fr");

		expect(rowAt(result.rows, 0).issues).toEqual([]);
		expect(rowAt(result.rows, 0).values.firstName).toBe("");
	});

	it("names a required column missing from the header", () => {
		expect(
			decodeCsvRows("prénom,nom\nMarie,Dupont\nJean,Bon").missingColumns,
		).toEqual(["email"]);
	});

	it("keeps the first of a duplicate pair clean and flags the later row", () => {
		const result = decodeCsvRows("email\nm@x.fr\nautre@x.fr\nM@X.FR");

		expect(rowAt(result.rows, 0).issues).toEqual([]);
		expect(rowAt(result.rows, 1).issues).toEqual([]);
		// Row 2 only collides once the schema has folded the case.
		expect(issuesFor(result, 2)).toEqual(["email:duplicate"]);
	});

	it("pads rows that are short of cells", () => {
		const result = decodeCsvRows("prénom,nom,email\nMarie");

		expect(rowAt(result.rows, 0).values.lastName).toBe("");
		expect(issuesFor(result, 0)).toEqual(["email:required"]);
	});

	it("returns nothing for an empty file", () => {
		expect(decodeCsvRows("").rows).toEqual([]);
	});
});

describe("validateImportRows", () => {
	it("clears an issue once the offending cell is fixed", () => {
		const decoded = decodeCsvRows("email\ncassé");
		expect(rowAt(decoded.rows, 0).issues).toHaveLength(1);

		const fixed = validateImportRows(contactSchema, [
			{ ...rowAt(decoded.rows, 0), values: { email: "ok@x.fr" } },
		]);

		expect(rowAt(fixed, 0).issues).toEqual([]);
	});

	it("keeps a retyped cell canonical, as the schema encodes it", () => {
		const validated = validateImportRows(contactSchema, [
			{ index: 0, values: { email: "m@x.fr" }, issues: [] },
			{ index: 1, values: { email: "  M@X.FR " }, issues: [] },
		]);

		expect(rowAt(validated, 1).values.email).toBe("m@x.fr");
		expect(rowAt(validated, 1).issues).toEqual([
			{ column: "email", issue: "duplicate" },
		]);
	});

	it("drops values no column declares", () => {
		const validated = validateImportRows(contactSchema, [
			{ index: 0, values: { email: "m@x.fr", age: "31" }, issues: [] },
		]);

		expect(Object.keys(rowAt(validated, 0).values)).not.toContain("age");
	});

	it("re-evaluates duplicates file-wide after an edit", () => {
		const decoded = decodeCsvRows("email\nm@x.fr\nm@x.fr");
		expect(rowAt(decoded.rows, 1).issues).toHaveLength(1);

		// Fixing the SECOND row must clear its duplicate flag...
		const fixed = validateImportRows(contactSchema, [
			rowAt(decoded.rows, 0),
			{ ...rowAt(decoded.rows, 1), values: { email: "autre@x.fr" } },
		]);
		expect(rowAt(fixed, 1).issues).toEqual([]);

		// ...and editing the FIRST row to collide with the second must flag the
		// second, which a per-row revalidation would have missed.
		const collided = validateImportRows(contactSchema, [
			{ ...rowAt(decoded.rows, 0), values: { email: "z@x.fr" } },
			{ ...rowAt(decoded.rows, 1), values: { email: "z@x.fr" } },
		]);
		expect(rowAt(collided, 0).issues).toEqual([]);
		expect(rowAt(collided, 1).issues).toEqual([
			{ column: "email", issue: "duplicate" },
		]);
	});
});
