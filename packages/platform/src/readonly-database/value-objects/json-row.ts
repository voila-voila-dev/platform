import { Schema } from "effect";

export const JsonRow = Schema.Record(Schema.String, Schema.Json);
export type JsonRow = typeof JsonRow.Type;
