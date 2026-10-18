import { Effect, Exit, Metric, Option, Schema } from "effect";
import { AccessDeniedError } from "#core/authorization/access-denied-error";

export type UnitKind = "usecase" | "job" | "subscriber";

export type UnitOutcome = "ok" | "failed" | "denied";

export const UNIT_OUTCOME_ATTRIBUTE = "unit.outcome";

export const unitRuns = Metric.counter("unit_runs_total", {
	description: "Unit executions, tagged by kind, name and outcome.",
});

export const unitDuration = Metric.timer("unit_duration", {
	description: "Unit execution time, tagged by kind and name.",
});

const isAccessDenied = Schema.is(AccessDeniedError);

function outcomeOf(exit: Exit.Exit<unknown, unknown>): UnitOutcome {
	return Exit.isFailure(exit)
		? Option.match(Exit.findErrorOption(exit), {
				onNone: () => "failed" as const,
				onSome: (error) => (isAccessDenied(error) ? "denied" : "failed"),
			})
		: "ok";
}

export interface UnitMetrics {
	readonly track: <A, E, R>(
		effect: Effect.Effect<A, E, R>,
	) => Effect.Effect<A, E, R>;
}

export function unitMetrics(kind: UnitKind, name: string): UnitMetrics {
	const duration = Metric.withAttributes(unitDuration, { kind, name });
	function runs(outcome: UnitOutcome) {
		return Metric.withAttributes(unitRuns, { kind, name, outcome });
	}

	return {
		track: (effect) =>
			Effect.timed(Effect.exit(effect)).pipe(
				Effect.flatMap(([elapsed, exit]) =>
					// An interrupted run is neither an outcome nor a duration: a
					// shutdown mid-tick would otherwise read as a fast success.
					Exit.hasInterrupts(exit)
						? exit
						: Effect.all([
								Metric.update(runs(outcomeOf(exit)), 1),
								Metric.update(duration, elapsed),
								Effect.annotateCurrentSpan(
									UNIT_OUTCOME_ATTRIBUTE,
									outcomeOf(exit),
								),
							]).pipe(Effect.flatMap(() => exit)),
				),
			),
	};
}
