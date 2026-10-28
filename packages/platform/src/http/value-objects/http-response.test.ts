import { describe, expect, it } from "bun:test";
import { Effect, Schema } from "effect";
import { HttpResponse } from "#http/value-objects/http-response";

function answer(
	fields: Partial<{ status: number; body: string; truncated: boolean }> = {},
) {
	return new HttpResponse({
		url: "https://api.partner.test/",
		status: fields.status ?? 200,
		contentType: "application/json",
		body: new TextEncoder().encode(fields.body ?? '{"id":1}'),
		truncated: fields.truncated ?? false,
	});
}

const Payload = Schema.Struct({ id: Schema.Number });

describe("HttpResponse", () => {
	it("decodes a JSON body with a schema", async () => {
		expect(await Effect.runPromise(answer().json(Payload))).toEqual({ id: 1 });
	});

	it.each([
		["not JSON", "<html>"],
		["JSON of another shape", '{"id":"one"}'],
	])("fails undecodable on a body that is %s", async (_, body) => {
		const error = await Effect.runPromise(
			answer({ body }).json(Payload).pipe(Effect.flip),
		);
		expect(error.reason).toBe("undecodable");
	});

	it.each([
		["status", { status: 503 }],
		["truncated", { truncated: true }],
	] as const)("ensureSuccess fails %s", async (reason, fields) => {
		const error = await Effect.runPromise(
			answer(fields).ensureSuccess().pipe(Effect.flip),
		);
		expect(error.reason).toBe(reason);
	});
});
