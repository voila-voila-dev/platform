import { describe, expect, it } from "bun:test";
import { parseCsv, sniffCsvDelimiter } from "#bulk-import/lib/parse-csv";

describe("sniffCsvDelimiter", () => {
	it("defaults to a comma", () => {
		expect(sniffCsvDelimiter("a,b,c\n1,2,3")).toBe(",");
	});

	it("detects the semicolon French exports use", () => {
		expect(sniffCsvDelimiter("prénom;nom;email\nMarie;Dupont;m@x.fr")).toBe(
			";",
		);
	});

	it("detects tabs", () => {
		expect(sniffCsvDelimiter("a\tb\tc")).toBe("\t");
	});

	it("ignores delimiters inside quoted fields", () => {
		// The quoted comma must not outvote the two real semicolons.
		expect(sniffCsvDelimiter('"Dupont, Marie";nom;email')).toBe(";");
	});

	it("only looks at the first line", () => {
		expect(sniffCsvDelimiter("a;b\n1,2,3,4,5,6")).toBe(";");
	});
});

describe("parseCsv", () => {
	it("reads a plain comma file", () => {
		expect(parseCsv("a,b\n1,2")).toEqual([
			["a", "b"],
			["1", "2"],
		]);
	});

	it("strips a UTF-8 BOM so the first header still matches", () => {
		// Excel writes one, and it would otherwise glue onto the first header.
		expect(parseCsv("﻿email\nm@x.fr")).toEqual([["email"], ["m@x.fr"]]);
	});

	it("keeps delimiters and newlines inside quoted fields", () => {
		expect(parseCsv('nom,adresse\n"Dupont","1 rue A, Paris"')).toEqual([
			["nom", "adresse"],
			["Dupont", "1 rue A, Paris"],
		]);
		expect(parseCsv('a\n"line1\nline2"')).toEqual([["a"], ["line1\nline2"]]);
	});

	it("unescapes doubled quotes", () => {
		expect(parseCsv('a\n"say ""hi"""')).toEqual([["a"], ['say "hi"']]);
	});

	it.each([
		["CRLF", "a,b\r\n1,2"],
		["LF", "a,b\n1,2"],
		["CR", "a,b\r1,2"],
	])("handles %s line endings", (_label, text) => {
		expect(parseCsv(text)).toEqual([
			["a", "b"],
			["1", "2"],
		]);
	});

	it("does not emit a phantom row for a trailing newline", () => {
		expect(parseCsv("a,b\n1,2\n")).toHaveLength(2);
	});

	it("drops entirely blank lines", () => {
		expect(parseCsv("a,b\n\n1,2")).toEqual([
			["a", "b"],
			["1", "2"],
		]);
	});

	it("trims unquoted cells but preserves quoted whitespace", () => {
		expect(parseCsv('a,b\n  1  ,"  2  "')[1]).toEqual(["1", "  2  "]);
	});

	it("returns no rows for empty input", () => {
		expect(parseCsv("")).toEqual([]);
	});
});
