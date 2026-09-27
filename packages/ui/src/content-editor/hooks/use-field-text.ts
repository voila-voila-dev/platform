import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";

/** A field's label key resolved under `labels.fields`, or the text as given. */
export function useFieldText(): {
	(key: string): string;
	(key: string | undefined): string | undefined;
} {
	const { fields } = useContentEditorLabels();
	return ((key: string | undefined) =>
		key === undefined ? undefined : (fields[key] ?? key)) as never;
}
