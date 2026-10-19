import { Context } from "effect";

export interface ImportLimitValues {
	readonly maxBytes: number;
	readonly maxRows: number;
	readonly batchSize: number;
	readonly draftLifetimeDays: number;
}

export const ImportLimits = Context.Reference<ImportLimitValues>(
	"@voila.dev/platform/ImportLimits",
	{
		defaultValue: () => ({
			maxBytes: 2 * 1024 * 1024,
			maxRows: 20_000,
			batchSize: 200,
			draftLifetimeDays: 7,
		}),
	},
);
