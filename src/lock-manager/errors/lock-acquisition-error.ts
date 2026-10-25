import { Schema } from "effect";

export class LockAcquisitionError extends Schema.TaggedError<LockAcquisitionError>()(
	"LockAcquisitionError",
	{ key: Schema.String, reason: Schema.String },
) {}
