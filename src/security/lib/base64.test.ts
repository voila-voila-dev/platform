import { describe, expect, it } from "bun:test";
import {
	base64FromBytes,
	base64UrlFromBytes,
	bytesFromBase64,
	bytesFromBase64Url,
} from "#security/lib/base64";
import { utf8Bytes } from "#security/lib/utf8";

const awkward = new Uint8Array([251, 255, 191, 0, 1]);

describe("base64", () => {
	it("encodes with padding", () => {
		expect(base64FromBytes(utf8Bytes("hello"))).toBe("aGVsbG8=");
	});

	it("round-trips every byte value", () => {
		const all = Uint8Array.from({ length: 256 }, (_, index) => index);
		expect(bytesFromBase64(base64FromBytes(all))).toStrictEqual(all);
	});

	it("reads text that is not base64 as null", () => {
		expect(bytesFromBase64("not base64!")).toBeNull();
	});
});

describe("base64url", () => {
	it("uses the URL-safe alphabet without padding", () => {
		expect(base64FromBytes(awkward)).toBe("+/+/AAE=");
		expect(base64UrlFromBytes(awkward)).toBe("-_-_AAE");
	});

	it("round-trips", () => {
		expect(bytesFromBase64Url(base64UrlFromBytes(awkward))).toStrictEqual(
			awkward,
		);
	});

	it("refuses the standard alphabet and padding", () => {
		expect(bytesFromBase64Url("+/+/AAE")).toBeNull();
		expect(bytesFromBase64Url("-_-_AAE=")).toBeNull();
	});
});
