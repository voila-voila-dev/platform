import {
	ContentEditorField,
	type ContentValue,
	createContentFeatures,
} from "@voila.dev/ui/content-editor";
import { useState } from "react";
import { article, fakeUploadImage } from "./fixtures";

// Built once, outside the component: the editor's configuration, not its state.
const FEATURES = createContentFeatures();

/** The quick-start hero: the field over a short article, upload stubbed. */
export function Editor() {
	const [value, setValue] = useState<ContentValue | null>(article);
	return (
		<ContentEditorField
			features={FEATURES}
			value={value}
			onChange={setValue}
			onUploadImage={fakeUploadImage}
			count
		/>
	);
}
