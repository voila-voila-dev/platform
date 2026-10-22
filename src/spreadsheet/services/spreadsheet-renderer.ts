import { Context, type Effect } from "effect";
import type { SpreadsheetDocument } from "#spreadsheet/value-objects/spreadsheet-document";

export class SpreadsheetRenderer extends Context.Service<
	SpreadsheetRenderer,
	{
		readonly render: (
			document: SpreadsheetDocument,
		) => Effect.Effect<Uint8Array>;
	}
>()("@voila.dev/platform/SpreadsheetRenderer") {}
