import { describe, expect, it } from "bun:test";
import { DateTime, Effect, Layer, Schema } from "effect";
import { ReadOnlyActor } from "#core/actor/read-only-actor";
import { StaffActor } from "#core/actor/staff-actor";
import { UserActor } from "#core/actor/user-actor";
import { countingSecureRandom } from "#core/adapters/memory/counting-secure-random";
import { incrementingIdGenerator } from "#core/adapters/memory/incrementing-id-generator";
import { UserId } from "#core/value-objects/user-id";
import { inMemoryTrackedLinkRepository } from "#link-tracking/link/adapters/memory/in-memory-tracked-link-repository";
import { TrackedLink } from "#link-tracking/link/aggregates/tracked-link";
import { ArchiveTrackedLinkUseCase } from "#link-tracking/link/use-cases/archive-tracked-link-use-case";
import { CreateTrackedLinkUseCase } from "#link-tracking/link/use-cases/create-tracked-link-use-case";
import { SearchTrackedLinksUseCase } from "#link-tracking/link/use-cases/search-tracked-links-use-case";
import { ShortenLinkUseCase } from "#link-tracking/link/use-cases/shorten-link-use-case";
import { UpdateTrackedLinkUseCase } from "#link-tracking/link/use-cases/update-tracked-link-use-case";
import { LinkCode } from "#link-tracking/link/value-objects/link-code";
import { TrackedLinkId } from "#link-tracking/link/value-objects/tracked-link-id";
import { stubRateLimiter } from "#rate-limiting/adapters/memory/stub-rate-limiter";
import { PaginationSkip } from "#search/value-objects/pagination-skip";
import { PaginationTake } from "#search/value-objects/pagination-take";

const staff = new StaffActor({
	userId: UserId.make("00000000-0000-0000-0000-0000000000a1"),
});

const pagination = {
	take: Schema.decodeSync(PaginationTake)(10),
	skip: Schema.decodeSync(PaginationSkip)(0),
};

function harness(seed: ReadonlyArray<TrackedLink> = []) {
	const repository = inMemoryTrackedLinkRepository();
	repository.seed(seed);
	const layer = Layer.mergeAll(
		repository.layer,
		incrementingIdGenerator().layer,
		countingSecureRandom({ prefix: "code-" }),
		stubRateLimiter(),
	);
	function run<A, E>(effect: Effect.Effect<A, E, Layer.Success<typeof layer>>) {
		return Effect.runPromise(Effect.provide(effect, layer));
	}
	function exit<A, E>(
		effect: Effect.Effect<A, E, Layer.Success<typeof layer>>,
	) {
		return run(Effect.exit(effect));
	}
	return { repository, run, exit };
}

function create(label: string, destinationUrl = "https://x.test/a") {
	return CreateTrackedLinkUseCase.execute({
		actor: staff,
		payload: { label, destinationUrl },
	});
}

describe("tracked-link management", () => {
	it("creates a named, active managed link with a generated code", async () => {
		const { repository, run } = harness();

		const link = await run(create("Spring flyer"));

		expect(link.label).toBe("Spring flyer");
		expect(link.destinationUrl).toBe("https://x.test/a");
		expect(link.code).toBe(LinkCode.make("code-1"));
		expect(link.context).toBeNull();
		expect(link.isArchived).toBe(false);
		expect(repository.values()).toHaveLength(1);
	});

	it("re-targets and renames without changing the code", async () => {
		const { repository, run } = harness();
		const created = await run(create("Old", "https://x.test/old"));

		const updated = await run(
			UpdateTrackedLinkUseCase.execute({
				actor: staff,
				payload: {
					id: created.id,
					label: "New",
					destinationUrl: "https://x.test/new",
				},
			}),
		);

		expect(updated.label).toBe("New");
		expect(updated.destinationUrl).toBe("https://x.test/new");
		expect(updated.code).toBe(created.code);
		expect(repository.values()).toHaveLength(1);
	});

	it("archives by stamping archivedAt, and keeps the row", async () => {
		const { repository, run } = harness();
		const created = await run(create("Flyer"));

		const archived = await run(
			ArchiveTrackedLinkUseCase.execute({
				actor: staff,
				payload: { id: created.id },
			}),
		);

		expect(archived.isArchived).toBe(true);
		expect(repository.values()).toHaveLength(1);
	});

	it("fails with TrackedLinkNotFoundError for an unknown id", async () => {
		const { exit } = harness();

		const result = await exit(
			UpdateTrackedLinkUseCase.execute({
				actor: staff,
				payload: {
					id: TrackedLinkId.make("00000000-0000-0000-0000-0000000000ff"),
					label: "x",
					destinationUrl: "https://x.test/x",
				},
			}),
		);

		expect(result).toMatchObject({
			_tag: "Failure",
			cause: { reasons: [{ error: { _tag: "TrackedLinkNotFoundError" } }] },
		});
	});

	it("searches managed links only, without the archived ones by default", async () => {
		const systemLink = new TrackedLink({
			id: TrackedLinkId.make("00000000-0000-0000-0000-0000000000f1"),
			code: LinkCode.make("sys-1"),
			destinationUrl: "https://x.test/email",
			label: null,
			context: "email:123",
			archivedAt: null,
			createdAt: DateTime.fromDateUnsafe(new Date("2026-07-18T00:00:00.000Z")),
		});
		const { run } = harness([systemLink]);
		await run(create("Managed A"));
		const managedB = await run(create("Managed B", "https://x.test/b"));
		await run(
			ArchiveTrackedLinkUseCase.execute({
				actor: staff,
				payload: { id: managedB.id },
			}),
		);

		const active = await run(
			SearchTrackedLinksUseCase.execute({
				actor: staff,
				payload: { filter: {}, pagination },
			}),
		);
		const withArchived = await run(
			SearchTrackedLinksUseCase.execute({
				actor: staff,
				payload: { filter: { includeArchived: true }, pagination },
			}),
		);

		expect(active.items.map((link) => link.label)).toStrictEqual(["Managed A"]);
		expect(withArchived.total).toBe(2);
	});

	it("lets only staff manage links, and only the system shorten one", async () => {
		const { exit } = harness();
		const customer = new UserActor({
			userId: UserId.make("00000000-0000-0000-0000-0000000000b1"),
		});

		const denied = [
			await exit(
				CreateTrackedLinkUseCase.execute({
					actor: new ReadOnlyActor(),
					payload: { label: "x", destinationUrl: "https://x.test/x" },
				}),
			),
			await exit(
				CreateTrackedLinkUseCase.execute({
					actor: customer,
					payload: { label: "x", destinationUrl: "https://x.test/x" },
				}),
			),
			await exit(
				ShortenLinkUseCase.execute({
					actor: staff,
					payload: { destinationUrl: "https://x.test/x", context: null },
				}),
			),
		];

		for (const result of denied)
			expect(result).toMatchObject({
				_tag: "Failure",
				cause: { reasons: [{ error: { _tag: "AccessDeniedError" } }] },
			});
	});
});
