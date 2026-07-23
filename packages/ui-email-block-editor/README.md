# @voila.dev/ui-email-block-editor

WYSIWYG block editor for marketing emails. The canvas mirrors the transactional
email chrome (600px card, email theme) so what the admin composes looks like the
email that will be sent — the server-rendered preview stays the source of truth.

- `document/types.ts` — the editor document model (`EmailEditorDocument`,
  blocks: heading, paragraph, button, image, divider). Pure TypeScript; the
  domain's `MarketingEmailDocument` schema validates exactly this shape.
- `document/reducer.ts` — pure reducer (add/update/remove/move/duplicate/
  select/replace) with an injected block-id factory.
- `blocks/*` — one WYSIWYG component per block, edited in place.
- `sections/*` — canvas chrome, block toolbar, add-block menu, settings sidebar.
- `dnd/sortable-block-list.tsx` — keyboard-accessible dnd-kit reordering.
- `email-block-editor.tsx` — the composed `<EmailBlockEditor />`.

Image uploads are delegated: the host passes `onUploadImage(file) → Promise<url>`.

Consumers must add this package to their Tailwind sources:

```css
@source "../../../../packages/ui-email-block-editor/src";
```
