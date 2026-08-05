import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import type { EmailEditorBlockLike } from "#/email-block-editor/document/types.ts";

/**
 * A definition whose block type has been forgotten.
 *
 * `EmailBlockDefinition<B>` is invariant in `B` — `B` shows up covariantly in
 * `createEmpty` and contravariantly in `onChange` and the components — so a
 * heterogeneous array of them does not widen to a common supertype on its own.
 * TypeScript cannot write the existential ("some `B`") this needs, so it is
 * spelled `any`, once.
 *
 * The erasure is confined to {@link createEmailBlockRegistry}: nothing else in
 * the package constructs one, and the registry's own surface is typed. What
 * keeps it honest at runtime is that a definition is only ever handed a block
 * of its own type, which the single lookup guarantees by keying on `type`.
 */
// biome-ignore lint/suspicious/noExplicitAny: an existential type TypeScript cannot express; see above.
export type AnyEmailBlockDefinition = EmailBlockDefinition<any>;

export interface EmailEditorRegistry {
	readonly definitions: ReadonlyArray<AnyEmailBlockDefinition>;
	/** `undefined` for a stored block whose type this instance no longer has —
	 * the real path of a document that outlives a block someone removed. */
	readonly definitionFor: (type: string) => AnyEmailBlockDefinition | undefined;
	readonly types: ReadonlyArray<string>;
	/** The types that may go inside a container: everything that is not itself
	 * one. */
	readonly leafTypes: ReadonlyArray<string>;
	/** Whether `containerType` accepts a `childType`. Defaults to "anything
	 * that is not itself a container" when the container states no rule. */
	readonly accepts: (containerType: string, childType: string) => boolean;
}

/**
 * The one place a definition list becomes a registry. Throws on a duplicate
 * type rather than letting the later one silently win: two definitions
 * claiming `"product"` means one of them renders blocks it did not create, and
 * a startup error is cheaper to read than that.
 */
export const createEmailBlockRegistry = (
	definitions: ReadonlyArray<AnyEmailBlockDefinition>,
): EmailEditorRegistry => {
	const byType = new Map<string, AnyEmailBlockDefinition>();
	for (const definition of definitions) {
		if (byType.has(definition.type)) {
			throw new Error(
				`Two email block definitions claim the type "${definition.type}".`,
			);
		}
		byType.set(definition.type, definition);
	}
	const isContainer = (type: string): boolean =>
		byType.get(type)?.container !== undefined;
	return {
		definitions,
		definitionFor: (type) => byType.get(type),
		types: definitions.map((definition) => definition.type),
		leafTypes: definitions
			.filter((definition) => definition.container === undefined)
			.map((definition) => definition.type),
		accepts: (containerType, childType) => {
			const container = byType.get(containerType)?.container;
			if (container === undefined) {
				return false;
			}
			return container.accepts?.(childType) ?? !isContainer(childType);
		},
	};
};

/**
 * The block union a definition list describes, derived from what the
 * definitions *create*.
 *
 * Deliberately not `infer B` from `EmailBlockDefinition<infer B>`: with `B` in
 * both variance positions that inference collapses, and the union comes back
 * wrong in a way nothing visible complains about. `createEmpty`'s return type
 * is the one unambiguously covariant occurrence.
 */
export type EmailEditorBlockOf<
	Definitions extends ReadonlyArray<{
		readonly createEmpty: (id: string) => EmailEditorBlockLike;
	}>,
> = ReturnType<Definitions[number]["createEmpty"]>;
