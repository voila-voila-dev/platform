import { describe, expect, it } from "bun:test";
import { Option, Schema } from "effect";
import {
	contentTypeOfKey,
	normalizeContentType,
	normalizeContentTypeOrOctetStream,
} from "#file/lib/content-type";
import { ContentType } from "#file/value-objects/content-type";
import { FileRef } from "#file/value-objects/file-ref";

describe("normalizeContentType", () => {
	it("lowercases a header and drops its parameters", () => {
		expect(normalizeContentType(" Text/Plain; charset=UTF-8")).toStrictEqual(
			Option.some(ContentType.make("text/plain")),
		);
	});

	it("refuses what is not type/subtype", () => {
		for (const raw of ["", "png", "image/", "/png", "image/png/x"])
			expect(normalizeContentType(raw)).toStrictEqual(Option.none());
		expect(normalizeContentTypeOrOctetStream("png")).toBe(
			ContentType.make("application/octet-stream"),
		);
	});
});

describe("contentTypeOfKey", () => {
	it("reads the type off the extension, else octet-stream", () => {
		expect(contentTypeOfKey("a/b.JPG")).toBe(ContentType.make("image/jpeg"));
		expect(contentTypeOfKey("a/b")).toBe(
			ContentType.make("application/octet-stream"),
		);
	});
});

describe("ContentType", () => {
	it("decodes a stored header to its bare type and encodes it clean", () => {
		const ref = Schema.decodeUnknownSync(FileRef)({
			key: "run/report.csv",
			contentType: "Text/CSV; charset=utf-8",
			sizeBytes: 3,
		});
		expect(ref.contentType).toBe(ContentType.make("text/csv"));
		expect(Schema.encodeSync(FileRef)(ref).contentType).toBe("text/csv");
	});

	it("refuses what is not type/subtype, even on decode", () => {
		expect(Schema.decodeUnknownOption(ContentType)("png")).toStrictEqual(
			Option.none(),
		);
	});

	it("only makes the bare type", () => {
		expect(() => ContentType.make("text/csv; charset=utf-8")).toThrow();
		expect(Schema.is(ContentType)("Text/CSV")).toBe(false);
	});
});
