import { Schema } from "effect";

const SEARCH_TEXT_MAX_LENGTH = 128;

export const SearchText = Schema.String.check(
	Schema.isMaxLength(SEARCH_TEXT_MAX_LENGTH),
);

export type SearchText = typeof SearchText.Type;
