import { describe, expect, it } from "bun:test";
import { Effect, Redacted } from "effect";
import { dataForSeoSearchEngine } from "#search-engine/adapters/dataforseo/dataforseo-search-engine";
import {
	SearchEngine,
	type SearchEngineQuery,
} from "#search-engine/services/search-engine";

const OK = 20_000;

interface RecordedCall {
	readonly headers: Headers;
	readonly body: unknown;
}

function engineAnswering(answer: () => unknown) {
	const calls: Array<RecordedCall> = [];
	const fetchStub = Object.assign(
		async (_input: string | URL | Request, init?: RequestInit) => {
			calls.push({
				headers: new Headers(init?.headers),
				body: JSON.parse(String(init?.body)),
			});
			const result = answer();
			return result instanceof Response
				? result
				: Response.json(result, { status: 200 });
		},
		{ preconnect: fetch.preconnect },
	);
	const layer = dataForSeoSearchEngine({
		login: "user@example.com",
		password: Redacted.make("secret"),
		fetch: fetchStub,
	});
	function search(
		query: string,
		resultCount: number,
		where: Pick<SearchEngineQuery, "locale" | "country"> = {
			locale: "fr-FR",
			country: "FR",
		},
	) {
		return SearchEngine.use((engine) =>
			engine.search({ query, resultCount, ...where }),
		).pipe(Effect.provide(layer));
	}
	return { calls, search };
}

function answerWithItems(items: ReadonlyArray<Record<string, unknown>>) {
	return {
		status_code: OK,
		tasks: [{ status_code: OK, result: [{ items }] }],
	};
}

describe("dataForSeoSearchEngine", () => {
	it("keeps only organic items, capped at resultCount", async () => {
		const engine = engineAnswering(() =>
			answerWithItems([
				{ type: "paid", url: "https://ad.example.com" },
				{
					type: "organic",
					url: "https://club-a.fr",
					title: "Club A",
					description: "Le club A",
				},
				{ type: "organic", url: "https://club-b.fr" },
				{ type: "organic", url: "https://club-c.fr", title: "Club C" },
			]),
		);

		const results = await Effect.runPromise(engine.search("club olympique", 2));

		expect(results).toEqual([
			{ url: "https://club-a.fr", title: "Club A", description: "Le club A" },
			{ url: "https://club-b.fr", title: "", description: "" },
		]);
		expect(engine.calls[0]?.headers.get("authorization")).toBe(
			`Basic ${btoa("user@example.com:secret")}`,
		);
		expect(engine.calls[0]?.body).toEqual([
			{
				keyword: "club olympique",
				location_code: 2250,
				language_code: "fr",
				depth: 10,
			},
		]);
	});

	it("searches from the country, in the locale's language", async () => {
		const engine = engineAnswering(() => answerWithItems([]));

		await Effect.runPromise(
			engine.search("club", 3, { locale: "en-US", country: "BE" }),
		);
		await Effect.runPromise(
			engine.search("club", 3, { locale: "zh-CN", country: "TW" }),
		);

		expect(engine.calls.map(({ body }) => body)).toMatchObject([
			[{ location_code: 2056, language_code: "en" }],
			[{ location_code: 2158, language_code: "zh-TW" }],
		]);
	});

	it("fails on a task failure inside a 200 response", async () => {
		const engine = engineAnswering(() => ({
			status_code: OK,
			tasks: [{ status_code: 40_501, status_message: "Invalid Field" }],
		}));

		const error = await Effect.runPromise(
			Effect.flip(engine.search("club", 3)),
		);

		expect(error._tag).toBe("SearchEngineError");
		expect(error.reason).toBe("task 40501: Invalid Field");
	});

	it("fails on an HTTP failure", async () => {
		const engine = engineAnswering(() => new Response("nope", { status: 500 }));

		const error = await Effect.runPromise(
			Effect.flip(engine.search("club", 3)),
		);

		expect(error._tag).toBe("SearchEngineError");
		expect(error.reason).toContain("500");
	});
});
