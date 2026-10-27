import { base64FromBytes } from "#security/lib/base64";

function length(size: number): Array<number> {
	if (size < 0x80) return [size];
	const bytes: Array<number> = [];
	for (let rest = size; rest > 0; rest = Math.floor(rest / 256)) {
		bytes.unshift(rest % 256);
	}
	return [0x80 | bytes.length, ...bytes];
}

function der(tag: number, ...content: ReadonlyArray<Uint8Array>): Uint8Array {
	const body = content.flatMap((part) => [...part]);
	return new Uint8Array([tag, ...length(body.length), ...body]);
}

function pem(label: string, bytes: Uint8Array): string {
	const lines = base64FromBytes(bytes).match(/.{1,64}/gu) ?? [];
	return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----\n`;
}

/**
 * An RSA key pair, its public key as PEM and wrapped in a certificate-shaped
 * DER: a version, a serial, empty names and validity, the key, and a dummy
 * signature. The verifier only reads the key out of it, which is all a test
 * of that needs.
 */
export async function testCertificate() {
	const keys = await crypto.subtle.generateKey(
		{
			name: "RSASSA-PKCS1-v1_5",
			modulusLength: 2048,
			publicExponent: new Uint8Array([1, 0, 1]),
			hash: "SHA-256",
		},
		true,
		["sign", "verify"],
	);
	const spki = new Uint8Array(
		await crypto.subtle.exportKey("spki", keys.publicKey),
	);
	const empty = der(0x30);
	const tbs = der(
		0x30,
		der(0xa0, der(0x02, new Uint8Array([2]))),
		der(0x02, new Uint8Array([1])),
		empty,
		empty,
		empty,
		empty,
		spki,
	);
	const certificate = der(0x30, tbs, empty, der(0x03, new Uint8Array([0])));
	return {
		privateKey: keys.privateKey,
		spki,
		publicKeyPem: pem("PUBLIC KEY", spki),
		certificatePem: pem("CERTIFICATE", certificate),
	};
}
