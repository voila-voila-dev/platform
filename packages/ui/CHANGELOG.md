# @voila.dev/ui

Versions are `MAJOR.MINOR.<CI run number>`: every push to `main` publishes, and
the major moves by hand when a release breaks callers. This file records those
moves — not every publish.

## 3.0 — TanStack Table v9 and MapLibre 6

Two peer dependencies moved a major, and both reach the code you write.

TanStack Table v9 ships nothing by default: an API exists only when its
feature is registered. The data table registers its own set — sorting, global
search, an expandable row, selection, resizing, visibility, pinning — and
threads it through every generic, so a column definition names it.

```tsx
import { type ColumnDef, type DataTableFeatures } from "@voila.dev/ui/data-table";

const columns: ColumnDef<DataTableFeatures, Club>[] = [
	{ accessorKey: "name", header: "Name" },
];
```

MapLibre 6 is ESM-only, needs WebGL2, and publishes no default export. It also
starts its tile worker from a URL relative to its own module, so a bundler must
leave it out of dependency pre-bundling — under Vite, a map that skips this
draws its raster relief and silently loses water, roads, borders and labels,
with nothing logged.

```ts title="vite.config.ts"
export default defineConfig({
	optimizeDeps: { exclude: ["maplibre-gl"] },
});
```

### Breaking

