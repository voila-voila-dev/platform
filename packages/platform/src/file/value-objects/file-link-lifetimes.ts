import { Schema } from "effect";

export const FileLinkLifetimes = Schema.Struct({
	upload: Schema.Duration,
	download: Schema.Duration,
});

export type FileLinkLifetimes = typeof FileLinkLifetimes.Type;
