import { Effect, Schema } from "effect";
import { Actor } from "#core/actor/actor";
import type { Gate } from "#core/authorization/gate";
import type { WithActor } from "#core/authorization/gates";
import { UseCase } from "#core/use-case/make-use-case";
import { consumeSearchBudget } from "#search/lib/consume-search-budget";
import { Pagination } from "#search/value-objects/pagination";

export function makeSearchUseCase<
	Name extends string,
	FilterFields extends Schema.Struct.Fields,
	Result,
	SearchError,
	SearchContext,
	RepositoryContext,
>(options: {
	readonly name: Name;
	readonly gate: Gate<WithActor>;
	readonly budget: string;
	readonly filter: Schema.Struct<FilterFields>;
	readonly repository: Effect.Effect<
		{
			readonly search: (
				filter: Schema.Struct.Type<FilterFields>,
				pagination: Pagination,
			) => Effect.Effect<Result, SearchError, SearchContext>;
		},
		never,
		RepositoryContext
	>;
}) {
	return UseCase.make({
		name: options.name,
		input: Schema.Struct({
			actor: Actor,
			payload: Schema.Struct({
				filter: options.filter,
				pagination: Pagination,
				ipAddress: Schema.optional(Schema.NullOr(Schema.String)),
			}),
		}),
		gate: options.gate,
		execute: ({ actor, payload }) =>
			Effect.gen(function* () {
				yield* consumeSearchBudget(
					options.budget,
					actor,
					payload.ipAddress ?? null,
				);

				const repository = yield* options.repository;
				return yield* repository.search(payload.filter, payload.pagination);
			}),
	});
}
