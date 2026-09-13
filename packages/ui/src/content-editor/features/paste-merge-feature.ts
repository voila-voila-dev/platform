import type { ContentFeature } from "#/content-editor/features/feature-definition.tsx";
import { MergeInlinePasteFragmentsPlugin } from "#/content-editor/features/paste-merge.ts";

export const pasteMergeFeature: ContentFeature = {
	key: "paste-merge",
	plugins: () => [MergeInlinePasteFragmentsPlugin],
	allowIn: () => true,
};
