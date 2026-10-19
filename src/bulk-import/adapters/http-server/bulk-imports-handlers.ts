import { CreateImportDraftUseCase } from "#bulk-import/use-cases/create-import-draft-use-case";
import { DiscardImportDraftUseCase } from "#bulk-import/use-cases/discard-import-draft-use-case";
import { GetImportDraftUseCase } from "#bulk-import/use-cases/get-import-draft-use-case";
import { UpdateImportDraftCellUseCase } from "#bulk-import/use-cases/update-import-draft-cell-use-case";
import { handleAsCurrentActor } from "#core/adapters/http-server/handle-as-current-actor";

export const bulkImportsHandlers = {
	createDraft: handleAsCurrentActor(CreateImportDraftUseCase),
	getDraft: handleAsCurrentActor(GetImportDraftUseCase),
	updateDraftCell: handleAsCurrentActor(UpdateImportDraftCellUseCase),
	discardDraft: handleAsCurrentActor(DiscardImportDraftUseCase),
};
