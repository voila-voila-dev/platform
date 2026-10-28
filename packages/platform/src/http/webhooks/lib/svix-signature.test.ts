import { describe, expect, it } from "bun:test";
import { hmac } from "#http/webhooks/lib/hmac";
import { verifySvixSignature } from "#http/webhooks/lib/svix-signature";
import { base64FromBytes } from "#security/lib/base64";

const SECRET_BYTES = new Uint8Array(32).fill(7);
const SECRET = `whsec_${base64FromBytes(SECRET_BYTES)}`;
const NOW_SECONDS = 1_800_000_000;
const PAYLOAD = '{"type":"email.delivered"}';

async function validHeaders(payload: string, timestamp = NOW_SECONDS) {
	const signature = base64FromBytes(
		await hmac(SECRET_BYTES, `msg_2abc.${timestamp}.${payload}`),
	);
	return {
		id: "msg_2abc",
		timestamp: String(timestamp),
		signature: `v1,${signature}`,
	};
}

function verify(
	overrides: Partial<Parameters<typeof verifySvixSignature>[0]> & {
		readonly headers: Parameters<typeof verifySvixSignature>[0]["headers"];
	},
) {
	return verifySvixSignature({
		payload: PAYLOAD,
		secret: SECRET,
		nowSeconds: NOW_SECONDS,
		...overrides,
	});
}

describe("verifySvixSignature", () => {
	it("accepts a correctly signed payload", async () => {
		expect(await verify({ headers: await validHeaders(PAYLOAD) })).toBe(true);
	});

	it("accepts the secret without its whsec_ label", async () => {
		expect(
			await verify({
				headers: await validHeaders(PAYLOAD),
				secret: SECRET.slice("whsec_".length),
			}),
		).toBe(true);
	});

	it("accepts a header carrying several signatures, as during a rotation", async () => {
		const headers = await validHeaders(PAYLOAD);
		expect(
			await verify({
				headers: {
					...headers,
					signature: `v1,notthisone ${headers.signature}`,
				},
			}),
		).toBe(true);
	});

	it("rejects a payload altered after signing", async () => {
		expect(
			await verify({
				headers: await validHeaders(PAYLOAD),
				payload: '{"type":"email.bounced"}',
			}),
		).toBe(false);
	});

	it("rejects a signature keyed with a different secret", async () => {
		expect(
			await verify({
				headers: await validHeaders(PAYLOAD),
				secret: `whsec_${base64FromBytes(new Uint8Array(32).fill(9))}`,
			}),
		).toBe(false);
	});

	it("rejects a replay from beyond the tolerance window", async () => {
		expect(
			await verify({
				headers: await validHeaders(PAYLOAD, NOW_SECONDS - 4000),
			}),
		).toBe(false);
	});

	it("rejects missing headers, an empty secret, and a secret that is not base64", async () => {
		const headers = await validHeaders(PAYLOAD);
		expect(
			await verify({
				headers: { id: undefined, timestamp: undefined, signature: undefined },
			}),
		).toBe(false);
		expect(await verify({ headers, secret: "" })).toBe(false);
		expect(await verify({ headers, secret: "whsec_not!valid!base64!" })).toBe(
			false,
		);
	});
});
