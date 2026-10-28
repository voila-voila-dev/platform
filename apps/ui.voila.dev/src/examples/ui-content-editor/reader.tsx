import {
	ContentRenderer,
	contentToHtml,
	contentToMarkdown,
	createContentFeatures,
} from "@voila.dev/ui/content-editor";
import { createContentReaders } from "@voila.dev/ui/content-editor/reader";
import { article } from "./fixtures";

const READERS = createContentReaders();
const FEATURES = createContentFeatures();

/** The stored document rendered for a reader, outside any editor. */
export function Rendered() {
	return (
		<ContentRenderer
			value={article}
			features={READERS}
			render={<article className="text-sm" />}
		/>
	);
}

/** The same document as the HTML string a server emits. */
export function Html() {
	return (
		<pre className="overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
			{contentToHtml(article, { features: READERS })}
		</pre>
	);
}

/** The same document as Markdown, an MDX element for the callout. */
export function Markdown() {
	return (
		<pre className="overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
			{contentToMarkdown(article, { features: FEATURES })}
		</pre>
	);
}
