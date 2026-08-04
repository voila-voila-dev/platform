/*
 * Fails the build on an English string hard-coded inside the email editor.
 *
 * Every string the editor renders comes from `labels.ts` so a consumer can ship
 * it in their own language. Nothing enforces that at the type level: a new
 * `placeholder="Your text"` compiles perfectly and only shows up as one English
 * word in the middle of a French app, months later, in a screenshot. Around 240
 * literals were extracted in one pass — this is what stops the next one from
 * creeping back in.
 *
 * Two shapes are refused under `packages/ui/src/email-block-editor/`:
 * a user-facing prop given a string literal (`label="Price"`), and a JSX text
 * node starting with a capital letter. `labels.ts` is where the strings are
 * supposed to be, so it is the one file exempt.
 *
 * Run from the repo root: `node scripts/check-email-editor-labels.mjs`.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = "packages/ui/src/email-block-editor";
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
const walk = (directory) => {
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const full = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			walk(full);
		} else if (/\.tsx?$/.test(entry.name) && !EXEMPT.has(entry.name)) {
			files.push(full);
		}
	}
};
walk(ROOT);

const failures = [];
for (const file of files) {
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
		const literal = LITERAL_PROP.exec(line);
		if (literal) {
			failures.push(
				`${file}:${index + 1}  ${literal[1]}="${literal[2]}" — read it from useEmailEditorLabels()`,
			);
		}
		if (JSX_TEXT.test(line) && !CODE.test(trimmed)) {
			failures.push(
				`${file}:${index + 1}  "${trimmed}" — read it from useEmailEditorLabels()`,
			);
		}
	});
}

if (failures.length > 0) {
	console.error(
		`Hard-coded copy in the email editor (${failures.length}):\n${failures.join("\n")}`,
	);
	process.exit(1);
}
console.log(`No hard-coded copy in ${files.length} email editor files.`);
