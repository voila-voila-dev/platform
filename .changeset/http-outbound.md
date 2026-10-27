---
"@voila.dev/platform": minor
---

`/http` gains what `@voila.dev/http` gave tries: the `Fetch` type and `globalFetch`, the `OutboundFetch` reference with `outboundFetch(partner)` and `outboundHttpClientLayer(partner)`, `RetryPolicy`/`retryPolicy`, `OutboundTimeout`, `answerField`, and request recording (`recordingFetch`, `RecordedRequest`, `RequestOutcome`; failures are masked with `redactPii` by default). The new `/http/webhooks` checks Stripe, Svix, Twilio and SNS signatures. `/security` gains `@voila.dev/crypto`'s byte helpers (`constantTimeEquals`, `hexFromBytes`, `utf8Bytes`, `textFromUtf8`, base64 and base64url) and `TokenDigest`/`tokenDigest`.

Breaking: `Fetch` is no longer exported from `/http/bun`; import it from `/http`.
