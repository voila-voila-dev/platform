import { Schema } from "effect";

// What the rows become, named by the application: "contacts", "products"…
export const ImportTarget = Schema.NonEmptyString.pipe(
	Schema.brand("ImportTarget"),
);

export type ImportTarget = typeof ImportTarget.Type;
