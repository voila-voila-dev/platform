import { blockquoteReader } from "#/content-editor/features/blockquote/reader.tsx";
import { calloutReader } from "#/content-editor/features/callout/reader.tsx";
import { dividerReader } from "#/content-editor/features/divider/reader.tsx";
import { fileReader } from "#/content-editor/features/file/reader.tsx";
import {
	type ContentHeadingLevel,
	headingReader,
} from "#/content-editor/features/heading/reader.tsx";
import { imageReader } from "#/content-editor/features/image/reader.tsx";
import { linkReader } from "#/content-editor/features/link/reader.tsx";
import { paragraphReader } from "#/content-editor/features/paragraph/reader.tsx";
import { tableReader } from "#/content-editor/features/table/reader.tsx";
import { textMarksReader } from "#/content-editor/features/text-marks/reader.tsx";
import { videoReader } from "#/content-editor/features/video/reader.tsx";
import { xPostReader } from "#/content-editor/features/x-post/reader.tsx";
import { youtubeReader } from "#/content-editor/features/youtube/reader.tsx";

export type ContentEmbed = "youtube" | "x-post" | "video" | "file";

export interface ContentReadersOptions {
	/** Defaults to h2 and h3: a body whose page already owns the h1. */
	readonly headings?: ReadonlyArray<ContentHeadingLevel>;
	/** Defaults to every embed; pass `[]` for none. */
	readonly embeds?: ReadonlyArray<ContentEmbed>;
}

const embedReaders = {
	youtube: youtubeReader,
	"x-post": xPostReader,
	video: videoReader,
	file: fileReader,
} as const;

/** The built-in readers, the same set `createContentFeatures` edits. */
export function createContentReaders({
	headings = ["h2", "h3"],
	embeds = ["youtube", "x-post", "video", "file"],
}: ContentReadersOptions = {}) {
	return [
		paragraphReader,
		textMarksReader,
		headingReader(headings),
		linkReader,
		blockquoteReader,
		dividerReader,
		calloutReader,
		imageReader,
		tableReader,
		...embeds.map((embed) => embedReaders[embed]),
	] as const;
}
