import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import { scriptedHttp } from "#http/adapters/memory/scripted-http";
import { HttpError } from "#http/errors/http-error";
import { HttpService } from "#http/services/http-service";
import { httpGet } from "#http/value-objects/http-request";

const limits = { timeoutMs: 1000, maxResponseBytes: 1024 };

function get(url: string) {
	return Effect.gen(function* () {
		const http = yield* HttpService;
		return yield* http.send(httpGet(url, limits));
	});
}

describe("scriptedHttp", () => {
	it("records each request and answers what the script says", async () => {
		const http = scriptedHttp(() => ({ status: 404, body: "missing" }));
		const response = await Effect.runPromise(
			get("https://example.com").pipe(Effect.provide(http.layer)),
		);
		expect(response).toMatchObject({ status: 404, text: "missing" });
		expect(http.requests.map((request) => request.url)).toEqual([
			"https://example.com",
		]);
	});

	it("fails with the HttpError the script returns", async () => {
		const http = scriptedHttp(
			() => new HttpError({ reason: "timeout", message: "slow" }),
		);
		const error = await Effect.runPromise(
			get("https://example.com").pipe(Effect.flip, Effect.provide(http.layer)),
		);
		expect(error.reason).toBe("timeout");
	});
});
