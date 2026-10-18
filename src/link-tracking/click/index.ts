export { LinkClick } from "#link-tracking/click/aggregates/link-click";
export { handOffLinkClick } from "#link-tracking/click/lib/hand-off-link-click";
export {
	type LinkActivity,
	linkActivity,
} from "#link-tracking/click/lib/link-activity";
export {
	type LinkClickHistory,
	LinkClickRepository,
} from "#link-tracking/click/services/link-click-repository";
export { RecordLinkClickUseCase } from "#link-tracking/click/use-cases/record-link-click-use-case";
export { LinkClickId } from "#link-tracking/click/value-objects/link-click-id";
