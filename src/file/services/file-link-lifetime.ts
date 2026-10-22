import { Context, Duration } from "effect";
import { FileLinkLifetimes } from "#file/value-objects/file-link-lifetimes";

export const FileLinkLifetime = Context.Reference<FileLinkLifetimes>(
	"@voila.dev/platform/FileLinkLifetime",
	{
		defaultValue: () =>
			FileLinkLifetimes.make({
				upload: Duration.minutes(15),
				download: Duration.minutes(15),
			}),
	},
);
