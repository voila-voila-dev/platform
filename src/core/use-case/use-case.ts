import type { Effect, Schema } from "effect";
import type { AccessDeniedError } from "#core/authorization/access-denied-error";
import type { Gate } from "#core/authorization/gate";

export type UnitInput = Schema.Struct<Schema.Struct.Fields>;

export interface UseCase<
	Name extends string,
	I extends UnitInput,
	A,
	E,
	R,
	Denied extends AccessDeniedError = AccessDeniedError,
> {
	readonly name: Name;
	readonly Input: I;
	readonly gate: Gate<I["Type"], Denied>;
	readonly execute: (input: I["Type"]) => Effect.Effect<A, E | Denied, R>;
}

export type AnyUseCase = UseCase<
	string,
	// biome-ignore lint/suspicious/noExplicitAny: the input appears in `gate` and `execute` as a parameter, so a common supertype would reject every use case; a registry reads neither.
	any,
	// biome-ignore lint/suspicious/noExplicitAny: the existential a registry erases each use case to.
	any,
	// biome-ignore lint/suspicious/noExplicitAny: same existential, for the error channel.
	any,
	// biome-ignore lint/suspicious/noExplicitAny: same existential, for the requirements channel.
	any,
	// biome-ignore lint/suspicious/noExplicitAny: same existential, for whether the gate can deny.
	any
>;

export interface UseCaseDeclaration<
	Name extends string,
	I extends UnitInput,
	A,
	E,
	R,
	Denied extends AccessDeniedError,
> {
	readonly name: Name;
	readonly input: I;
	readonly gate: Gate<I["Type"], Denied>;
	readonly execute: (input: I["Type"]) => Effect.Effect<A, E, R>;
}
