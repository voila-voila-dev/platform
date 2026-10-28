/** Shapes served by the `virtual:docs-props` module. */

/**
 * Where a prop was declared, which is what decides whether it is worth a row:
 *
 * - `own` — declared in `packages/ui/src`, including every cva variant, since
 *   those reach `Props` through `VariantProps<typeof xVariants>` and the cva
 *   lives in the component's own folder.
 * - `primitive` — Base UI's part props (`render`, `value`, `disabled`, …), and
 *   `useRender`'s.
 * - `dep` — another dependency's props (TanStack Table, react-day-picker, …).
 *
 * Props originating in React or `lib.dom` are dropped during extraction rather
 * than carried with a fourth origin: there are ~280 of them on every part, and
 * they collapse into the table's footer line instead.
 */
export type DocsPropOrigin = "own" | "primitive" | "dep";

export interface DocsPropMember {
	name: string;
	/** The resolved type, as the checker prints it. */
	type: string;
	optional: boolean;
	origin: DocsPropOrigin;
	/** The JSDoc summary, empty when the prop has none. */
	doc: string;
	/** The destructure default, e.g. `"default"` or `false`. */
	default?: string;
}

export interface DocsPropEntry {
	/** How a page addresses it: `Badge`, `Empty.Title`, `Filter.Root`. */
	id: string;
	/** The component folder under `packages/ui/src`, e.g. `badge`. */
	folder: string;
	/** Source path for the footer, e.g. `badge/components/badge.tsx`. */
	source: string;
	/** The element rendered by default (`span`, `div`), when discoverable. */
	element?: string;
	/** Non-DOM props only, own ones first. */
	members: DocsPropMember[];
}

/** Every documentable part, keyed by {@link DocsPropEntry.id}. */
export type DocsPropsManifest = Record<string, DocsPropEntry>;
