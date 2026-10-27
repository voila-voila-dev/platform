import { describe, expect, it } from "bun:test";
import { hmac } from "#http/webhooks/lib/hmac";
import { verifyStripeSignature } from "#http/webhooks/lib/stripe-signature";
import { hexFromBytes } from "#security/lib/hex";

const SECRET = "whsec_test_stripe_secret";
const NOW_SECONDS = 1_800_000_000;
const PAYLOAD = '{"type":"checkout.session.completed"}';

async function validHeader(payload: string, timestamp = NOW_SECONDS) {
	const signature = hexFromBytes(await hmac(SECRET, `${timestamp}.${payload}`));
	return `t=${timestamp},v1=${signature}`;
}

function verify(
	overrides: Partial<Parameters<typeof verifyStripeSignature>[0]> & {
		readonly header: string | undefined;
	},
) {
	return verifyStripeSignature({
		payload: PAYLOAD,
		secret: SECRET,
		nowSeconds: NOW_SECONDS,
		...overrides,
	});
}

describe("verifyStripeSignature", () => {
	it("accepts a correctly signed payload", async () => {
		expect(await verify({ header: await validHeader(PAYLOAD) })).toBe(true);
	});

	it("accepts a header carrying several v1 entries, as during a rotation", async () => {
		const header = `v1=notthisone,${await validHeader(PAYLOAD)}`;
		expect(await verify({ header })).toBe(true);
	});

	it("rejects a payload altered after signing", async () => {
		expect(
			await verify({
				header: await validHeader(PAYLOAD),
				payload: '{"type":"checkout.session.expired"}',
			}),
		).toBe(false);
	});

	it("rejects a signature keyed with a different secret", async () => {
		expect(
			await verify({
				header: await validHeader(PAYLOAD),
				secret: "whsec_other",
			}),
		).toBe(false);
	});

	// A captured webhook stays perfectly signed forever; only the clock stops it.
	it("rejects a replay from beyond the tolerance window, unless widened", async () => {
		const header = await validHeader(PAYLOAD, NOW_SECONDS - 4000);
		expect(await verify({ header })).toBe(false);
		expect(await verify({ header, toleranceSeconds: 10_000 })).toBe(true);
	});

	// An unconfigured environment must not accidentally accept everything.
	it("rejects everything when no secret is configured", async () => {
		expect(
			await verify({ header: await validHeader(PAYLOAD), secret: "" }),
		).toBe(false);
	});

	it.each([undefined, `t=${NOW_SECONDS}`, "v1=abc", "not-a-valid-header"])(
		"rejects the header %p rather than throwing",
		async (header) => {
			expect(await verify({ header })).toBe(false);
		},
	);
});
