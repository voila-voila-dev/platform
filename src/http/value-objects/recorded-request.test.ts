import { describe, expect, it } from "bun:test";
import { Schema } from "effect";
import { RecordedRequest } from "#http/value-objects/recorded-request";

const row = {
	id: "0001",
	partner: "acme",
	method: "POST",
	host: "api.acme.test",
	path: "/v1/charges",
	status: null,
	outcome: "failed",
	durationMilliseconds: 30_000,
	failure: "TimeoutError: The operation timed out.",
	providerRequestId: null,
	startedAt: "2026-01-01T00:00:00.000Z",
};

describe("RecordedRequest", () => {
	it("round-trips through its encoded form, for a recorder that stores rows", () => {
		const request = Schema.decodeUnknownSync(
			Schema.toCodecJson(RecordedRequest),
		)(row);

		expect(
			Schema.encodeSync(Schema.toCodecJson(RecordedRequest))(request),
		).toEqual(row);
	});

	it("refuses an outcome it does not know", () => {
		expect(() =>
			Schema.decodeUnknownSync(Schema.toCodecJson(RecordedRequest))({
				...row,
				outcome: "maybe",
			}),
		).toThrow();
	});
});
