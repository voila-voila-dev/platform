// Copies the Emojibase data the emoji picker fetches (`<locale>/data.json`
// and `<locale>/messages.json`) out of the pinned emojibase-data into dist/,
// under a versioned path, with the headers that let another origin read it
// and cache it forever.
import { BunRuntime, BunServices } from "@effect/platform-bun";
import { Effect, FileSystem, Path, Schema } from "effect";

const FILES = ["data.json", "messages.json"];

/** The kit reads another emojibase-data version than the one pinned here. */
class EmojibaseVersionMismatch extends Schema.TaggedError<EmojibaseVersionMismatch>()(
	"EmojibaseVersionMismatch",
	{ version: Schema.String },
) {
	override get message() {
		return `packages/ui/src/emoji-picker/lib/emojibase-url.ts does not point at emojibase-data@${this.version}: bump both together.`;
	}
}

const program = Effect.gen(function* () {
	const fs = yield* FileSystem.FileSystem;
	const path = yield* Path.Path;

	const app = path.join(import.meta.dir, "..");
	const dist = path.join(app, "dist");
	const source = path.dirname(
		Bun.resolveSync("emojibase-data/package.json", app),
	);
	const { version } = JSON.parse(
		yield* fs.readFileString(path.join(source, "package.json")),
	) as { version: string };

	// The kit names the version it reads in its URL; serving another one would
	// answer every picker with a 404.
	const kitUrl = yield* fs.readFileString(
		path.join(app, "../../packages/ui/src/emoji-picker/lib/emojibase-url.ts"),
	);
	if (!kitUrl.includes(`/emojibase-data/${version}"`)) {
		return yield* new EmojibaseVersionMismatch({ version });
	}

	const locales = yield* Effect.filter(
		yield* fs.readDirectory(source),
		(entry) =>
			Effect.gen(function* () {
				const info = yield* fs.stat(path.join(source, entry));
				if (info.type !== "Directory") return false;
				const files = yield* fs.readDirectory(path.join(source, entry));
				return FILES.every((file) => files.includes(file));
			}),
	);

	yield* fs.remove(dist, { recursive: true, force: true });
	// No "@" in the path: the assets server redirects it to "%40", one more
	// round trip before every first picker.
	const root = path.join(dist, "emojibase-data", version);
	for (const locale of locales) {
		yield* fs.makeDirectory(path.join(root, locale), { recursive: true });
		for (const file of FILES) {
			yield* fs.copyFile(
				path.join(source, locale, file),
				path.join(root, locale, file),
			);
		}
	}
	yield* fs.writeFileString(
		path.join(dist, "_headers"),
		[
			"/*",
			"  Access-Control-Allow-Origin: *",
			"  Cache-Control: public, max-age=31536000, immutable",
			"",
		].join("\n"),
	);
	yield* Effect.log(
		`emojibase-data@${version}: ${locales.length} locales (${locales.join(", ")})`,
	);
});

BunRuntime.runMain(program.pipe(Effect.provide(BunServices.layer)));
