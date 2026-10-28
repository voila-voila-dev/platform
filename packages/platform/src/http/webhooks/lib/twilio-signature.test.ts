import { describe, expect, it } from "bun:test";
import {
	twilioSignature,
	verifyTwilioSignature,
} from "#http/webhooks/lib/twilio-signature";

// The vector from Twilio's own "Validating requests" documentation.
const URL_WITH_QUERY = "https://mycompany.com/myapp.php?foo=1&bar=2";
const PARAMS = {
	CallSid: "CA1234567890ABCDE",
	Caller: "+12349013030",
	Digits: "1234",
	From: "+12349013030",
	To: "+18005551212",
};
const AUTH_TOKEN = "12345";
const DOCUMENTED_SIGNATURE = "0/KCTR6DLpKmkAf8muzZqo1nDgQ=";

function verify(
	overrides: Partial<Parameters<typeof verifyTwilioSignature>[0]> = {},
) {
	return verifyTwilioSignature({
		url: URL_WITH_QUERY,
		params: PARAMS,
		authToken: AUTH_TOKEN,
		signature: DOCUMENTED_SIGNATURE,
		...overrides,
	});
}

describe("twilioSignature", () => {
	it("reproduces the signature Twilio documents", async () => {
		expect(
			await twilioSignature({
				url: URL_WITH_QUERY,
				params: PARAMS,
				authToken: AUTH_TOKEN,
			}),
		).toBe(DOCUMENTED_SIGNATURE);
	});

	it("signs URLSearchParams the same as a record, whatever their order", async () => {
		const shuffled = new URLSearchParams([
			["To", PARAMS.To],
			["Digits", PARAMS.Digits],
			["CallSid", PARAMS.CallSid],
			["From", PARAMS.From],
			["Caller", PARAMS.Caller],
		]);
		expect(
			await twilioSignature({
				url: URL_WITH_QUERY,
				params: shuffled,
				authToken: AUTH_TOKEN,
			}),
		).toBe(DOCUMENTED_SIGNATURE);
	});
});

describe("verifyTwilioSignature", () => {
	it("accepts the documented request", async () => {
		expect(await verify()).toBe(true);
	});

	it("accepts a signature computed over the URL with its default port spelled out", async () => {
		const signedWithPort = await twilioSignature({
			url: "https://mycompany.com:443/myapp.php?foo=1&bar=2",
			params: PARAMS,
			authToken: AUTH_TOKEN,
		});
		expect(signedWithPort).not.toBe(DOCUMENTED_SIGNATURE);
		expect(await verify({ signature: signedWithPort })).toBe(true);
	});

	it("rejects a tampered parameter, another URL, or another token", async () => {
		expect(await verify({ params: { ...PARAMS, Digits: "9999" } })).toBe(false);
		expect(
			await verify({ url: "https://mycompany.com/myapp.php?bar=2&foo=1" }),
		).toBe(false);
		expect(await verify({ authToken: "54321" })).toBe(false);
	});

	it("rejects a missing header, an empty token, and an unparseable URL", async () => {
		expect(await verify({ signature: undefined })).toBe(false);
		expect(await verify({ authToken: "" })).toBe(false);
		expect(await verify({ url: "not a url" })).toBe(false);
	});
});
