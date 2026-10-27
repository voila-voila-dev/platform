import { describe, expect, it } from "bun:test";
import { publicKeyFromPem } from "#http/webhooks/lib/certificate-public-key";
import { testCertificate } from "#http/webhooks/lib/test-certificate.test-helper";

const certificate = await testCertificate();

describe("publicKeyFromPem", () => {
	it("reads the public key out of a certificate", () => {
		expect(publicKeyFromPem(certificate.certificatePem)).toEqual(
			new Uint8Array(certificate.spki),
		);
	});

	it("takes a bare public key as it is", () => {
		expect(publicKeyFromPem(certificate.publicKeyPem)).toEqual(
			new Uint8Array(certificate.spki),
		);
	});

	it("throws on anything else", () => {
		expect(() => publicKeyFromPem("not a pem")).toThrow();
		expect(() =>
			publicKeyFromPem(
				"-----BEGIN CERTIFICATE-----\nAAAA\n-----END CERTIFICATE-----",
			),
		).toThrow();
	});
});
