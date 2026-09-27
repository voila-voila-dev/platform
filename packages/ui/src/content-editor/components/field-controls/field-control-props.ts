import type {
	ContentField,
	ContentFieldValueByType,
} from "#/content-editor/features/field-definition.ts";

/** What every field control takes: its descriptor, the stored value, a setter. */
export interface FieldControlProps<Type extends ContentField["type"]> {
	readonly id: string;
	readonly field: Extract<ContentField, { readonly type: Type }>;
	readonly value: ContentFieldValueByType[Type];
	readonly onChange: (value: ContentFieldValueByType[Type]) => void;
}
