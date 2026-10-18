import { type DateTime, Schema } from "effect";
import type { Actor } from "#core/actor/actor";
import {
	allowAnyActor,
	requireStaffActor,
} from "#core/authorization/actor-gates";
import { LinkCode } from "#link-tracking/link/value-objects/link-code";
import { TrackedLinkId } from "#link-tracking/link/value-objects/tracked-link-id";

// Two kinds share this aggregate: system short links (no label, tagged with
// the `context` that minted them, e.g. "email:{id}") and managed links or QR
// codes (labelled). A managed link's code may be printed, so it is archived,
// never deleted, and only its destination can change.
export class TrackedLink extends Schema.TaggedClass<TrackedLink>()(
	"TrackedLink",
	{
		id: TrackedLinkId,
		code: LinkCode,
		destinationUrl: Schema.String,
		label: Schema.NullOr(Schema.String),
		context: Schema.NullOr(Schema.String),
		archivedAt: Schema.NullOr(Schema.DateTimeUtcFromString),
		createdAt: Schema.DateTimeUtcFromString,
	},
) {
	static canRecordClick(actor: Actor) {
		return allowAnyActor(actor);
	}

	static canManage(actor: Actor) {
		return requireStaffActor(actor);
	}

	get isArchived(): boolean {
		return this.archivedAt !== null;
	}

	editTarget(input: {
		readonly destinationUrl: string;
		readonly label: string;
	}): TrackedLink {
		return new TrackedLink({
			...this,
			destinationUrl: input.destinationUrl,
			label: input.label,
		});
	}

	archive(at: DateTime.Utc): TrackedLink {
		if (this.isArchived) return this;
		return new TrackedLink({ ...this, archivedAt: at });
	}
}
