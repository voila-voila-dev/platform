import { Schema } from "effect";

export const FileKey = Schema.NonEmptyString.pipe(Schema.brand("FileKey"));

export type FileKey = typeof FileKey.Type;
