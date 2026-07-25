/*
 * Edits the package manifests for publishing. Private packages pass through
 * untouched. Two modes, because publishing needs manifest edits at two
 * moments:
 *
 *   stamp     — before `bun install`: writes PUBLISH_VERSION into every
 *               manifest so the workspace:* cross-deps bun resolves at pack
 *               time all line up.
 *   finalize  — after the build: points exports at dist/, drops
 *               devDependencies (consumers never install them) and the build
 *               script (it references ../../scripts, which never ships).
 *
 * In the repo, exports target src/ so the apps, Storybook and tests consume
 * source through the workspace symlinks with zero build step. The tarball is
 * the one place they flip to dist/. `imports` stays on ./src/*: dist uses
 * relative specifiers, but the shipped sources still say `#/...` —
 * go-to-definition lands there and the consumer's TS server resolves those
 * through this field. Packages without a build script (ui-tokens ships plain
 * CSS) keep their src-pointing exports.
 */
import fs from "node:fs";
import path from "node:path";

const mode = process.argv[2];
const version = process.env.PUBLISH_VERSION;
if (!["stamp", "finalize"].includes(mode)) {
	throw new Error("usage: publish-manifests.mjs <stamp|finalize>");
}
if (mode === "stamp" && !version) {
	throw new Error("stamp requires PUBLISH_VERSION");
}

const toDist = (value) =>
	value.replace(/^\.\/src\//, "./dist/").replace(/\.tsx?$/, ".js");

for (const dir of fs.readdirSync("packages")) {
	const file = path.join("packages", dir, "package.json");
	if (!fs.existsSync(file)) continue;
	const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
	if (pkg.private) continue;

	if (mode === "stamp") {
		pkg.version = version;
		console.log(`${pkg.name}@${pkg.version}`);
	} else {
		if (pkg.scripts?.build) {
			for (const [key, value] of Object.entries(pkg.exports ?? {})) {
				pkg.exports[key] = toDist(value);
			}
			delete pkg.scripts.build;
		}
		delete pkg.devDependencies;
		console.log(`${pkg.name}: manifest ready to publish`);
	}

	fs.writeFileSync(file, `${JSON.stringify(pkg, null, "\t")}\n`);
}
