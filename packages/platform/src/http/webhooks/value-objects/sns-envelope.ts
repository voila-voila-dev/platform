import { Schema } from "effect";

/** The JSON body Amazon SNS posts to an HTTPS subscription, raw message delivery off. */
export const SnsEnvelope = Schema.Struct({
	Type: Schema.String,
	MessageId: Schema.String,
	TopicArn: Schema.String,
	Message: Schema.String,
	Timestamp: Schema.String,
	SignatureVersion: Schema.String,
	Signature: Schema.String,
	SigningCertURL: Schema.String,
	Subject: Schema.optional(Schema.String),
	SubscribeURL: Schema.optional(Schema.String),
	Token: Schema.optional(Schema.String),
});

export type SnsEnvelope = typeof SnsEnvelope.Type;
