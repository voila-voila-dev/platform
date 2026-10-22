import { describe, expect, it } from "bun:test";
import { serializeCsv } from "#spreadsheet/lib/serialize-csv";

describe("serializeCsv", () => {
	it("starts with a BOM, splits on ; and ends every line with CRLF", () => {
		expect(
			serializeCsv({ header: ["Nom", "Ville"], rows: [["Ada", "Paris"]] }),
		).toBe("﻿Nom;Ville\r\nAda;Paris\r\n");
	});

	it("quotes a cell holding the delimiter, a quote or a line break", () => {
		expect(
			serializeCsv({
				header: ["a"],
				rows: [["x;y"], ['say "hi"'], ["one\ntwo"], ["x,y"]],
			}),
		).toBe('﻿a\r\n"x;y"\r\n"say ""hi"""\r\n"one\ntwo"\r\nx,y\r\n');
	});

	it("quotes on , when asked for it", () => {
		expect(
			serializeCsv({
				header: ["a", "b"],
				rows: [["x,y", "z"]],
				delimiter: ",",
			}),
		).toBe('﻿a,b\r\n"x,y",z\r\n');
	});

	it("keeps a cell that looks like a formula inert", () => {
		expect(
			serializeCsv({ header: ["a"], rows: [["=SUM(A1)"], ["-1"], ["@x"]] }),
		).toBe("﻿a\r\n'=SUM(A1)\r\n'-1\r\n'@x\r\n");
	});
});
