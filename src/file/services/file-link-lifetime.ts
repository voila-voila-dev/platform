import { Context } from "effect";

export interface FileLinkLifetimeValues {
	readonly uploadSeconds: number;
	readonly downloadSeconds: number;
}

export const FileLinkLifetime = Context.Reference<FileLinkLifetimeValues>(
	"@voila.dev/platform/FileLinkLifetime",
	{
		defaultValue: () => ({ uploadSeconds: 15 * 60, downloadSeconds: 15 * 60 }),
	},
);
