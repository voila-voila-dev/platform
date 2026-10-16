// Copies the Emojibase data the emoji picker fetches (`<locale>/data.json`
// and `<locale>/messages.json`) out of the pinned emojibase-data into dist/,
// under a versioned path, with the headers that let another origin read it
// and cache it forever.
import {
	copyFile,
	mkdir,
	readdir,
	readFile,
	rm,
	writeFile,
} from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const app = join(here, "..");
const dist = join(app, "dist");
const source = dirname(
	createRequire(import.meta.url).resolve("emojibase-data/package.json"),
);
const { version } = JSON.parse(
	await readFile(join(source, "package.json"), "utf8"),
);

// The kit names the version it reads in its URL; serving another one would
// answer every picker with a 404.
const kitUrl = await readFile(
	join(app, "../../packages/ui/src/emoji-picker/lib/emojibase-url.ts"),
	"utf8",
);
if (!kitUrl.includes(`/emojibase-data/${version}"`)) {
	throw new Error(
		`packages/ui/src/emoji-picker/lib/emojibase-url.ts does not point at emojibase-data@${version}: bump both together.`,
	);
}

const FILES = ["data.json", "messages.json"];

async function isLocale(entry) {
	if (!entry.isDirectory()) return false;
	const files = await readdir(join(source, entry.name));
	return FILES.every((file) => files.includes(file));
}

await rm(dist, { recursive: true, force: true });
const entries = await readdir(source, { withFileTypes: true });
const locales = [];
for (const entry of entries) {
	if (await isLocale(entry)) locales.push(entry.name);
}
// No "@" in the path: the assets server redirects it to "%40", one more
// round trip before every first picker.
const root = join(dist, "emojibase-data", version);
for (const locale of locales) {
	await mkdir(join(root, locale), { recursive: true });
	for (const file of FILES) {
		await copyFile(join(source, locale, file), join(root, locale, file));
	}
}
await writeFile(
	join(dist, "_headers"),
	[
		"/*",
		"  Access-Control-Allow-Origin: *",
		"  Cache-Control: public, max-age=31536000, immutable",
		"",
	].join("\n"),
);
console.log(
	`emojibase-data@${version}: ${locales.length} locales (${locales.join(", ")})`,
);
