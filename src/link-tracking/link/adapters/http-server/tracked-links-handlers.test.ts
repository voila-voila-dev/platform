import { describe, expect, it } from "bun:test";
import { Effect, Layer } from "effect";
import { HttpRouter, HttpServer, HttpServerRequest } from "effect/http";
import { HttpApi, HttpApiBuilder, HttpApiMiddleware } from "effect/http-api";
import { ReadOnlyActor } from "#core/actor/read-only-actor";
import { StaffActor } from "#core/actor/staff-actor";
import { countingSecureRandom } from "#core/adapters/memory/counting-secure-random";
import { incrementingIdGenerator } from "#core/adapters/memory/incrementing-id-generator";
import { UserId } from "#core/ids/user-id";
import { CurrentActor } from "#core/services/current-actor";
import { trackedLinksHandlers } from "#link-tracking/link/adapters/http-server/tracked-links-handlers";
import { inMemoryTrackedLinkRepository } from "#link-tracking/link/adapters/memory/in-memory-tracked-link-repository";
import { TrackedLinksApiGroup } from "#link-tracking/link/http/tracked-links-api";
import { stubRateLimiter } from "#rate-limiting/adapters/memory/stub-rate-limiter";

class Authentication extends HttpApiMiddleware.Service<
	Authentication,
	{ provides: CurrentActor }
>()("test/Authentication") {}

const staff = new StaffActor({
	userId: UserId.make("00000000-0000-0000-0000-0000000000a1"),
});

const authenticationLayer = Layer.succeed(Authentication, (httpEffect) =>
	Effect.gen(function* () {
		const request = yield* HttpServerRequest.HttpServerRequest;
		const actor =
			request.headers.authorization === "Bearer staff"
				? staff
				: new ReadOnlyActor();
		return yield* Effect.provideService(httpEffect, CurrentActor, actor);
	}),
);

const Api = HttpApi.make("test").add(
	TrackedLinksApiGroup.middleware(Authentication),
);

const handlersLayer = HttpApiBuilder.group(Api, "trackedLinks", (handlers) =>
	handlers
		.handle("search", trackedLinksHandlers.search)
		.handle("create", trackedLinksHandlers.create)
		.handle("update", trackedLinksHandlers.update)
		.handle("archive", trackedLinksHandlers.archive),
);

function server() {
	const repository = inMemoryTrackedLinkRepository();
	const services = Layer.mergeAll(
		repository.layer,
		incrementingIdGenerator().layer,
		countingSecureRandom({ prefix: "code-" }),
		stubRateLimiter(),
	);
	const { handler, dispose } = HttpRouter.toWebHandler(
		HttpApiBuilder.layer(Api).pipe(
			Layer.provide(handlersLayer),
			HttpRouter.provideRequest(services),
			Layer.provide(authenticationLayer),
			Layer.provide(HttpServer.layerServices),
		),
		{ disableLogger: true },
	);
	function post(path: string, body: unknown, authorization?: string) {
		return handler(
			new Request(`http://test${path}`, {
				method: "POST",
				headers: {
					"content-type": "application/json",
					...(authorization === undefined ? {} : { authorization }),
				},
				body: JSON.stringify(body),
			}),
		);
	}
	return { post, dispose };
}

describe("trackedLinksHandlers", () => {
	it("runs the use cases as the actor the application's middleware provides", async () => {
		const { post, dispose } = server();

		const created = await post(
			"/tracked-links/create",
			{ label: "Flyer", destinationUrl: "https://x.test/a" },
			"Bearer staff",
		);
		const searched = await post(
			"/tracked-links/search",
			{ filter: {}, pagination: { take: 10, skip: 0 } },
			"Bearer staff",
		);
		await dispose();

		expect(created.status).toBe(200);
		expect(await created.json()).toMatchObject({
			label: "Flyer",
			code: "code-1",
		});
		expect(await searched.json()).toMatchObject({ total: 1 });
	});

	it("answers 403 to an actor the gate refuses, and 404 to an unknown link", async () => {
		const { post, dispose } = server();

		const denied = await post("/tracked-links/create", {
			label: "Flyer",
			destinationUrl: "https://x.test/a",
		});
		const missing = await post(
			"/tracked-links/archive",
			{ id: "00000000-0000-0000-0000-0000000000ff" },
			"Bearer staff",
		);
		await dispose();

		expect(denied.status).toBe(403);
		expect(missing.status).toBe(404);
	});
});
