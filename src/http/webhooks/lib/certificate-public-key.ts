import { bytesFromBase64 } from "#security/lib/base64";

interface DerElement {
	readonly tag: number;
	readonly start: number;
	/** Offset of the content, after the tag and length. */
	readonly contentStart: number;
	/** Offset just past the element. */
	readonly end: number;
}

function readElement(bytes: Uint8Array, offset: number): DerElement {
	const tag = bytes[offset];
	const first = bytes[offset + 1];
	if (tag === undefined || first === undefined)
		throw new Error("truncated DER");
	let length = first;
	let contentStart = offset + 2;
	if (first & 0x80) {
		const lengthBytes = first & 0x7f;
		if (lengthBytes === 0 || lengthBytes > 4)
			throw new Error("unsupported DER length");
		length = 0;
		for (let index = 0; index < lengthBytes; index += 1) {
			const byte = bytes[contentStart + index];
			if (byte === undefined) throw new Error("truncated DER");
			length = length * 256 + byte;
		}
		contentStart += lengthBytes;
	}
	const end = contentStart + length;
	if (end > bytes.length) throw new Error("truncated DER");
	return { tag, start: offset, contentStart, end };
}

const SEQUENCE = 0x30;
const EXPLICIT_VERSION = 0xa0;

/**
 * The SubjectPublicKeyInfo of a DER X.509 certificate: the seventh field of
 * `tbsCertificate` once its optional version is skipped. Web Crypto imports
 * an SPKI but not a certificate, and this is the one field needed from it;
 * the certificate's own signature is not checked here, since trust comes
 * from the https host it was fetched from.
 */
function subjectPublicKeyInfo(
	certificate: Uint8Array,
): Uint8Array<ArrayBuffer> {
	const outer = readElement(certificate, 0);
	const tbs = readElement(certificate, outer.contentStart);
	if (outer.tag !== SEQUENCE || tbs.tag !== SEQUENCE) {
		throw new Error("not a certificate");
	}
	let field = readElement(certificate, tbs.contentStart);
	if (field.tag === EXPLICIT_VERSION)
		field = readElement(certificate, field.end);
	// serialNumber, signature, issuer, validity, subject, then the key.
	for (let skipped = 0; skipped < 5; skipped += 1) {
		field = readElement(certificate, field.end);
	}
	if (field.tag !== SEQUENCE) throw new Error("not a certificate");
	return new Uint8Array(certificate.slice(field.start, field.end));
}

function pemBody(
	pem: string,
	label: string,
): Uint8Array<ArrayBuffer> | undefined {
	const match = pem.match(
		new RegExp(
			`-----BEGIN ${label}-----([\\s\\S]+?)-----END ${label}-----`,
			"u",
		),
	);
	return match?.[1] === undefined
		? undefined
		: (bytesFromBase64(match[1].replace(/\s+/gu, "")) ?? undefined);
}

/**
 * The public key of a PEM certificate, or of a PEM `PUBLIC KEY`, as SPKI
 * bytes for `crypto.subtle.importKey("spki", …)`. Throws on anything else.
 */
export function publicKeyFromPem(pem: string): Uint8Array<ArrayBuffer> {
	const certificate = pemBody(pem, "CERTIFICATE");
	if (certificate !== undefined) return subjectPublicKeyInfo(certificate);
	const publicKey = pemBody(pem, "PUBLIC KEY");
	if (publicKey !== undefined) return publicKey;
	throw new Error("neither a certificate nor a public key");
}
