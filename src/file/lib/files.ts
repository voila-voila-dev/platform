import { Effect, Option } from "effect";
import { IdGenerator } from "#core/services/id-generator";
import { FileUploadRejectedError } from "#file/errors/file-upload-rejected-error";
import {
	extensionFromContentType,
	normalizeContentType,
} from "#file/lib/content-type";
import { FileStorage } from "#file/services/file-storage";
import { FileKey } from "#file/value-objects/file-key";
import { ImagePreview } from "#file/value-objects/image-preview";
import { ImageRef } from "#file/value-objects/image-ref";

export interface FileUploadRule {
	readonly contentTypes: ReadonlyArray<string>;
	readonly maxBytes: number;
}

export interface FileKind {
	readonly prefix: `${string}/`;
	// A public file is served to anyone holding its key; any other needs a download link.
	readonly visibility: "public" | "private";
	// Only a kind with an upload rule can be uploaded from a browser.
	readonly upload?: FileUploadRule;
	// The widths an image of this kind is also stored at.
	readonly variantWidths?: ReadonlyArray<number>;
}

export type FileKinds = Readonly<Record<string, FileKind>>;

export type UploadableKind<Kinds extends FileKinds> = {
	[Name in keyof Kinds & string]: Kinds[Name] extends {
		readonly upload: FileUploadRule;
	}
		? Name
		: never;
}[keyof Kinds & string];

export interface FilesConfig<Kinds extends FileKinds> {
	readonly kinds: Kinds;
	// For an image whose kind declares no widths, or whose key matches no kind.
	readonly defaultVariantWidths?: ReadonlyArray<number>;
}

function rejected(reason: FileUploadRejectedError["reason"]) {
	return Effect.fail(new FileUploadRejectedError({ reason }));
}

// The application makes one, declaring every kind of file it stores. A key
// is `<prefix><segment>/<segment>…`; the segments mean what the kind's domain says.
function make<const Kinds extends FileKinds>(config: FilesConfig<Kinds>) {
	type Name = keyof Kinds & string;
	const byLongestPrefix = (
		Object.entries(config.kinds) as Array<[Name, FileKind]>
	).sort(([, left], [, right]) => right.prefix.length - left.prefix.length);

	function kindOf(key: string): Option.Option<[Name, FileKind]> {
		return Option.fromNullishOr(
			byLongestPrefix.find(([, kind]) => key.startsWith(kind.prefix)),
		);
	}

	function keyIn(name: Name, path: string): FileKey {
		const kind = config.kinds[name];
		if (kind === undefined) throw new Error(`No file kind ${name}`);
		return FileKey.make(`${kind.prefix}${path}`);
	}

	function uploadRule(name: UploadableKind<Kinds>): FileUploadRule {
		const rule = config.kinds[name]?.upload;
		if (rule === undefined) throw new Error(`${name} declares no upload rule`);
		return rule;
	}

	function variantWidths(key: string): ReadonlyArray<number> {
		return Option.match(kindOf(key), {
			onNone: () => config.defaultVariantWidths ?? [],
			onSome: ([, kind]) =>
				kind.variantWidths ?? config.defaultVariantWidths ?? [],
		});
	}

	function validateUpload(
		name: UploadableKind<Kinds>,
		input: { readonly contentType: string; readonly contentLength: number },
	): Effect.Effect<void, FileUploadRejectedError> {
		const rule = uploadRule(name);
		// The declared type and length only gate the link: the bytes that land
		// are whatever the browser PUTs.
		if (!rule.contentTypes.includes(normalizeContentType(input.contentType)))
			return rejected("unsupportedContentType");
		if (!(input.contentLength > 0)) return rejected("empty");
		if (!(input.contentLength <= rule.maxBytes)) return rejected("tooLarge");
		return Effect.void;
	}

	return {
		kinds: config.kinds,

		key: (name: Name, segment: string, ...segments: ReadonlyArray<string>) =>
			keyIn(name, [segment, ...segments].join("/")),

		parse: (key: string) =>
			Option.map(kindOf(key), ([name, kind]) => ({
				kind: name,
				segments: key.slice(kind.prefix.length).split("/"),
			})),

		// A key matching no kind is private.
		isPublic: (key: string) =>
			Option.exists(kindOf(key), ([, kind]) => kind.visibility === "public"),

		variantWidths,

		// A preview that crossed the wire may claim widths never stored, and a
		// `srcset` candidate that 404s breaks the picture for every reader.
		withDeclaredVariantWidths: (ref: ImageRef): ImageRef => {
			if (ref.preview === undefined) return ref;
			const declared = variantWidths(ref.key);
			return new ImageRef({
				...ref,
				preview: new ImagePreview({
					...ref.preview,
					variantWidths: ref.preview.variantWidths.filter((width) =>
						declared.includes(width),
					),
				}),
			});
		},

		validateUpload,

		// `<prefix><scope>/<id>.<extension>`, or `<prefix><id>.<extension>` without a scope.
		requestUpload: (
			name: UploadableKind<Kinds>,
			input: {
				readonly scope?: string;
				readonly contentType: string;
				readonly contentLength: number;
			},
		) =>
			Effect.gen(function* () {
				yield* validateUpload(name, input);
				const id = yield* (yield* IdGenerator).generate();
				const fileName = `${id}.${extensionFromContentType(normalizeContentType(input.contentType))}`;
				const key = keyIn(
					name,
					input.scope === undefined ? fileName : `${input.scope}/${fileName}`,
				);
				const link = yield* (yield* FileStorage).uploadUrl({
					key,
					contentType: input.contentType,
					contentLength: input.contentLength,
				});
				return { key, uploadUrl: link.url, expiresAt: link.expiresAt };
			}),
	};
}

export const Files = { make };

export type Files<Kinds extends FileKinds> = ReturnType<typeof make<Kinds>>;
