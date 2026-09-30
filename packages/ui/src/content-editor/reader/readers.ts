import { articleReader } from "#/content-editor/features/article/reader.tsx";
import { blockquoteReader } from "#/content-editor/features/blockquote/reader.tsx";
import { buttonReader } from "#/content-editor/features/button/reader.tsx";
import { calloutReader } from "#/content-editor/features/callout/reader.tsx";
import { codeBlockReader } from "#/content-editor/features/code-block/reader.tsx";
import { columnsReader } from "#/content-editor/features/columns/reader.tsx";
import { dividerReader } from "#/content-editor/features/divider/reader.tsx";
import { fileReader } from "#/content-editor/features/file/reader.tsx";
import { finePrintReader } from "#/content-editor/features/fine-print/reader.tsx";
import {
	type ContentHeadingLevel,
	headingReader,
} from "#/content-editor/features/heading/reader.tsx";
import { highlightReader } from "#/content-editor/features/highlight/reader.tsx";
import { imageReader } from "#/content-editor/features/image/reader.tsx";
import { linkReader } from "#/content-editor/features/link/reader.tsx";
import { offerReader } from "#/content-editor/features/offer/reader.tsx";
import { paragraphReader } from "#/content-editor/features/paragraph/reader.tsx";
import { productReader } from "#/content-editor/features/product/reader.tsx";
import { ratingReader } from "#/content-editor/features/rating/reader.tsx";
import { statReader } from "#/content-editor/features/stat/reader.tsx";
import { tableReader } from "#/content-editor/features/table/reader.tsx";
import {
	CONTENT_MARKS,
	type ContentMark,
	createTextMarksReader,
} from "#/content-editor/features/text-marks/reader.tsx";
import { variableReader } from "#/content-editor/features/variable/reader.tsx";
import { videoReader } from "#/content-editor/features/video/reader.tsx";
import { xPostReader } from "#/content-editor/features/x-post/reader.tsx";
import { youtubeReader } from "#/content-editor/features/youtube/reader.tsx";

export type ContentEmbed = "youtube" | "x-post" | "video" | "file";

export interface ContentReadersOptions {
	/** Defaults to h2 and h3: a body whose page already owns the h1. */
	readonly headings?: ReadonlyArray<ContentHeadingLevel>;
	/** Defaults to every embed; pass `[]` for none. */
	readonly embeds?: ReadonlyArray<ContentEmbed>;
	/** Defaults to every mark. */
	readonly marks?: ReadonlyArray<ContentMark>;
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
	marks = CONTENT_MARKS,
}: ContentReadersOptions = {}) {
	return [
		paragraphReader,
		createTextMarksReader(marks),
		headingReader(headings),
		linkReader,
		blockquoteReader,
		dividerReader,
		calloutReader,
		codeBlockReader,
		imageReader,
		tableReader,
		...embeds.map((embed) => embedReaders[embed]),
	] as const;
}

/** The marks an email carries: what every mail client draws the same way. */
export const EMAIL_MARKS: ReadonlyArray<ContentMark> = [
	"bold",
	"italic",
	"underline",
];

export interface ContentCorrespondenceOptions {
	/** Defaults to `EMAIL_MARKS`. */
	readonly marks?: ReadonlyArray<ContentMark>;
}

/** The readers of `createCorrespondenceFeatures`, with the same options. */
export function createCorrespondenceReaders({
	marks = EMAIL_MARKS,
}: ContentCorrespondenceOptions = {}) {
	return [
		paragraphReader,
		createTextMarksReader(marks),
		linkReader,
		blockquoteReader,
		imageReader,
		variableReader,
	] as const;
}

export interface ContentEmailOptions {
	/** Defaults to h1 and h2, the email block editor's two levels. */
	readonly headings?: ReadonlyArray<ContentHeadingLevel>;
	/** Defaults to `EMAIL_MARKS`. */
	readonly marks?: ReadonlyArray<ContentMark>;
	/** The currencies a product or an offer is priced in; the first is a new
	 * card's. Defaults to EUR. */
	readonly currencies?: ReadonlyArray<string>;
}

/** The readers of `createEmailFeatures`, with the same options. */
export function createEmailReaders({
	headings = ["h1", "h2"],
	marks = EMAIL_MARKS,
}: ContentEmailOptions = {}) {
	return [
		paragraphReader,
		createTextMarksReader(marks),
		headingReader(headings),
		linkReader,
		highlightReader,
		finePrintReader,
		buttonReader,
		statReader,
		imageReader,
		dividerReader,
		articleReader,
		productReader,
		offerReader,
		ratingReader,
		tableReader,
		columnsReader,
		variableReader,
	] as const;
}
