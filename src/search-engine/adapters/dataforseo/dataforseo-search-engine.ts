import { Duration, Effect, Layer, Redacted, Schema } from "effect";
import { SearchEngineError } from "#search-engine/errors/search-engine-error";
import { SearchEngine } from "#search-engine/services/search-engine";
import { SearchEngineResult } from "#search-engine/value-objects/search-engine-result";

const ENDPOINT =
	"https://api.dataforseo.com/v3/serp/google/organic/live/advanced";

const OK = 20_000;

function answerField<Field extends Schema.Top>(field: Field) {
	return Schema.optionalKey(Schema.NullOr(field));
}

const OrganicItem = Schema.Struct({
	type: answerField(Schema.String),
	url: answerField(Schema.String),
	title: answerField(Schema.String),
	description: answerField(Schema.String),
});

const Status = {
	status_code: answerField(Schema.Number),
	status_message: answerField(Schema.String),
};

const DataForSeoAnswer = Schema.Struct({
	...Status,
	tasks: answerField(
		Schema.Array(
			Schema.Struct({
				...Status,
				result: answerField(
					Schema.Array(
						Schema.Struct({ items: answerField(Schema.Array(OrganicItem)) }),
					),
				),
			}),
		),
	),
});

type DataForSeoAnswer = typeof DataForSeoAnswer.Type;

function statusFailure(
	level: string,
	status: Pick<DataForSeoAnswer, "status_code" | "status_message">,
) {
	return status.status_code === OK
		? null
		: `${level} ${status.status_code}: ${status.status_message ?? "unknown"}`;
}

// DataForSEO reports failures inside a 200 response, for the call or for the task.
function failureIn(answer: DataForSeoAnswer) {
	const task = answer.tasks?.[0];
	return (
		statusFailure("api", answer) ??
		(task === undefined ? "api returned no task" : statusFailure("task", task))
	);
}

function organicResults(answer: DataForSeoAnswer, resultCount: number) {
	return (answer.tasks?.[0]?.result?.[0]?.items ?? [])
		.flatMap((item) =>
			item.type === "organic" && typeof item.url === "string"
				? [
						new SearchEngineResult({
							url: item.url,
							title: item.title ?? "",
							description: item.description ?? "",
						}),
					]
				: [],
		)
		.slice(0, resultCount);
}

export interface DataForSeoSearchEngineOptions {
	readonly login: string;
	readonly password: Redacted.Redacted<string>;
	/** A DataForSEO location, such as 2250 for France: the same query gives another SERP elsewhere. */
	readonly locationCode: number;
	readonly languageCode: string;
	readonly timeout?: Duration.Input;
	readonly endpoint?: string;
	readonly fetch?: typeof fetch;
}

export function dataForSeoSearchEngine(options: DataForSeoSearchEngineOptions) {
	const fetchFunction = options.fetch ?? fetch;
	const endpoint = options.endpoint ?? ENDPOINT;
	const timeoutMillis = Duration.toMillis(options.timeout ?? "15 seconds");
	const authorization = `Basic ${btoa(`${options.login}:${Redacted.value(options.password)}`)}`;
	const decodeAnswer = Schema.decodeUnknownSync(DataForSeoAnswer);

	return Layer.succeed(SearchEngine, {
		search: ({ query, resultCount }) =>
			Effect.tryPromise({
				try: async () => {
					const response = await fetchFunction(endpoint, {
						method: "POST",
						headers: { authorization, "content-type": "application/json" },
						body: JSON.stringify([
							{
								keyword: query,
								location_code: options.locationCode,
								language_code: options.languageCode,
								depth: Math.max(resultCount, 10),
							},
						]),
						signal: AbortSignal.timeout(timeoutMillis),
					});
					if (!response.ok) {
						throw new Error(
							`DataForSEO ${response.status}: ${await response.text()}`,
						);
					}
					return decodeAnswer(await response.json());
				},
				catch: (cause) =>
					new SearchEngineError({ query, reason: String(cause) }),
			}).pipe(
				Effect.flatMap((answer) => {
					const failure = failureIn(answer);
					return failure === null
						? Effect.succeed(organicResults(answer, resultCount))
						: Effect.fail(new SearchEngineError({ query, reason: failure }));
				}),
				Effect.withSpan("outbound.dataforseo.organicSearch", {
					attributes: {
						partner: "dataforseo",
						"search.location_code": options.locationCode,
						"search.language_code": options.languageCode,
					},
				}),
			),
	});
}
