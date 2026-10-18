import { Schema } from "effect";
import { createdAtRangeFilterFields } from "#search/constants/created-at-range-filter-fields";
import { SearchText } from "#search/value-objects/search-text";

export const TrackedLinkFilter = Schema.Struct({
	search: Schema.optional(SearchText),
	includeArchived: Schema.optional(Schema.Boolean),
	...createdAtRangeFilterFields,
	sortBy: Schema.optional(Schema.Literals(["createdAt", "label"])),
});

export type TrackedLinkFilter = typeof TrackedLinkFilter.Type;
