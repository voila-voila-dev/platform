import { describe, expect, it } from "bun:test";
import { Schema } from "effect";
import { answerField } from "#http/lib/answer-field";

const Answer = Schema.Struct({ name: answerField(Schema.String) });
const decode = Schema.decodeUnknownSync(Answer);

describe("answerField", () => {
	it("accepts the field present, null, or left out", () => {
		expect(decode({ name: "Acme" })).toEqual({ name: "Acme" });
		expect(decode({ name: null })).toEqual({ name: null });
		expect(decode({})).toEqual({});
	});

	it("still refuses a value of another type", () => {
		expect(() => decode({ name: 42 })).toThrow();
	});
});
