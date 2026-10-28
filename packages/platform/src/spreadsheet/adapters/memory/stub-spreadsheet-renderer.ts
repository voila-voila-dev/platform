import { Effect, Layer } from "effect";
import { SpreadsheetService } from "#spreadsheet/services/spreadsheet-service";
import type { SpreadsheetDocument } from "#spreadsheet/value-objects/spreadsheet-document";

// Renders `xlsx:<first sheet's name>`, so a test can tell which document an attachment came from.
export function stubSpreadsheetRenderer() {
	const rendered: Array<SpreadsheetDocument> = [];
	return {
		rendered,
		layer: Layer.succeed(SpreadsheetService, {
			render: (document) =>
				Effect.sync(() => {
					rendered.push(document);
					const sheet = document.sheets[0]?.name ?? "sheet";
					return new TextEncoder().encode(`xlsx:${sheet}`);
				}),
		}),
	};
}
