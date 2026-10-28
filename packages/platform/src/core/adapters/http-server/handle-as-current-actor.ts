import { Effect, Schema } from "effect";
import type { Actor } from "#core/actor/actor";
import { DatabaseError } from "#core/errors/database-error";
import { CurrentActor } from "#core/services/current-actor";

const isDatabaseError = Schema.is(DatabaseError);

// A failing database is the server's fault, not the caller's: it answers 500
// rather than appearing in every endpoint's error schema.
export function handleAsCurrentActor<Payload, A, E, R>(useCase: {
	readonly execute: (input: {
		readonly actor: Actor;
		readonly payload: Payload;
	}) => Effect.Effect<A, E, R>;
}) {
	return ({ payload }: { readonly payload: Payload }) =>
		Effect.gen(function* () {
			const actor = yield* CurrentActor;
			return yield* useCase.execute({ actor, payload });
		}).pipe(Effect.catchIf(isDatabaseError, Effect.die));
}
