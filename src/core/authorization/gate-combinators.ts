import { Effect } from "effect";
import { AccessDeniedError } from "#core/authorization/access-denied-error";
import type { Gate } from "#core/authorization/gate";

function joinLabels(gates: ReadonlyArray<Gate<never>>, word: string): string {
	return gates.map((gate) => gate.label).join(` ${word} `);
}

export function either<I>(...gates: ReadonlyArray<Gate<I>>): Gate<I> {
	return {
		label: joinLabels(gates, "or"),
		permissions: gates.flatMap((gate) => gate.permissions),
		check: (input) =>
			gates.reduce<Effect.Effect<void, AccessDeniedError>>(
				(attempt, gate) => Effect.catch(attempt, () => gate.check(input)),
				Effect.fail(new AccessDeniedError()),
			),
	};
}

export function all<I>(...gates: ReadonlyArray<Gate<I>>): Gate<I> {
	return {
		label: joinLabels(gates, "and"),
		permissions: gates.flatMap((gate) => gate.permissions),
		check: (input) =>
			Effect.forEach(gates, (gate) => gate.check(input), { discard: true }),
	};
}

export function gateHolds<I>(
	gate: Gate<I, AccessDeniedError>,
	input: I,
): Effect.Effect<boolean> {
	return gate.check(input).pipe(
		Effect.as(true),
		Effect.catch(() => Effect.succeed(false)),
	);
}
