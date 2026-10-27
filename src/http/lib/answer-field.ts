import { Schema } from "effect";

// A field a partner may leave out or send as `null`, both read as missing,
// rather than failing the call over the partner's serializer habits.
export function answerField<Field extends Schema.Top>(field: Field) {
	return Schema.optionalKey(Schema.NullOr(field));
}
