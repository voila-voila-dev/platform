# @voila.dev/ui-filter

Composable, responsive list filters: a screen declares which fields are
filterable, and this package renders the editor, the active-filter chips and the
search-shaped trigger that opens them — so every admin list filters the same way.

## Usage

```tsx
import { FilterBar } from "@voila.dev/ui-filter/components/filter-bar";
import type { FilterDefinition, FilterValues } from "@voila.dev/ui-filter/types";

const definitions: ReadonlyArray<FilterDefinition> = [
  { kind: "text", key: "recipient", label: "Recipient", allowExclusion: true },
  {
    kind: "select",
    key: "status",
    label: "Status",
    multiple: true,
    options: [
      { value: "sent", label: "Sent" },
      { value: "failed", label: "Failed" },
    ],
  },
  { kind: "dateRange", key: "sentAt", label: "Sent" },
  { kind: "moneyRange", key: "price", label: "Price", currency: "EUR" },
];

<FilterBar
  definitions={definitions}
  values={values}
  onValuesChange={setValues}
  searchValue={search}
  onSearchChange={setSearch}
  resultCount={total}
  labels={{ trigger: m.filters_trigger(), /* … */ }}
  locale="fr-FR"
/>;
```

## Kinds

| kind          | value                       | exclusion |
| ------------- | --------------------------- | --------- |
| `text`        | `{ text, excluded? }`       | yes       |
| `number`      | `{ number }`                | no        |
| `numberRange` | `{ min?, max? }`            | no        |
| `moneyRange`  | `{ min?, max? }` (cents)    | no        |
| `select`      | `{ values[], excluded? }`   | yes       |
| `dateRange`   | `{ from?, to? }` (ISO days) | no        |
| `boolean`     | `{ value }`                 | n/a       |

`FilterValues` never holds an empty filter: clearing a field removes its key, so
`Object.keys(values).length` is the active count and the record round-trips to a
query string unchanged.

## Conventions

- **Responsive by construction.** The editor is a centered dialog on desktop and
  a bottom drawer under 768px; date bounds are the calendar popover on desktop
  and the OS picker on mobile.
- **Draft, then apply.** Edits inside the panel are committed on "Apply" — a
  filtered list refetches, and refetching per keystroke is neither fast nor
  legible. Chips still remove a filter in one tap, outside the panel.
- **No translations inside.** Every string comes from the `labels` prop
  (`defaultFilterLabels` is English); apps pass their Paraglide messages.

## Composition

`FilterBar` is the assembled surface. Its parts are exported for screens that
need a different arrangement: `FilterTrigger`, `FilterPanel`, `FilterForm`,
`FilterField` and `FilterChips`.
