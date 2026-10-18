import { describe, expect, it } from "bun:test";
import { DateTime, Effect, Layer } from "effect";
import { HttpServerResponse } from "effect/http";
import { incrementingIdGenerator } from "#core/adapters/memory/incrementing-id-generator";
import { redirectToLink } from "#link-tracking/click/adapters/http-server/redirect-to-link";
import { inMemoryLinkClickRepository } from "#link-tracking/click/adapters/memory/in-memory-link-click-repository";
import { inMemoryTrackedLinkRepository } from "#link-tracking/link/adapters/memory/in-memory-tracked-link-repository";
import { TrackedLink } from "#link-tracking/link/aggregates/tracked-link";
import { LinkCode } from "#link-tracking/link/value-objects/link-code";
import { TrackedLinkId } from "#link-tracking/link/value-objects/tracked-link-id";

const createdAt = DateTime.fromDateUnsafe(new Date("2026-10-01T00:00:00Z"));

function link(code: string, destinationUrl: string, archived = false) {
	return new TrackedLink({
		id: TrackedLinkId.make(
			`00000000-0000-0000-0000-${String(code.length).padStart(12, "0")}`,
		),
		code: LinkCode.make(code),
		destinationUrl,
		label: null,
		context: null,
		archivedAt: archived ? createdAt : null,
		createdAt,
	});
}

const options = {
	attributingOrigins: ["https://shop.example.com"],
	queryParameter: "click",
};

function visit(code: string, seed: ReadonlyArray<TrackedLink>) {
	const links = inMemoryTrackedLinkRepository();
	const clicks = inMemoryLinkClickRepository();
	links.seed(seed);
	const response = Effect.runSync(
		redirectToLink({ code, userAgent: "agent", referrer: null }, options).pipe(
			Effect.provide(
				Layer.mergeAll(
					links.layer,
					clicks.layer,
					incrementingIdGenerator().layer,
				),
			),
		),
	);
	return { response, clicks: clicks.values() };
}

describe("redirectToLink", () => {
	it("records the click and redirects, handing its id to an attributing origin", () => {
		const { response, clicks } = visit("abc", [
			link("abc", "https://shop.example.com/sale"),
		]);

		expect(response.status).toBe(302);
		expect(response.headers.location).toBe(
			"https://shop.example.com/sale?click=00000000-0000-0000-0000-000000000001",
		);
		expect(clicks).toHaveLength(1);
		expect(clicks[0]?.userAgent).toBe("agent");
	});

	it("answers 404 and records nothing for an unknown, archived or non-web link", () => {
		for (const [code, seed] of [
			["nope", []],
			["old", [link("old", "https://x.test", true)]],
			["js", [link("js", "javascript:alert(1)")]],
		] as const) {
			const { response, clicks } = visit(code, seed);
			expect(HttpServerResponse.isHttpServerResponse(response)).toBe(true);
			expect(response.status).toBe(404);
			expect(clicks).toHaveLength(0);
		}
	});
});
