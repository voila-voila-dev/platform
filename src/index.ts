export { Actor, isActor } from "#core/actor/actor";
export { type ActorMatcher, matchActor } from "#core/actor/match-actor";
export { ReadOnlyActor } from "#core/actor/read-only-actor";
export { StaffActor } from "#core/actor/staff-actor";
export { SystemActor } from "#core/actor/system-actor";
export { UserActor } from "#core/actor/user-actor";
export { AccessDeniedError } from "#core/authorization/access-denied-error";
export {
	allowAnyActor,
	requireAuthenticatedActor,
	requireSelfUserActor,
	requireStaffActor,
	requireSystemActor,
} from "#core/authorization/actor-gates";
export type { OpenGate } from "#core/authorization/gate";
export { gateHolds } from "#core/authorization/gate-combinators";
export { Gate, type WithActor } from "#core/authorization/gates";
export {
	type PermissionRef,
	permissionRef,
	renderPermissionRef,
} from "#core/authorization/permission-ref";
export {
	checked,
	PERMISSION_CHECKED_ATTRIBUTE,
	splitPermissionChecked,
} from "#core/authorization/permission-tracing";
export { DatabaseError } from "#core/errors/database-error";
export {
	UNIT_OUTCOME_ATTRIBUTE,
	type UnitKind,
	type UnitMetrics,
	type UnitOutcome,
	unitDuration,
	unitMetrics,
	unitRuns,
} from "#core/metrics/unit-metrics";
export { CurrentActor } from "#core/services/current-actor";
export { IdGenerator } from "#core/services/id-generator";
export { SecureRandom } from "#core/services/secure-random";
export {
	makeUseCaseConstructor,
	UseCase,
	type UseCaseConstructorOptions,
} from "#core/use-case/make-use-case";
export {
	identityAttributes,
	type SpanAttributes,
} from "#core/use-case/span-attributes";
export type {
	AnyUseCase,
	UnitInput,
	UseCaseDeclaration,
} from "#core/use-case/use-case";
export { Id } from "#core/value-objects/id";
export { OrganizationId } from "#core/value-objects/organization-id";
export { UserId } from "#core/value-objects/user-id";