| Was | Is |
| --- | --- |
| peer `@tanstack/react-table@^8` | `^9` — [its own migration](https://tanstack.com/table/latest/docs/framework/react/guide/migrating) applies to your column definitions |
| peer `maplibre-gl@^5` | `^6` — ESM-only, WebGL2 required |
| `import maplibregl from "maplibre-gl"` | `import * as maplibregl from "maplibre-gl"`, or named imports |
| `ColumnDef<Club>`, `Row<Club>`, `Table<Club>` | `ColumnDef<DataTableFeatures, Club>`, and so on — `DataTableFeatures` is exported from `@voila.dev/ui/data-table` |
| `DataTable.Root<Club, TValue>` | `DataTable.Root<Club>` — one value type across a whole column list was never true, and v9 rejects it |
| `columnPinning={{ left, right }}` | `{{ start, end }}` — logical edges, so a pinned table follows the reading direction. Naming one edge is still enough |
| `VisibilityState` | `ColumnVisibilityState` |
| a `TData` that is neither record nor array | v9 constrains row data to `Record<string, any> \| Array<any>` |
| Vite consumers | add `optimizeDeps.exclude: ["maplibre-gl"]` |

### Added

- **`DataTableFeatures`**, exported alongside the other data-table types, so a
  column definition can name the feature set without depending on TanStack
  directly.
- **RTL-aware pinning.** Frozen columns stick with `inset-inline-*` on
  TanStack's logical `start`/`end`, so the same table freezes the right columns
  under RTL instead of the mirrored ones.
- **Base UI 1.8**: `<Avatar.Image keepMounted>`, the combobox `createItems`
  collection API, and a `Select` popup that opens and browses while `readOnly`.
- MapLibre 6 draws Arabic and Hebrew labels correctly without an RTL plugin,
  and the other complex scripts along with them.

### Fixed

- **`Button` reads its own `render` tag.** `render={<a href>}` gets the button
  role and keyboard handling without `nativeButton={false}` at the call site. A
  component element still says nothing about its tag, so there the caller keeps
  the say.
- **`InputOTP` takes `defaultValue` quietly.** `input-otp` seeds its own state
  from the prop and forwards it to the inner input as well, next to the `value`
  already there; the root owns the uncontrolled case now, so React stops
  warning about an input that is both controlled and uncontrolled.
- **`CheckboxGroup` keeps a custom `id` in parent mode**, fixed upstream in
  Base UI 1.8 — an explicit `htmlFor`/`id` label pair holds, and the advice to
  wrap each box in its label is gone.

## 2.0 — the email editor is configurable

The email block editor was a package you forked. Its block set was a closed
union, its colours were module constants imported by 29 files, and around 240
English strings were spelled out in JSX. A host that needed a different block,
a different palette or a different language had one option, and took it.

Everything that used to be baked in is now something you pass in.

```tsx
const BLOCKS = createEmailBlocks({ currency: "EUR" });

<EmailBlockEditor
	blocks={BLOCKS}
	document={document}
	onDocumentChange={setDocument}
	theme={{ color: { brand: "#151b77" } }}
	labels={{ chrome: { addBlock: "Ajouter un bloc" } }}
/>;
```

### Breaking

| Was | Is |
| --- | --- |
| `<EmailBlockEditor onChange>` | `onDocumentChange`, and `blocks` is required |
| `EMAIL_BLOCK_DEFINITIONS`, `EMAIL_BLOCK_TYPES`, `EMAIL_LEAF_BLOCK_TYPES`, `emailBlockDefinition` | `createEmailBlocks()`, `createEmailBlockRegistry()`, `registry.definitionFor()` |
| `EMAIL_COLOR`, `EMAIL_FONT`, `EMAIL_HEADING_STYLE`, `EMAIL_GRID_GAP_PX`, `EMAIL_IMAGE_WIDTH_RATIO`, `EMAIL_PREVIEW_LOCALE`, `EMAIL_PREVIEW_WIDTH` | the `theme` prop, `DEFAULT_EMAIL_EDITOR_THEME`, `mergeEmailEditorTheme` |
| `createEmailEditorBlock(type, id)` | `definition.createEmpty(id)` |
| `createEmailEditorReducer(generateBlockId)` | `createEmailEditorReducer(registry, generateBlockId)` |
| `EmailEditorBlock`, `EmailEditorLeafBlock`, `EmailEditorBlockType` | `EmailEditorBuiltInBlock`, `EmailEditorBuiltInLeafBlock`, `EmailEditorBuiltInBlockType` — or your own union, via `EmailEditorBlockOf` |
| `EmailEditorCurrency` (`"EUR"`) | `EmailEditorMoney<Currency>`, fixed per instance by `createEmailBlocks({ currency })` |
| `formatPreviewPrice(money)` | `formatPreviewPrice(money, locale)` |
| `EmailEditorDocument` | `EmailEditorDocument<Block>`, defaulting to the built-in union |

### Added

- **`EmailEditor.*` parts.** `Root`, `Layout`, `Toolbar`, `Canvas`, `Card`,
  `CardHeader`, `CardFooter`, `Blocks`, `Sidebar`, `DocumentSettings`,
  `BlockSettings`, `SettingsSheet`. Every part renders a sensible default with
  no children; `EmailBlockEditor` is that composition, unchanged in spirit.
- **`labels`**, in four sections, merged over the English defaults section by
  section. A label that reads an index is a function, because `Item 3` and
  `3e élément` do not share a word order.
- **Controlled selection and preview** (`selectedBlockId`, `preview`), so a
  host with an undo stack can own them.
- **`documentSettings`**: fields belonging to the document rather than to a
  block — a subject line, a preheader — placed above the canvas when compact
  and at the top of the settings column when wide.
- **Containers are declared, not hard-coded.** A definition with a `container`
  holds other blocks; the grid is simply the one this package ships.
- **Hooks**: `useEmailEditor`, `useEmailEditorState`, `useEmailEditorActions`,
  `useEmailEditorTheme`, `useEmailEditorLabels`, `useEmailEditorRegistry`.
- The pieces a block of your own needs are exported: `BlockTextInput`,
  `RichTextEditable`, the option rows, the card shell.

### Fixed

- The fine print block edits spans like a paragraph but was missing from the
  rich-text set, so its toolbar had no bold, italic, underline or link.
- A stored block whose type an editor no longer registers shows an "unknown
  block" placeholder instead of crashing — the real path of a document that
  outlives a block someone removed.

### Migrating

1. Build your blocks once, outside the component:
   `const BLOCKS = createEmailBlocks({ currency: "EUR" })`.
2. Pass `blocks={BLOCKS}` and rename `onChange` to `onDocumentChange`.
3. Replace imports of `EMAIL_COLOR` / `EMAIL_FONT` with a `theme` prop, or
   with `DEFAULT_EMAIL_EDITOR_THEME` where you were painting your own card.
4. If you translated the editor by forking it, pass `labels` instead and
   delete the fork.
