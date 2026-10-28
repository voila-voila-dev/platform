import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";

/**
 * A node attribute the inspector edits, declared as data. The inspector
 * turns each descriptor into its control, so a feature lists its fields and
 * never writes a settings form.
 *
 * `label`, `description`, `placeholder` and an option's `label` are keys
 * under `labels.fields`; a string with no entry there is shown as is, so a
 * host that does not translate can write the text itself.
 */
interface ContentFieldBase<Key extends string> {
	readonly key: Key;
	readonly label: string;
	readonly description?: string;
}

export interface ContentTextField<Key extends string = string>
	extends ContentFieldBase<Key> {
	readonly type: "text";
	readonly placeholder?: string;
	readonly multiline?: boolean;
}

export interface ContentUrlField<Key extends string = string>
	extends ContentFieldBase<Key> {
	readonly type: "url";
	readonly placeholder?: string;
}

/** A string, or a number when the attribute is a count (a column count). */
export interface ContentSelectField<
	Key extends string = string,
	Value extends string | number = string | number,
> extends ContentFieldBase<Key> {
	readonly type: "select";
	readonly options: ReadonlyArray<{
		readonly value: Value;
		readonly label: string;
	}>;
}

export interface ContentBooleanField<Key extends string = string>
	extends ContentFieldBase<Key> {
	readonly type: "boolean";
}

/** Integer minor units and a currency, never a formatted string: the email
 * formats it per recipient. */
export interface ContentMoney {
	readonly amountInMinorUnits: number;
	readonly currency: string;
}

export interface ContentMoneyField<Key extends string = string>
	extends ContentFieldBase<Key> {
	readonly type: "money";
	/** The currencies the author picks from; the first is the default. */
	readonly currencies?: ReadonlyArray<string>;
	/** An empty amount stores `null`, for a price the node may go without
	 * (a product's struck-through base price). */
	readonly optional?: boolean;
}

/** A card's visual: its url and its alternative text. An empty `src` means
 * the card has none. */
export interface ContentCardImage {
	readonly src: string;
	readonly alt: string;
}

/** The url of an image the host's `onUploadImage` stored. */
export interface ContentImageField<Key extends string = string>
	extends ContentFieldBase<Key> {
	readonly type: "image";
	/** The crop the upload goes through; defaults to 16 / 9. */
	readonly aspectRatio?: number;
	/** Stores a `ContentCardImage` and asks for its alternative text under
	 * the upload, instead of the url alone. */
	readonly withAlt?: boolean;
}

export interface ContentStringListField<Key extends string = string>
	extends ContentFieldBase<Key> {
	readonly type: "string-list";
	readonly placeholder?: string;
}

export type ContentField =
	| ContentTextField
	| ContentUrlField
	| ContentSelectField
	| ContentBooleanField
	| ContentMoneyField
	| ContentImageField
	| ContentStringListField;

export type ContentFieldType = ContentField["type"];

/** What each field type stores on the node. */
export interface ContentFieldValueByType {
	readonly text: string;
	readonly url: string;
	readonly select: string | number;
	readonly boolean: boolean;
	readonly money: ContentMoney | null;
	readonly image: string | ContentCardImage;
	readonly "string-list": ReadonlyArray<string>;
}

/** A node's own attributes, without the index signature `ContentNodeLike` carries. */
type Attributes<Node> = {
	readonly [Key in keyof Node as string extends Key
		? never
		: Key extends "type" | "children" | "id"
			? never
			: Key]: Node[Key];
};

type FieldsForValue<Key extends string, Value> =
	| ([Value] extends [string]
			?
					| ContentTextField<Key>
					| ContentUrlField<Key>
					| ContentImageField<Key>
					| ContentSelectField<Key, Value>
			: never)
	| ([Value] extends [number] ? ContentSelectField<Key, Value> : never)
	| ([Value] extends [boolean] ? ContentBooleanField<Key> : never)
	| ([Value] extends [ContentMoney] ? ContentMoneyField<Key> : never)
	| ([Value] extends [ContentCardImage]
			? ContentImageField<Key> & { readonly withAlt: true }
			: never)
	| ([Value] extends [ReadonlyArray<string>]
			? ContentStringListField<Key>
			: never);

/**
 * The field descriptors a node type accepts: one per attribute, of a type
 * that stores what the attribute holds. A `select` over `align: "left" |
 * "right"` only takes those two values as options.
 */
export type ContentFieldOf<Node extends ContentNodeLike> = {
	readonly [Key in keyof Attributes<Node> & string]-?: FieldsForValue<
		Key,
		NonNullable<Attributes<Node>[Key]>
	>;
}[keyof Attributes<Node> & string];

/** What a fresh node carries before the author touches it. */
export type ContentElementDefaults<Node extends ContentNodeLike> =
	Attributes<Node> & { readonly children?: Node["children"] };
