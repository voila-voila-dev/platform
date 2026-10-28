import { Schema } from "effect";

export class AddressNotLocatableError extends Schema.TaggedError<AddressNotLocatableError>()(
	"AddressNotLocatableError",
	{},
) {}
