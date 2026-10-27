import { publicKeyFromPem } from "#http/webhooks/lib/certificate-public-key";
import type { SnsEnvelope } from "#http/webhooks/value-objects/sns-envelope";
import { bytesFromBase64 } from "#security/lib/base64";
import { utf8Bytes } from "#security/lib/utf8";

type SignedField = keyof SnsEnvelope;

const CONFIRMATION_FIELDS: ReadonlyArray<SignedField> = [
	"Message",
	"MessageId",
	"SubscribeURL",
	"Timestamp",
	"Token",
	"TopicArn",
	"Type",
];

// https://docs.aws.amazon.com/sns/latest/dg/sns-verify-signature-of-message.html
const SIGNED_FIELDS_BY_TYPE: Readonly<
	Record<string, ReadonlyArray<SignedField>>
> = {
	Notification: [
		"Message",
		"MessageId",
		"Subject",
		"Timestamp",
		"TopicArn",
		"Type",
	],
	SubscriptionConfirmation: CONFIRMATION_FIELDS,
	UnsubscribeConfirmation: CONFIRMATION_FIELDS,
};

// Only version 2 (SHA256withRSA): version 1 signs with SHA-1.
const SIGNATURE_VERSION = "2";

/** The string SNS signs: each present field as `name\nvalue\n`, in the documented order; `null` for a type SNS does not send. */
export function snsStringToSign(envelope: SnsEnvelope): string | null {
	const fields = SIGNED_FIELDS_BY_TYPE[envelope.Type];
	if (fields === undefined) return null;
	return fields
		.filter((field) => envelope[field] !== undefined)
		.map((field) => `${field}\n${envelope[field]}\n`)
		.join("");
}

/** An `https` URL on the SNS endpoint of `region`, the only host a certificate or a confirmation link may come from. */
export function isSnsUrl(url: string, region: string): boolean {
	try {
		const parsed = new URL(url);
		return (
			parsed.protocol === "https:" &&
			parsed.hostname === `sns.${region}.amazonaws.com`
		);
	} catch {
		return false;
	}
}

async function verifiesWith(
	certificate: string,
	signature: Uint8Array<ArrayBuffer>,
	content: string,
): Promise<boolean> {
	try {
		const key = await crypto.subtle.importKey(
			"spki",
			publicKeyFromPem(certificate),
			{ name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
			false,
			["verify"],
		);
		return await crypto.subtle.verify(
			"RSASSA-PKCS1-v1_5",
			key,
			signature,
			utf8Bytes(content),
		);
	} catch {
		return false;
	}
}

/**
 * Checks an SNS envelope against the certificate it names. `fetchCertificate`
 * returns that PEM (cache it: SNS rotates it rarely). False on a mismatch, a
 * version 1 signature, or a certificate outside the region's SNS host,
 * checked before anything is fetched; a failure to fetch the certificate
 * rejects, so the caller answers 500 and SNS delivers again.
 */
export async function verifySnsSignature(input: {
	readonly envelope: SnsEnvelope;
	readonly region: string;
	readonly fetchCertificate: (url: string) => Promise<string>;
}): Promise<boolean> {
	const { envelope } = input;
	const stringToSign = snsStringToSign(envelope);
	const signature = bytesFromBase64(envelope.Signature);
	if (
		stringToSign === null ||
		signature === null ||
		envelope.SignatureVersion !== SIGNATURE_VERSION ||
		!isSnsUrl(envelope.SigningCertURL, input.region)
	) {
		return false;
	}
	const certificate = await input.fetchCertificate(envelope.SigningCertURL);
	return verifiesWith(certificate, signature, stringToSign);
}
