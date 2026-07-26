# `@voila.dev/ui` conventions

The rules every component in this package follows. Several past deviations
existed only because the rule was never written down — so this file is the
canonical reference, and a review may point at a section number.

## 1. One part per file, folder per component

```
<component>/
  index.ts                      -> export { Component } from "#/<component>/components/<component>.tsx";
  components/
    <component>.tsx             -> the namespace object (NO part implementations here)
    <component>-root.tsx        -> one part per file
    <component>-<part>.tsx
    <component>.test.tsx
  hooks/                        -> React hooks
  lib/                          -> pure helpers, cva recipes, non-component modules
  context/                      -> contexts (`.ts`, they hold no JSX)
```

A folder with exactly one public component (`skeleton`, `separator`,
`money-input`, `radius-map`, `time-picker`, `textarea`) does not need a
namespace: `<component>.tsx` holds the implementation and `index.ts` exports it.
That is a real exception, not drift.

**`landing/` nests one level deeper** — it is a namespace *of* components, so
`landing/components/<sub>/` is the moral equivalent of a top-level component
folder, with `<sub>/<sub>.tsx` for the namespace and unprefixed part filenames
(`root.tsx`, `card-title.tsx`). This is the one place the flat
`<component>-<part>.tsx` rule does not apply.

`email-block-editor/blocks/` is a plugin registry, not a set of UI parts, and
stays its own auxiliary folder.

## 2. Props interface — non-exported, always named `Props`

```tsx
interface Props extends React.ComponentProps<"div"> {}
```

- ALWAYS named exactly `Props`. Never `CardRootProps`, never `FooProps`.
- NEVER exported. Consumers reach the props through
  `React.ComponentProps<typeof Component.Part>`.
- ALWAYS `extends` something — the underlying Base UI part
  (`AccordionPrimitive.Root.Props`), `useRender.ComponentProps<"tag">`, or
  `React.ComponentProps<"tag">`. Never an inline object literal in the function
  signature.
- Empty body `{}` is correct and expected when there are no extra props.
- A bare `interface Props { … }` is correct **only** for an internal
  composition component whose props are data rather than DOM attributes and
  which never spreads onto an element (the `data-table`/`spreadsheet`/`chart`
  helpers, the `filter` field dispatchers). If the part renders a DOM element,
  extend that element's props and spread the rest onto it.
- `type Props = A & B` is acceptable when an `interface … extends` is
  impossible — a mapped type over a union (`calendar-root`, `drawer-root`,
  `input-otp-root`), or a member whose type conflicts with the DOM one
  (`chip-root`'s `color`, `chat-conversation-item`'s `title`). **Say so in a
  comment**, otherwise it reads as a violation and someone will "fix" it.
- When a base member has to be dropped, `Omit` it and say why in a comment —
  React declares `content`, `results` and `onSelect` on every element.

## 3. Blank line around the `Props` declaration

```tsx
interface Props extends React.ComponentProps<"div"> {}

export function EmptyContent({ className, ...props }: Props) {
```

A blank line goes above the declaration (above its comment block, if it has
one) and below it, before the component or the component's JSDoc:

```tsx
interface Props extends useRender.ComponentProps<"h2"> {}

/** Renders an `h2` - pass `render` to fit the page's heading outline. */
export function SectionTitle({ className, render, ...props }: Props) {
```

Biome has no rule for this; it is held by review.

## 4. `useRender` from Base UI for polymorphic primitives

Any part that renders a plain DOM element and should be re-targetable by the
consumer (headings, containers, text, links, layout wrappers, list items…)
uses `useRender` + `mergeProps` instead of a raw JSX element.

Canonical shape (`card/components/card-root.tsx`,
`section/components/section-title.tsx`):

```tsx
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {
	size?: "default" | "sm";
}

export function CardRoot({ className, size = "default", render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">({ className: cn("…", className) }, props),
		render,
		state: { slot: "card", size },
	});
}
```

- `render` is destructured out of props and passed to `useRender`.
- `state` carries `slot` (kebab-case) plus any variant that should become a
  `data-*` attribute for styling (`data-[size=sm]:…`). Do **not** also set that
  `data-*` by hand — Base UI derives it from `state`.
- **Do the whole component at once.** The inconsistency is what hurts: a
  half-migrated component is worse than an un-migrated one, because consumers
  cannot predict which parts accept `render`.

Not a `useRender` case:

- A thin wrapper over a Base UI primitive — the primitive already takes
  `render`. Use `data-slot="…"` on it instead.
- An element that is load-bearing for semantics or behaviour and is not meant
  to be re-targeted: `<nav>`/`<ol>`/`<li>` in a breadcrumb, `<input>` and
  `<button>` wrappers, scroll containers, decorative `aria-hidden` nodes.

## 5. Namespace export

`components/<component>.tsx` builds one object, `Root` first, then the
remaining parts alphabetically:

```tsx
import { EmptyContent } from "#/empty/components/empty-content.tsx";
…

/**
 * The Empty parts as one namespace.
 */
export const Empty = {
	Root: EmptyRoot,
	Content: EmptyContent,
	Description: EmptyDescription,
	Header: EmptyHeader,
	Media: EmptyMedia,
	Title: EmptyTitle,
};
```

- The namespace file builds the namespace and **nothing else** — variants,
  hooks and types are re-exported by `index.ts`, from the module that defines
  them, so every symbol has exactly one public path.
- `index.ts` re-exports only the namespace plus genuinely-public
  types/hooks/variants. No individual part is reachable from it.
- The namespace carries a short JSDoc (`/** The X parts as one namespace. */`).
- **Compose order instead of alphabetical is allowed** when the JSDoc documents
  the tree (`landing/`'s `/** Compose: … */`, `chart`'s drawing pipeline,
  `spreadsheet`'s DOM order). Say so in the JSDoc.

## 6. Other style rules in force

- Tabs for indentation, double quotes, semicolons (Biome).
- Imports use the `#/` alias with an explicit `.tsx` / `.ts` extension.
  Biome's `organizeImports` owns the grouping — do not hand-separate the
  external and `#/` blocks, it will collapse them again.
- `export function` declarations — not `export const X = () => …`, not
  `React.FC`, not `forwardRef` (React 19: `ref` is a normal prop).
- Every part sets a slot identifier: `data-slot="…"` on plain/primitive JSX, or
  `state: { slot: "…" }` when using `useRender`. A part that delegates to
  another component passes its **own** `data-slot`, which wins over the base
  component's.
- `cn()` always wraps `className` last: `cn("base classes", className)`. Never
  a template literal, never `className` before `{...props}`.
- Default variant values live in the destructure (`size = "default"`), and the
  whole props object is destructured in the signature, not in the body.
- A custom prop never shadows a real DOM attribute — the slot-name prop is
  `slotName`, not `slot`.
- Prefer `mergeProps` over two consecutive spreads when both carry handlers,
  so the consumer's are composed rather than clobbered.

## 7. The package surface

- Subpath exports only (`@voila.dev/ui/<folder>`); there is no `"."` entry, by
  design — the package is tree-shakeable by construction.
- Every folder with an `index.ts` has a matching `exports` entry whose name
  equals the folder name. The only aliases are `./utils`, `./cva` and
  `./hooks`.
- Stylesheets ship through `./styles/*.css`.
