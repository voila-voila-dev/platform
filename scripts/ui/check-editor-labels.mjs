/*
 * Fails the build on an English string hard-coded inside an editor.
 *
 * Every string an editor renders comes from its `labels.ts` so a consumer can
 * ship it in their own language. Nothing enforces that at the type level: a new
 * `placeholder="Your text"` compiles perfectly and only shows up as one English
 * word in the middle of a French app, months later, in a screenshot. Around 240
 * literals were extracted in one pass — this is what stops the next one from
 * creeping back in.
 *
 * Two shapes are refused under each editor's directory: a user-facing prop
 * given a string literal (`label="Price"`), and a JSX text node starting with a
 * capital letter. `labels.ts` is where the strings are supposed to be, so it
 * is the one file exempt; tests assert on literals and are skipped too.
 *
 * Run from the repo root: `node scripts/check-editor-labels.mjs`.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const EDITORS = [
	{
		root: "packages/ui/src/email-block-editor",
		hook: "useEmailEditorLabels()",
	},
	{
		root: "packages/ui/src/content-editor",
		hook: "useContentEditorLabels()",
	},
];
const EXEMPT = new Set(["labels.ts"]);

/** Props whose value a reader sees, either on screen or through a screen reader. */
const TEXT_PROPS = [
	"aria-label",
	"ariaLabel",
	"placeholder",
	"label",
	"title",
	"description",
	"currencyLabel",
];
const LITERAL_PROP = new RegExp(`\\b(${TEXT_PROPS.join("|")})="([^"]+)"`);
/**
 * A line that is nothing but capitalised prose: a JSX text node. Anything
 * carrying a bracket, an operator or a terminator is code — that skips a
 * sentence with parentheses in it, which is the trade for never crying wolf.
 */
const JSX_TEXT = /^\s*[A-Z][A-Za-z0-9 ,.'’-]*$/;
const CODE = /[(){}<>=;?:[\]]/;

const files = [];
const walk = (directory, hook) => {
	if (!existsSync(directory)) {
		return;
	}
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const full = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			walk(full, hook);
		} else if (
			/\.tsx?$/.test(entry.name) &&
			!/\.test\.tsx?$/.test(entry.name) &&
			!EXEMPT.has(entry.name)
		) {
			files.push({ file: full, hook });
		}
	}
};
for (const editor of EDITORS) {
	walk(editor.root, editor.hook);
}

const failures = [];
for (const { file, hook } of files) {
	const lines = readFileSync(file, "utf8").split("\n");
	let inImport = false;
	lines.forEach((line, index) => {
		// Import and re-export specifiers are capitalised identifiers, not prose.
		if (/^(import|export)\b/.test(line)) {
			inImport = !line.includes(";");
			return;
		}
		if (inImport) {
			inImport = !line.includes(";");
			return;
		}
		const trimmed = line.trim();
		if (trimmed.startsWith("//") || trimmed.startsWith("*")) {
			return;
		}
		// One identifier and a comma is an argument on its own line, not prose.
		if (/^[A-Z][A-Za-z0-9]*,$/.test(trimmed)) {
			return;
		}
		const literal = LITERAL_PROP.exec(line);
		if (literal) {
			failures.push(
				`${file}:${index + 1}  ${literal[1]}="${literal[2]}" — read it from ${hook}`,
			);
		}
		if (JSX_TEXT.test(line) && !CODE.test(trimmed)) {
			failures.push(
				`${file}:${index + 1}  "${trimmed}" — read it from ${hook}`,
			);
		}
	});
}

if (failures.length > 0) {
	console.error(
		`Hard-coded copy in an editor (${failures.length}):\n${failures.join("\n")}`,
	);
	process.exit(1);
}
console.log(`No hard-coded copy in ${files.length} editor files.`);
