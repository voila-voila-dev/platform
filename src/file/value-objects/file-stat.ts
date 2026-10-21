import { Schema } from "effect";
import { ContentType } from "#file/value-objects/content-type";

export class FileStat extends Schema.Class<FileStat>("FileStat")({
	contentType: ContentType,
	sizeBytes: Schema.Int.check(Schema.isGreaterThanOrEqualTo(0)),
}) {}
