import { Effect } from "effect";
import type { AccessDeniedError } from "#core/authorization/access-denied-error";
import { unitMetrics } from "#core/metrics/unit-metrics";
import {
	identityAttributes,
	type SpanAttributes,
} from "#core/use-case/span-attributes";
import type {
	UnitInput,
	UseCaseDeclaration,
	UseCase as UseCaseType,
} from "#core/use-case/use-case";

export interface UseCaseConstructorOptions {
	readonly annotate?: (
		input: Readonly<Record<string, unknown>>,
	) => SpanAttributes;
}

export function makeUseCaseConstructor(
	options: UseCaseConstructorOptions = {},
) {
	function make<
		Name extends string,
		I extends UnitInput,
		A,
		E,
		R,
		Denied extends AccessDeniedError = AccessDeniedError,
	>(
		declaration: UseCaseDeclaration<Name, I, A, E, R, Denied>,
	): UseCaseType<Name, I, A, E, R, Denied> {
		const metrics = unitMetrics("usecase", declaration.name);

		const execute = Effect.fn(declaration.name)((input: I["Type"]) =>
			Effect.gen(function* () {
				// Annotated before the gate: a denied call is the one worth reading back.
				yield* Effect.annotateCurrentSpan({
					use_case: declaration.name,
					...identityAttributes(input),
					...options.annotate?.(input),
				});
				yield* declaration.gate.check(input);
				return yield* declaration.execute(input);
			}).pipe(metrics.track, Effect.annotateLogs({ unit: declaration.name })),
		);

		return {
			name: declaration.name,
			Input: declaration.input,
			gate: declaration.gate,
			execute,
		};
	}

	return { make };
}

export const UseCase = makeUseCaseConstructor();

export type UseCase<
	Name extends string,
	I extends UnitInput,
	A,
	E,
	R,
	Denied extends AccessDeniedError = AccessDeniedError,
> = UseCaseType<Name, I, A, E, R, Denied>;
