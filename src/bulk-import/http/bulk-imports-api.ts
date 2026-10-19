import { Schema } from "effect";
import {
	HttpApiEndpoint,
	HttpApiGroup,
	HttpApiSchema,
	OpenApi,
} from "effect/http-api";
import { ImportDraft } from "#bulk-import/aggregates/import-draft";
import { ImportDraftNotEditableError } from "#bulk-import/errors/import-draft-not-editable-error";
import { ImportDraftNotFoundError } from "#bulk-import/errors/import-draft-not-found-error";
import { ImportFileRejectedError } from "#bulk-import/errors/import-file-rejected-error";
import { ImportTargetNotFoundError } from "#bulk-import/errors/import-target-not-found-error";
import { ImportDraftId } from "#bulk-import/value-objects/import-draft-id";
import { ImportFormat } from "#bulk-import/value-objects/import-format";
import { ImportTarget } from "#bulk-import/value-objects/import-target";
import { AccessDeniedError } from "#core/authorization/access-denied-error";

const AccessDenied = AccessDeniedError.pipe(HttpApiSchema.status(403));
const NotFound = ImportDraftNotFoundError.pipe(HttpApiSchema.status(404));
const TargetNotFound = ImportTargetNotFoundError.pipe(
	HttpApiSchema.status(404),
);
const NotEditable = ImportDraftNotEditableError.pipe(HttpApiSchema.status(409));
const Rejected = ImportFileRejectedError.pipe(HttpApiSchema.status(422));

const DraftResult = Schema.Struct({ draft: ImportDraft });

export const CreateImportDraftPayload = Schema.Struct({
	target: ImportTarget,
	targetId: Schema.NullOr(Schema.String),
	targetLabel: Schema.NullOr(Schema.String),
	fileName: Schema.String,
	format: Schema.optional(ImportFormat),
	content: Schema.Uint8ArrayFromBase64,
});

// The application adds its authentication middleware, which provides `CurrentActor`.
export const BulkImportsApiGroup = HttpApiGroup.make("bulkImports")
	.annotate(OpenApi.Title, "Bulk imports")
	.add(
		HttpApiEndpoint.post("createDraft", "/create-draft", {
			payload: CreateImportDraftPayload,
			success: ImportDraft,
			error: [AccessDenied, TargetNotFound, Rejected],
		}).annotate(
			OpenApi.Description,
			"The file (base64) is read and validated into a draft the review screen can come back to.",
		),
		HttpApiEndpoint.post("getDraft", "/get-draft", {
			payload: Schema.Struct({ id: ImportDraftId }),
			success: DraftResult,
			error: [AccessDenied, NotFound],
		}),
		HttpApiEndpoint.post("updateDraftCell", "/update-draft-cell", {
			payload: Schema.Struct({
				id: ImportDraftId,
				rowIndex: Schema.Int,
				column: Schema.String,
				value: Schema.String,
			}),
			success: DraftResult,
			error: [AccessDenied, NotFound, TargetNotFound, NotEditable],
		}),
		HttpApiEndpoint.post("discardDraft", "/discard-draft", {
			payload: Schema.Struct({ id: ImportDraftId }),
			success: Schema.Void,
			error: [AccessDenied, NotFound],
		}),
	)
	.prefix("/bulk-imports");
