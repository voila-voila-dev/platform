import { describe, expect, it } from "bun:test";
import { Option } from "effect";
import {
	contentTypeOfKey,
	normalizeContentType,
	normalizeContentTypeOrOctetStream,
} from "#file/lib/content-type";
import { ContentType } from "#file/value-objects/content-type";

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
