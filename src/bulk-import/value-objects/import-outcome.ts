import { Schema } from "effect";

export const ImportOutcome = Schema.Struct({
	created: Schema.Int,
	updated: Schema.Int,
	invalid: Schema.Int,
});

export type ImportOutcome = typeof ImportOutcome.Type;

export const emptyImportOutcome: ImportOutcome = {
	created: 0,
	updated: 0,
	invalid: 0,
};

export function addImportOutcome(
	total: ImportOutcome,
	batch: ImportOutcome,
): ImportOutcome {
	return {
		created: total.created + batch.created,
		updated: total.updated + batch.updated,
		invalid: total.invalid + batch.invalid,
	};
}
