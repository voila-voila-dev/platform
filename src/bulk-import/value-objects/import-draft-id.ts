import { Schema } from "effect";
import { Id } from "#core/value-objects/id";

export const ImportDraftId = Id.pipe(Schema.brand("ImportDraftId"));

export type ImportDraftId = typeof ImportDraftId.Type;
