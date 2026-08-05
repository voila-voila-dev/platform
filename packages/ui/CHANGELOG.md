# @voila.dev/ui

Versions are `MAJOR.MINOR.<CI run number>`: every push to `main` publishes, and
the major moves by hand when a release breaks callers. This file records those
moves — not every publish.

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
