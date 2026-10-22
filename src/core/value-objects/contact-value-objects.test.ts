import { describe, expect, it } from "bun:test";

import { Schema } from "effect";
import { EmailAddress } from "#core/value-objects/email-address";
import { Phone } from "#core/value-objects/phone";

describe("EmailAddress", () => {
	const isEmailAddress = Schema.is(EmailAddress);

	it("accepts plus-addressed and subdomain addresses", () => {
		expect(isEmailAddress("jane.doe+news@mail.example.co")).toBe(true);
	});

	it("rejects addresses without a domain or a top-level domain", () => {
		expect(isEmailAddress("jane")).toBe(false);
		expect(isEmailAddress("jane@example")).toBe(false);
	});
});

describe("Phone", () => {
	const isPhone = Schema.is(Phone);

	it("accepts E.164 numbers", () => {
		expect(isPhone("+33612345678")).toBe(true);
	});

	it("rejects national formats and numbers out of E.164 length", () => {
		expect(isPhone("0612345678")).toBe(false);
		expect(isPhone("+0612345678")).toBe(false);
		expect(isPhone("+1234567")).toBe(false);
		expect(isPhone("+1234567890123456")).toBe(false);
	});
});
