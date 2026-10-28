import { EmptyContent } from "#/empty/components/empty-content.tsx";
import { EmptyDescription } from "#/empty/components/empty-description.tsx";
import { EmptyHeader } from "#/empty/components/empty-header.tsx";
import { EmptyMedia } from "#/empty/components/empty-media.tsx";
import { EmptyRoot } from "#/empty/components/empty-root.tsx";
import { EmptyTitle } from "#/empty/components/empty-title.tsx";

/**
 * The Empty parts as one namespace.
 */
export const Empty = {
	Root: EmptyRoot,
	Content: EmptyContent,
	Description: EmptyDescription,
	Header: EmptyHeader,
	Media: EmptyMedia,
	Title: EmptyTitle,
};
