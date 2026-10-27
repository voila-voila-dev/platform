import { describe, expect, it } from "bun:test";
import {
	isSnsUrl,
	snsStringToSign,
	verifySnsSignature,
} from "#http/webhooks/lib/sns-signature";
import { testCertificate } from "#http/webhooks/lib/test-certificate.test-helper";
import type { SnsEnvelope } from "#http/webhooks/value-objects/sns-envelope";
import { base64FromBytes } from "#security/lib/base64";
import { utf8Bytes } from "#security/lib/utf8";

const certificate = await testCertificate();
const CERTIFICATE_URL =
	"https://sns.eu-west-3.amazonaws.com/SimpleNotificationService-test.pem";
const TOPIC_ARN = "arn:aws:sns:eu-west-3:123456789012:email-events";

async function signed(
	fields: Omit<
		SnsEnvelope,
		"Signature" | "SignatureVersion" | "SigningCertURL"
	>,
): Promise<SnsEnvelope> {
	const unsigned = {
		...fields,
		SignatureVersion: "2",
		SigningCertURL: CERTIFICATE_URL,
		Signature: "",
	};
	const signature = await crypto.subtle.sign(
		"RSASSA-PKCS1-v1_5",
		certificate.privateKey,
		utf8Bytes(snsStringToSign(unsigned) ?? ""),
	);
	return { ...unsigned, Signature: base64FromBytes(signature) };
}

const notification = await signed({
	Type: "Notification",
	MessageId: "22b80b92-fdea-4c2c-8f9d-bdfb0c7bf324",
	TopicArn: TOPIC_ARN,
	Message: '{"eventType":"Delivery"}',
	Timestamp: "2026-10-03T12:00:00.000Z",
});

function verify(envelope: SnsEnvelope, region = "eu-west-3") {
	const fetched: Array<string> = [];
	const result = verifySnsSignature({
		envelope,
		region,
		fetchCertificate: async (url) => {
			fetched.push(url);
			return certificate.certificatePem;
		},
	});
	return { result, fetched };
}

describe("snsStringToSign", () => {
	it("lists a notification's fields in SNS's order, leaving out an absent subject", () => {
		expect(snsStringToSign(notification)).toBe(
			`Message\n{"eventType":"Delivery"}\nMessageId\n22b80b92-fdea-4c2c-8f9d-bdfb0c7bf324\nTimestamp\n2026-10-03T12:00:00.000Z\nTopicArn\n${TOPIC_ARN}\nType\nNotification\n`,
		);
	});

	it("signs nothing for a type SNS does not send", () => {
		expect(snsStringToSign({ ...notification, Type: "Other" })).toBeNull();
	});
});

describe("verifySnsSignature", () => {
	it("accepts an envelope signed by the certificate it names", async () => {
		const { result, fetched } = verify(notification);
		expect(await result).toBe(true);
		expect(fetched).toEqual([CERTIFICATE_URL]);
	});

	it("accepts a signed subscription confirmation", async () => {
		const confirmation = await signed({
			Type: "SubscriptionConfirmation",
			MessageId: "m-1",
			TopicArn: TOPIC_ARN,
			Message: "You have chosen to subscribe",
			Timestamp: "2026-10-03T12:00:00.000Z",
			SubscribeURL:
				"https://sns.eu-west-3.amazonaws.com/?Action=ConfirmSubscription",
			Token: "t-1",
		});
		expect(await verify(confirmation).result).toBe(true);
	});

	it("refuses a message changed after signing", async () => {
		expect(
			await verify({ ...notification, Message: '{"eventType":"Bounce"}' })
				.result,
		).toBe(false);
	});

	it("refuses version 1, which signs with SHA-1", async () => {
		expect(
			await verify({ ...notification, SignatureVersion: "1" }).result,
		).toBe(false);
	});

	it("refuses a certificate outside the region's SNS host, without fetching it", async () => {
		const foreign = verify({
			...notification,
			SigningCertURL:
				"https://sns.eu-west-3.amazonaws.com.attacker.example/c.pem",
		});
		expect(await foreign.result).toBe(false);
		expect(foreign.fetched).toEqual([]);
		expect(await verify(notification, "eu-west-1").result).toBe(false);
	});

	it("refuses a certificate that is not one", async () => {
		const result = await verifySnsSignature({
			envelope: notification,
			region: "eu-west-3",
			fetchCertificate: async () => "<html>not found</html>",
		});
		expect(result).toBe(false);
	});
});

describe("isSnsUrl", () => {
	it("takes only https on the region's SNS host", () => {
		expect(
			isSnsUrl(
				"https://sns.eu-west-3.amazonaws.com/?Action=ConfirmSubscription",
				"eu-west-3",
			),
		).toBe(true);
		expect(isSnsUrl("http://sns.eu-west-3.amazonaws.com/", "eu-west-3")).toBe(
			false,
		);
		expect(isSnsUrl("not a url", "eu-west-3")).toBe(false);
	});
});
