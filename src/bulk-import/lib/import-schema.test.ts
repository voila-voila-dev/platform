import { describe, expect, it } from "bun:test";

import { Schema } from "effect";
import {
	cellMatchesSchema,
	decodeImportTable,
	type ImportSchema,
	revalidateImportRows,
	validImportRows,
} from "#bulk-import/lib/import-schema";
import { parseCsv } from "#bulk-import/lib/parse-csv";
import type { ImportRow } from "#bulk-import/payloads/import-row";

const EmailAddress = Schema.String.check(
	Schema.isPattern(/^[^@\s]+@[^@\s]+\.[^@\s]+$/u),
);

function rowAt(rows: ReadonlyArray<ImportRow>, index: number): ImportRow {
	const row = rows[index];
	if (row === undefined) throw new Error(`no row ${index}`);
	return row;
}

function decodeCsvRows(schema: ImportSchema, text: string) {
	return decodeImportTable(schema, parseCsv(text).rows);
}

const contactSchema: ImportSchema = {
	columns: [
		{ key: "firstName", headerAliases: ["prénom", "first name"] },
		{ key: "lastName", headerAliases: ["nom", "last name"] },
		{
			key: "email",
			headerAliases: ["email", "e-mail", "adresse email"],
			required: true,
			unique: true,
			normalize: (value) => value.toLowerCase(),
			validate: cellMatchesSchema(EmailAddress),
		},
	],
};

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
			contactSchema,
			"Prénom;NOM;E-Mail\nMarie;Dupont;Marie@Example.FR",
		);

		expect(result.hasHeaderRow).toBe(true);
		expect(result.rows).toHaveLength(1);
		expect(rowAt(result.rows, 0).values).toEqual({
			firstName: "Marie",
			lastName: "Dupont",
			// `normalize` lowercased it, so the dedupe below is case-insensitive too.
			email: "marie@example.fr",
		});
		expect(rowAt(result.rows, 0).issues).toEqual([]);
	});

	it("tolerates reordered columns", () => {
		const result = decodeCsvRows(
			contactSchema,
			"email,nom,prénom\nm@x.fr,Dupont,Marie",
		);

		expect(rowAt(result.rows, 0).values).toEqual({
			firstName: "Marie",
			lastName: "Dupont",
			email: "m@x.fr",
		});
	});

	it("falls back to positional mapping when no header matches", () => {
		const result = decodeCsvRows(contactSchema, "Marie,Dupont,m@x.fr");

		expect(result.hasHeaderRow).toBe(false);
		// The single line is DATA, not a discarded header.
		expect(result.rows).toHaveLength(1);
		expect(rowAt(result.rows, 0).values.email).toBe("m@x.fr");
	});

	it("flags an invalid email against the domain schema", () => {
		const result = decodeCsvRows(contactSchema, "email\npas-une-adresse");

		expect(issuesFor(result, 0)).toEqual(["email:invalidValue"]);
	});

	it("flags an empty required cell as required, not invalid", () => {
		const result = decodeCsvRows(contactSchema, "prénom,email\nMarie,");

		expect(issuesFor(result, 0)).toEqual(["email:required"]);
	});

	it("leaves an empty optional cell clean", () => {
		const result = decodeCsvRows(contactSchema, "prénom,email\n,m@x.fr");

		expect(rowAt(result.rows, 0).issues).toEqual([]);
		expect(rowAt(result.rows, 0).values.firstName).toBe("");
	});

	it("reports a required column missing from the file, on every row", () => {
		const result = decodeCsvRows(
			contactSchema,
			"prénom,nom\nMarie,Dupont\nJean,Bon",
		);

		expect(result.missingColumns).toEqual(["email"]);
		expect(issuesFor(result, 0)).toEqual(["email:missingColumn"]);
		expect(issuesFor(result, 1)).toEqual(["email:missingColumn"]);
	});

	it("keeps the first of a duplicate pair clean and flags the later row", () => {
		const result = decodeCsvRows(
			contactSchema,
			"email\nm@x.fr\nautre@x.fr\nM@X.FR",
		);

		expect(rowAt(result.rows, 0).issues).toEqual([]);
		expect(rowAt(result.rows, 1).issues).toEqual([]);
		// Row 2 only collides once `normalize` has folded the case.
		expect(issuesFor(result, 2)).toEqual(["email:duplicate"]);
	});

	it("pads rows that are short of cells", () => {
		const result = decodeCsvRows(contactSchema, "prénom,nom,email\nMarie");

		expect(rowAt(result.rows, 0).values.lastName).toBe("");
		expect(issuesFor(result, 0)).toEqual(["email:required"]);
	});

	it("returns nothing for an empty file", () => {
		expect(decodeCsvRows(contactSchema, "").rows).toEqual([]);
	});
});

describe("revalidateImportRows", () => {
	it("clears an issue once the offending cell is fixed inline", () => {
		const decoded = decodeCsvRows(contactSchema, "email\ncassé");
		expect(rowAt(decoded.rows, 0).issues).toHaveLength(1);

		const fixed = revalidateImportRows(contactSchema, [
			{
				...rowAt(decoded.rows, 0),
				values: { ...rowAt(decoded.rows, 0).values, email: "ok@x.fr" },
			},
		]);

		expect(rowAt(fixed, 0).issues).toEqual([]);
	});

	it("normalizes before judging, so a retyped cell dedupes case-insensitively", () => {
		// A row edited in the grid never went through `decodeCsvRows`, so
		// `revalidateImportRows` is the only thing that can canonicalize it. The
		// backend re-runs this same function on submitted rows.
		const rows = [
			{ index: 0, values: { email: "m@x.fr" }, issues: [] },
			{ index: 1, values: { email: "M@X.FR" }, issues: [] },
		];

		const validated = revalidateImportRows(contactSchema, rows);

		expect(rowAt(validated, 0).issues).toEqual([]);
		expect(rowAt(validated, 1).issues).toEqual([
			{ column: "email", issue: "duplicate" },
		]);
	});

	it("re-evaluates duplicates file-wide after an edit", () => {
		const decoded = decodeCsvRows(contactSchema, "email\nm@x.fr\nm@x.fr");
		expect(rowAt(decoded.rows, 1).issues).toHaveLength(1);

		// Fixing the SECOND row must clear its duplicate flag...
		const fixed = revalidateImportRows(contactSchema, [
			rowAt(decoded.rows, 0),
			{ ...rowAt(decoded.rows, 1), values: { email: "autre@x.fr" } },
		]);
		expect(rowAt(fixed, 1).issues).toEqual([]);

		// ...and editing the FIRST row to collide with the second must flag the
		// second, which a per-row revalidation would have missed.
		const collided = revalidateImportRows(contactSchema, [
			{ ...rowAt(decoded.rows, 0), values: { email: "z@x.fr" } },
			{ ...rowAt(decoded.rows, 1), values: { email: "z@x.fr" } },
		]);
		expect(rowAt(collided, 0).issues).toEqual([]);
		expect(rowAt(collided, 1).issues).toEqual([
			{ column: "email", issue: "duplicate" },
		]);
	});
});

describe("validImportRows", () => {
	it("keeps only the rows with no issues", () => {
		const result = decodeCsvRows(
			contactSchema,
			"prénom,email\nMarie,m@x.fr\nJean,cassé\nLuc,l@x.fr",
		);

		expect(validImportRows(result.rows).map((row) => row.values.email)).toEqual(
			["m@x.fr", "l@x.fr"],
		);
	});
});
