import { Schema } from "effect";
import { SortDirection } from "#search/value-objects/sort-direction";

export const createdAtRangeFilterFields = {
	createdAtFrom: Schema.optional(Schema.DateTimeUtcFromString),
	createdAtTo: Schema.optional(Schema.DateTimeUtcFromString),
	sortBy: Schema.optional(Schema.Literals(["createdAt"])),
	sortDirection: Schema.optional(SortDirection),
};
