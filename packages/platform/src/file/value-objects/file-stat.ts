import { Schema } from "effect";
import { ContentType } from "#file/value-objects/content-type";

export const FileStat = Schema.Struct({
	contentType: ContentType,
	sizeBytes: Schema.Int.check(Schema.isGreaterThanOrEqualTo(0)),
});

export type FileStat = typeof FileStat.Type;
