import { Schema } from "effect";

export class FileLinkLifetimes extends Schema.Class<FileLinkLifetimes>(
	"FileLinkLifetimes",
)({
	upload: Schema.Duration,
	download: Schema.Duration,
}) {}
