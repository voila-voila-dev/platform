import { Schema } from "effect";

export const SortDirection = Schema.Literals(["asc", "desc"]);

export type SortDirection = typeof SortDirection.Type;
