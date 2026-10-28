# `@voila.dev/ui` — component consistency audit

**Scope:** every non-test, non-story component file in `packages/ui/src` — 819 `.tsx` files across 99 folders, plus all 93 `index.ts` barrels and the package `exports` map.
**Method:** mechanical scan (AST-ish regex inventory) followed by file-by-file confirmation. Nothing was reported that wasn't visually confirmed in the file. **No source files were modified — this is a read-only audit.**

---

## 1. Executive summary

### The headline

The **public API contract is in far better shape than expected**, and the **internal style consistency is worse**. Concretely:

- **Not one component exports its `Props` type** from a barrel. The rule you asked me to verify — "doesn't export the props because we can access it via `ComponentProps`" — is already respected across all 819 files. The single file-level violation (`sonner/components/sonner.tsx:11` re-exports `ToasterProps` from `sonner`) isn't reachable from `sonner/index.ts`, so it never reaches consumers. There is no leak to fix, only a stray line to delete.
- **Zero `forwardRef`, zero `React.FC`,** and only 5 arrow-function components (all inside `email-block-editor`/`filter`). The React 19 migration is complete.
- **The `exports` map is genuinely clean.** All 93 folders with an `index.ts` are wired, every target resolves on disk, every subpath name matches its folder.

Against that, the two things you flagged are both real and both large:

| | |
|---|---|
| **Missing blank line between `Props` and the component** | **436 files, 56 of 99 components** |
| **Components that should use `useRender` but don't** | ~60 parts; only **43 of ~560** raw-DOM parts are polymorphic today |

### Findings by severity

| Chunk | P1 | P2 | P3 (incl. blank-line) |
|---|---:|---:|---:|
| 1 — `accordion` → `combobox` | 0 | 12 | 63 |
| 2 — `command` → `dropdown-menu` | 0 | 21 | 61 |
| 3 — `email-block-editor` | 8 | 10 | 60 |
| 4 — `empty` → `menu` | 1 | 20 | 74 |
| 5 — `landing` | 0 | 24 | 119 |
| 6 — `menubar` → `sheet` | 5 | 17 | 108 |
| 7 — `shortcut` → `user-avatar` + exports map | 0 | 22 | 79 |
| **Total** | **14** | **126** | **564** |

Severity key: **P1** breaks the public API contract · **P2** wrong pattern · **P3** cosmetic consistency.

### The five themes

1. **The blank line after `Props` is the single biggest item — 436 files.** It is not a scattering of slips; it is the *majority* behaviour in `landing/` (109 files, 80% of the folder) and `email-block-editor/` (60 files, 100%). Even `empty/components/empty-content.tsx` — the file you cited — and `section/components/section-title.tsx` violate it. **This must be a lint rule + codemod, not hand edits**, or it will simply regrow.
2. **`useRender` adoption is half-finished, and the seam runs between siblings.** The damaging pattern isn't "component X lacks it", it's that `Alert*` has it while `Banner*` doesn't; `Badge` has it while `ChipRoot` — which imports `badgeVariants` — doesn't; `BreadcrumbLink` has it while `BreadcrumbPage` doesn't; `Item.Root/Media/Group` have it while the other seven `Item` parts don't; `Section.Root/Title` have it while the other four `Section` parts don't. Consumers can't predict which parts accept `render`.
3. **Four components have no namespace object at all** — `filter/` (6 parts exported individually), `native-date-picker/` (3), `date-time-picker/` (5), and partially `spreadsheet/` (stray `NestedTableInput`). In three of them the `<component>.tsx` filename that §5 reserves for the namespace is occupied by a *part implementation*, which is why the drift happened.
4. **Bare `interface Props { … }` that extends nothing, with a hand-rolled `className?: string`.** ~35 parts. Each one silently closes off `id`, `ref`, `aria-*` and every DOM handler. Worst in `filter/` (all fields), `time-picker/` (a 25-key interface), `image-cropper/` (all 3), `datatable/` (6), `radius-map/`.
5. **Slot identity is lost in delegation.** 14 `landing/` parts and ~10 elsewhere render through a base component (`Heading`, `Text`, `Section`) and inherit *its* `data-slot`, so `PageHeader.Title`, `CtaBanner.Title`, `LandingHero.Root` etc. can't be targeted by CSS or tests.

### Two spec corrections the audit surfaced

The convention brief I gave the agents needs amending on two points, and I'd rather change the spec than 200 files:

- **§6 "blank line between external and `#/` imports" is not the house style.** It holds in only ~16 of 101 files in one chunk and ~92 files are "wrong" in another. Biome's `organizeImports` collapses the groups. **Recommendation: drop this rule from the spec** rather than fight the formatter.
- **`landing/`'s nested layout (`components/<sub>/root.tsx`) and compose-order namespace keys should be blessed, not fixed.** They're applied without a single exception across 16 sub-namespaces, and compose order reads better than §5's alphabetical rule. Flattening 136 files into siblings would be strictly worse.

---

## 2. Recommended order of attack

Sequenced so each step is independently reviewable and nothing conflicts:

| # | Step | Size | Notes |
|---|---|---|---|
| 1 | **Blank-line codemod** + Biome/ESLint rule to hold the line | 436 files, 1 commit | Purely mechanical. Do it first and alone, so it doesn't drown the real diffs. Land the *rule* in the same commit. |
| 2 | **Delete `export type { ToasterProps }`** (`sonner.tsx:11`) | 1 line | Closes the only §2 violation in the package. |
| 3 | **Give `filter/`, `native-date-picker/`, `date-time-picker/` namespaces** | 3 folders | Breaking change for consumers — batch with any other breaking work. Requires renaming the part currently occupying `<component>.tsx`. |
| 4 | **`sidebar/index.ts` must forward `useSidebar`**; move `NestedTableInput` (`spreadsheet`) and `ReviewItem` (`rating`) inside their namespaces | 3 barrels | `useSidebar` is a genuine API gap: `SidebarProvider` state is currently unreachable from `@voila.dev/ui/sidebar`. |
| 5 | **Hoist the 8 inline object props types** in `email-block-editor` to `interface Props` | 8 files | Then extract `lib/inline-format.ts` + `lib/money.ts` to break the real circular import between `block-toolbar.tsx` ⇄ `selection-link-button.tsx`. |
| 6 | **Widen the ~35 bare `Props` interfaces** to extend `React.ComponentProps<…>` | ~35 files | Additive, non-breaking, high value per line changed. |
| 7 | **`useRender` migration, grouped by sibling set** | ~60 parts | Do whole components at a time (all of `Banner`, all of `Section`, all of `Item`) — the inconsistency is what hurts, so half-migrating one component is worse than not starting it. |
| 8 | **Add the 24 missing slot identifiers** | 24 files | Mostly `landing/` delegation cases. |
| 9 | **Cosmetic sweep:** namespace JSDoc (11+ missing), rename `user-avatar/libs/` → `lib/`, rename JSX-free `.tsx` context files to `.ts` | low | Last. |

**Do not** attempt steps 1 and 7 in the same commit.

---

## 3. The convention spec used for this audit

This is the spec the audit was run against, amended per §1's two corrections. It's worth landing in the repo as the canonical reference (`packages/ui/CONTRIBUTING.md` or a `CLAUDE.md`), because several of the deviations below exist purely because the rule was never written down.

### 1. One part per file, folder per component

```
<component>/
  index.ts                      -> export { Component } from "#/<component>/components/<component>.tsx";
  components/
    <component>.tsx             -> the namespace object (NO part implementations here)
    <component>-root.tsx        -> one part per file
    <component>-<part>.tsx
    <component>.test.tsx
```

### 2. Props interface — non-exported, always named `Props`

```tsx
interface Props extends React.ComponentProps<"div"> {}
```

Rules:
- ALWAYS named exactly `Props`. Never `CardRootProps`, `FooProps`, `type Props = ...` when an
  interface extending a base type is possible.
- NEVER exported. Consumers reach the props through
  `React.ComponentProps<typeof Component.Part>`.
- ALWAYS `extends` something — the underlying Base UI part
  (`AccordionPrimitive.Root.Props`), `useRender.ComponentProps<"tag">`, or
  `React.ComponentProps<"tag">`. Never an inline `{ ... }` object literal in the
  function signature, never a bare `interface Props { ... }` when it wraps a DOM element.
- Empty body `{}` is correct and expected when there are no extra props.

### 3. Blank line between the `Props` interface and the component

**This is the single most common violation.** Correct:

```tsx
interface Props extends React.ComponentProps<"div"> {}

export function EmptyContent({ className, ...props }: Props) {
```

Incorrect (no blank line):

```tsx
interface Props extends React.ComponentProps<"div"> {}
export function EmptyContent({ className, ...props }: Props) {
```

If a JSDoc comment sits between them, the blank line goes **before the JSDoc**:

```tsx
interface Props extends useRender.ComponentProps<"h2"> {}

/** Renders an `h2` - pass `render` to fit the page's heading outline. */
export function SectionTitle({ className, render, ...props }: Props) {
```

### 4. `useRender` from Base UI for polymorphic primitives

Any part that renders a plain DOM element and should be re-targetable by the consumer
(headings, containers, text, links, buttons that may become an `<a>`, layout wrappers,
list items…) must use `useRender` + `mergeProps` instead of a raw JSX element.

Canonical shape (`card/components/card-root.tsx`, `section/components/section-title.tsx`):

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
		props: mergeProps<"div">(
			{ className: cn("…", className) },
			props,
		),
		render,
		state: { slot: "card", size },
	});
}
```

Notes:
- `render` must be destructured out of props and passed to `useRender`.
- `state` carries `slot` (kebab-case, matches the old `data-slot`) plus any variant that
  should become a `data-*` attribute for styling (`data-[size=sm]:…`).
- When the part is a thin wrapper over a Base UI primitive
  (`AccordionPrimitive.Root` etc.), do NOT use `useRender` — the primitive already
  supports `render`. Use `data-slot="…"` on the primitive instead. That is the
  correct pattern and should not be flagged.
- Parts that must render a specific element for semantics/behaviour and are not
  meant to be polymorphic (e.g. `<input>` wrappers) are acceptable as raw JSX —
  flag only if polymorphism would be genuinely useful.

### 5. Namespace export

`components/<component>.tsx` builds one frozen-shape object, `Root` first, then the
remaining parts. Existing code orders the rest alphabetically after `Root`:

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

- `index.ts` re-exports only the namespace (plus genuinely-public types/hooks).
- No individual part should be exported from `index.ts`.
- The namespace file should carry a short JSDoc (`/** The X parts as one namespace. */`).
  Many are missing it — flag as a low-severity consistency item.

### 6. Other style rules in force

- Tabs for indentation, double quotes, semicolons (Biome).
- Imports use the `#/` alias with an explicit `.tsx` / `.ts` extension.
- ~~Blank line between external and `#/` import groups~~ — **rule removed**: Biome
  collapses the groups, see §1. (`cn` comes from `#/lib/utils.ts`.)
- `export function` declarations — not `export const X = () => …`, not `React.FC`,
  not `forwardRef` (React 19: `ref` is a normal prop).
- Every part sets a slot identifier: `data-slot="…"` on plain/primitive JSX, or
  `state: { slot: "…" }` when using `useRender`.
- `cn()` always wraps `className` last: `cn("base classes", className)`.
- Default variant values live in the destructure (`size = "default"`).

### 7. Severity guide for the report

- **P1** — breaks the public API contract: exported `Props`, part exported directly
  from `index.ts`, missing namespace, `forwardRef`/`React.FC`, inline object props type.
- **P2** — wrong pattern: should use `useRender` but doesn't, `Props` not extending a
  base type, misnamed props interface, missing `data-slot`/`state.slot`.
- **P3** — cosmetic consistency: missing blank line after `Props`, missing namespace
  JSDoc, namespace key ordering, import grouping.

---

## 4. Per-chunk findings

Each section below is the full report for one slice of the package. `File` references are `path:line`.

---

### Part 1 — `accordion` → `combobox`

Scope: every non-test `.tsx` plus `index.ts` in `accordion, alert, alert-dialog, aspect-ratio, avatar, badge, banner, breadcrumb, button, button-group, calendar, card, carousel, chart, chat, checkbox, checkbox-group, chip, collapsible, color-picker, combobox`.

> **Cross-cutting note (counted once, not repeated per row).** §6 asks for a blank line between the external-package import block and the `#/` import block. Only `alert/*`, `card/*`, `alert-dialog-{footer,header,media}.tsx`, `aspect-ratio` (partly) and `checkbox-group` follow it; **92 files across 17 of the 21 folders** run the two groups together. Per-folder counts are listed at the end of each section as `import grouping: N files`. This is very likely Biome's `organizeImports` collapsing the groups — worth confirming the Biome config supports the intended blank line before mass-editing, since the canonical reference files (`card-root.tsx`, `alert-root.tsx`) do have it.

---

#### accordion
2 P3.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/accordion/components/accordion.tsx:6` | P3 | Namespace object has no JSDoc. | Add `/** The Accordion parts as one namespace. */` above `export const Accordion`. |

- import grouping: 4 files (`accordion-content.tsx:2`, `accordion-item.tsx:2`, `accordion-root.tsx:2`, `accordion-trigger.tsx:3`).

Otherwise exemplary: every part is a thin wrapper over `AccordionPrimitive.*` with `data-slot`, `interface Props extends …Props {}`, blank line present. Correctly does **not** use `useRender` (§4 note).

#### alert
1 P3.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/alert/components/alert.tsx:7` | P3 | Namespace object has no JSDoc. | Add `/** The Alert parts as one namespace. */`. |

This folder is the reference implementation for §4/§6 — `useRender` + `mergeProps` + `state: { slot }` everywhere, imports correctly grouped, blank lines correct.

#### alert-dialog
2 P3.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/alert-dialog/components/alert-dialog.tsx:15` | P3 | Namespace object has no JSDoc. | Add `/** The AlertDialog parts as one namespace. */`. |

- import grouping: 6 files (`alert-dialog-action.tsx:3`, `-cancel.tsx:3`, `-content.tsx:2`, `-description.tsx:2`, `-overlay.tsx:2`, `-title.tsx:2`).

Correct mix of primitive-wrapping parts (`data-slot`) and DOM-only parts (`Footer`/`Header`/`Media` use `useRender`).

#### aspect-ratio
Clean.

- import grouping: 1 file (`aspect-ratio.tsx:4`).

#### avatar
1 P3, 2 P2.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/avatar/components/avatar-group.tsx:6` | P2 | Pure layout wrapper renders a raw `<div>` with no `render` escape hatch, although the semantically right element is often a `<ul>`/`<ol>` of avatars. | Convert to `useRender`: `interface Props extends useRender.ComponentProps<"div"> {}` + `useRender({ defaultTagName: "div", props: mergeProps<"div">({ className: cn(…, className) }, props), render, state: { slot: "avatar-group" } })`. |
| `packages/ui/src/avatar/components/avatar-group-count.tsx:8` | P2 | Overflow-count chip renders a raw `<div>` with a `size` variant; consumers frequently want it as an `<a>`/`<button>` ("+3 more" opens a list). | Same `useRender` conversion, moving `data-size` into `state: { slot: "avatar-group-count", size }`. |
| `packages/ui/src/avatar/components/avatar.tsx:8` | P3 | Namespace object has no JSDoc. | Add `/** The Avatar parts as one namespace. */`. |

- import grouping: 6 files (all of `avatar/components/*.tsx`).

`AvatarBadge` is left alone deliberately — a status dot is a decorative `<span>` and re-targeting it buys nothing.

#### badge
1 P3.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/badge/components/badge.tsx:9` | P3 | `type Props = useRender.ComponentProps<"span"> & BadgeVariants;` rather than `interface Props extends …`. The intersection is actually *required* (`color` is `string` on `"span"` and a palette union in `BadgeVariants`, so `extends` would be rejected) but, unlike the identical case in `chip-root.tsx:8-11`, there is no comment saying so — so it reads as a violation of §2. | Keep the alias, add the same two-line justification comment `chip-root.tsx` carries. |

`index.ts` re-exports only the component plus genuinely-public variant types/maps — fine per §5.

#### banner
1 P3, 3 P2, 1 P3 (namespace re-export).

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/banner/components/banner-root.tsx:10` | P2 | Raw `<div role="status">` container; its exact twin `AlertRoot` (same cva-driven shape) uses `useRender`. Page-level banners are routinely a `<section>` or a framework `<Link>`-wrapped region. | Mirror `alert-root.tsx`: `interface Props extends useRender.ComponentProps<"div">, VariantProps<typeof bannerVariants> {}` and `useRender({ defaultTagName: "div", props: mergeProps<"div">({ role: "status", className: cn(bannerVariants({ variant }), className) }, props), render, state: { slot: "banner" } })`. |
| `packages/ui/src/banner/components/banner-title.tsx:6` | P2 | Text part renders a raw `<div>`; `AlertTitle` uses `useRender` so consumers can promote it to an `<h2>` in the page heading outline. | Convert to `useRender` with `state: { slot: "banner-title" }`. |
| `packages/ui/src/banner/components/banner-action.tsx:6` | P2 | Layout wrapper renders a raw `<div>`; `AlertAction` (identical role) uses `useRender`. | Convert to `useRender` with `state: { slot: "banner-action" }`. |
| `packages/ui/src/banner/components/banner.tsx:13` | P3 | The namespace file re-exports `bannerVariants`, duplicating `index.ts:2`. §5: the namespace file builds the namespace, nothing else. | Delete line 13; `index.ts` already re-exports it. |
| `packages/ui/src/banner/components/banner.tsx:6` | P3 | Namespace object has no JSDoc. | Add `/** The Banner parts as one namespace. */`. |

- import grouping: 4 files.

`BannerClose` is left as raw `<button>` — it has fixed button semantics and an `aria-label`, polymorphism buys nothing.

#### breadcrumb
6 P3 (blank line), 1 P2, 1 P3.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/breadcrumb/components/breadcrumb-page.tsx:5` | P2 | The current-page node renders a raw `<span aria-current="page">`, while its sibling `BreadcrumbLink` uses `useRender` — so half the leaf parts are polymorphic and half are not. Consumers routinely want the current page as an `<h1>` or a disabled `<a>`. | Convert to `useRender`: `interface Props extends useRender.ComponentProps<"span"> {}` + `useRender({ defaultTagName: "span", props: mergeProps<"span">({ "aria-current": "page", className: cn("font-normal text-foreground", className) }, props), render, state: { slot: "breadcrumb-page" } })`. |
| `packages/ui/src/breadcrumb/components/breadcrumb.tsx:9` | P3 | Namespace object has no JSDoc. | Add `/** The Breadcrumb parts as one namespace. */`. |

**Missing blank line after `Props`:**
- `packages/ui/src/breadcrumb/components/breadcrumb-ellipsis.tsx:6`
- `packages/ui/src/breadcrumb/components/breadcrumb-item.tsx:4`
- `packages/ui/src/breadcrumb/components/breadcrumb-link.tsx:5`
- `packages/ui/src/breadcrumb/components/breadcrumb-list.tsx:4`
- `packages/ui/src/breadcrumb/components/breadcrumb-page.tsx:4`
- `packages/ui/src/breadcrumb/components/breadcrumb-separator.tsx:5`

- import grouping: 6 files.

`BreadcrumbRoot` (`<nav>`), `BreadcrumbList` (`<ol>`), `BreadcrumbItem` (`<li>`) and `BreadcrumbSeparator` (`<li role="presentation">`) are intentionally **not** flagged: their elements are load-bearing for the breadcrumb's a11y structure.

#### button
Clean. Namespace JSDoc present, `interface Props extends ButtonPrimitive.Props, ButtonVariants`, `data-slot` + `data-variant/size/shape`, `index.ts` exports the component and its variant types only.

#### button-group
2 P3 (blank line), 2 P3.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/button-group/components/button-group.tsx:5` | P3 | Namespace file re-exports `buttonGroupVariants`, duplicating `index.ts:2`. | Delete line 5. |
| `packages/ui/src/button-group/components/button-group.tsx:7` | P3 | Namespace object has no JSDoc. | Add `/** The ButtonGroup parts as one namespace. */`. |

**Missing blank line after `Props`:**
- `packages/ui/src/button-group/components/button-group-separator.tsx:6`
- `packages/ui/src/button-group/components/button-group-text.tsx:5`

- import grouping: 3 files.

`ButtonGroupRoot` renders a raw `<div role="group">` but wraps a context provider and the `role` is load-bearing — not flagged.

#### calendar
1 P2, 1 P3.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/calendar/components/calendar-day-button.tsx:25` | P2 | The part sets no slot identifier — it renders `<Button>`, so the only `data-slot` in the DOM is `button`, and no CSS/testing hook targets the day cell button. | Add `data-slot="calendar-day-button"` alongside the existing `data-day`/`data-range-*` attributes. |
| `packages/ui/src/calendar/components/calendar.tsx:4` | P3 | Namespace object has no JSDoc. | Add `/** The Calendar parts as one namespace. */`. |

- import grouping: 2 files.

`calendar-root.tsx:16-29` uses `type Props = DistributiveOmit<…> & { … }` instead of an interface — **correct and not flagged**: it carries a comment explaining that an interface cannot extend a mapped type over react-day-picker's `mode` union.

#### card
6 P3 (blank line), 1 P3.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/card/components/card.tsx:9` | P3 | Namespace object has no JSDoc. | Add `/** The Card parts as one namespace. */`. |

**Missing blank line after `Props`:**
- `packages/ui/src/card/components/card-action.tsx:6`
- `packages/ui/src/card/components/card-content.tsx:6`
- `packages/ui/src/card/components/card-description.tsx:6`
- `packages/ui/src/card/components/card-footer.tsx:6`
- `packages/ui/src/card/components/card-header.tsx:6`
- `packages/ui/src/card/components/card-title.tsx:6`

Note `card-root.tsx` (the §4 canonical example) has the blank line; the six sibling parts do not — an easy, purely mechanical sweep.

#### carousel
2 P3 (blank line), 1 P2, 1 P3.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/carousel/components/carousel-item.tsx:6` | P2 | Slide wrapper renders a raw `<div role="group">`; the natural markup for a slide track is `<li>` inside a `<ul>`, and consumers cannot re-target it. | Convert to `useRender` with `defaultTagName: "div"`, keeping `role`/`aria-roledescription` in the merged props and `state: { slot: "carousel-item", orientation }`. |
| `packages/ui/src/carousel/components/carousel.tsx:8` | P3 | Namespace object has no JSDoc. | Add `/** The Carousel parts as one namespace. */`. |

**Missing blank line after `Props`:**
- `packages/ui/src/carousel/components/carousel-dots.tsx:5`
- `packages/ui/src/carousel/components/carousel-item.tsx:5`

- import grouping: 5 files.

`CarouselRoot` keeps its raw `<div>` (holds the embla ref, keydown capture and context provider) and `CarouselNext/Previous` delegate to `Button` — both fine.

#### chart
2 P3 (blank line), 4 P3.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/chart/components/chart.tsx:28` | P3 | The namespace file re-exports `useChartContext` and ten `export type` blocks (lines 77-90); §5 wants the namespace file to build the namespace and `index.ts` to own the public re-exports. | Move `export { useChartContext }` and the `export type` block into `chart/index.ts`, which already re-exports them transitively. |
| `packages/ui/src/chart/components/chart.tsx:46-72` | P3 | Namespace keys are ordered by draw order (`Root, Style, Grid, XAxis, …`) rather than `Root` + alphabetical. Deliberate and self-documenting, but it is the only namespace in the chunk that deviates. | Either alphabetize after `Root`, or add one line to the existing JSDoc stating the order is the drawing pipeline so the deviation is explicit. |
| `packages/ui/src/chart/components/chart-legend.tsx:7` | P3 | Bare `interface Props { content?; align?; className? }` — does not extend a base type, so the part silently drops `id`, `aria-*`, `data-*`. | `interface Props extends Omit<React.ComponentProps<"div">, "content"> { readonly content?: React.ReactNode; readonly align?: "top" \| "bottom"; }` and spread `...props` onto the portalled `<div>`. |
| `packages/ui/src/chart/components/chart-tooltip.tsx:7` | P3 | Same bare `interface Props`, same consequence. | Same treatment as `chart-legend.tsx`. |

**Missing blank line after `Props`** (JSDoc directly abuts the interface; §3 requires the blank line *before* the JSDoc):
- `packages/ui/src/chart/components/chart-donut.tsx:4`
- `packages/ui/src/chart/components/chart-empty.tsx:4`

- import grouping: 24 files.

Not flagged: `chart-cursor-band/-line.tsx`, `chart-tooltip-marker.tsx`, `chart-data-table.tsx`, `chart-style.tsx` all use a bare `interface Props {}` but are private composition helpers with fully-specified inputs (and `chart-style` renders a `<style>`, which has no other API). Also observed but stylistic only: `chart-area.tsx:9-14`, `chart-slice.tsx:5-8`, `chart-skeleton.tsx:5-12`, `chart-root.tsx:23-30` place the component's JSDoc *above* the `Props` interface with a blank line between, detaching it from the function it documents — worth normalising to the §3 shape.

#### chat
10 P3 (blank line), 2 P2, 2 P3.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/chat/components/chat-message.tsx:12` | P2 | The message bubble renders a raw `<div>` although its sibling `ChatConversationItem` uses `useRender`; a bubble is very often an `<li>` inside the message list or an `<article>`. | Convert to `useRender`: `interface Props extends useRender.ComponentProps<"div">, Required<Pick<ChatMessageVariants, "variant">> {}` + `state: { slot: "chat-message", variant }`. |
| `packages/ui/src/chat/components/chat-message-group.tsx:8` | P2 | Grouping wrapper renders a raw `<div>` whose `data-align` drives `group-data-[align=…]` styling on descendants; consumers grouping by sender want `<li>`/`<section>`. | Convert to `useRender` with `state: { slot: "chat-message-group", align }` (the `group` class must stay in the merged `className`). |
| `packages/ui/src/chat/components/chat.tsx:13` | P3 | Namespace object has no JSDoc, and it is the only namespace in the chunk with no `Root` key. | Add `/** The Chat parts as one namespace. */`, and note in it that Chat is a parts family without a root. |
| `packages/ui/src/chat/components/chat-conversation-item.tsx:10` | P3 | `type Props = useRender.ComponentProps<"div"> & { … }` — correctly justified by the comment on lines 8-9 (`title` is a `ReactNode`). No change needed; listed only so it is not re-flagged. | — |

**Missing blank line after `Props`:**
- `packages/ui/src/chat/components/chat-composer.tsx:35`
- `packages/ui/src/chat/components/chat-composer-footer.tsx:9`
- `packages/ui/src/chat/components/chat-composer-input.tsx:19`
- `packages/ui/src/chat/components/chat-conversation-item-meta.tsx:10`
- `packages/ui/src/chat/components/chat-conversation-item-text.tsx:9`
- `packages/ui/src/chat/components/chat-conversation-item-timestamp.tsx:7`
- `packages/ui/src/chat/components/chat-conversation-item-unread-badge.tsx:6`
- `packages/ui/src/chat/components/chat-date-separator.tsx:4`
- `packages/ui/src/chat/components/chat-message-time.tsx:4`
- `packages/ui/src/chat/components/chat-unread-separator.tsx:4`

- import grouping: 14 files.

Not flagged: the bare `interface Props {}` in `chat-composer-footer/-input.tsx`, `chat-conversation-item-{meta,text,timestamp,unread-badge}.tsx` and `chat-external-link-dialog.tsx` — these are private composition helpers that never spread onto a DOM node. `ChatMessageList` keeps its raw `<div>` (owns a scroll ref and scroll handlers). `ChatMessageText` keeps its `<span>` (it *is* the linkified inline flow).

#### checkbox
Clean. Single-component folder; `interface Props extends CheckboxPrimitive.Root.Props`, `data-slot` on root and indicator.

- import grouping: 1 file (`checkbox.tsx:3`).

#### checkbox-group
Clean. Single-component folder, JSDoc present, correct `Props`, blank line, `data-slot`.

#### chip
1 P3 (blank line), 1 P2.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/chip/components/chip-root.tsx:18` | P2 | Renders a raw `<span>` while `Badge` — which it explicitly builds on, sharing `badgeVariants` and the same variant axes — uses `useRender`. A chip is regularly an `<a>` (filter link) or `<li>` (selected-tags list). | Convert to `useRender` keeping the intersection type: `type Props = useRender.ComponentProps<"span"> & BadgeVariants;` and `state: { slot: "chip", variant, color, size }` in place of the manual `data-variant/color/size`. |

**Missing blank line after `Props`:**
- `packages/ui/src/chip/components/chip-remove.tsx:5`

- import grouping: 1 file.

Namespace JSDoc present. `chip-root.tsx:8-10` documents why `Props` is an intersection — the pattern `badge.tsx` should copy.

#### collapsible
3 P3 (blank line), 2 P3.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/collapsible/components/collapsible-root.tsx:9` | P3 | `className={cn(className)}` — `cn` with a single argument does nothing but obscure that the part adds no classes. | `className={className}` (as `breadcrumb-root.tsx:10` does). |
| `packages/ui/src/collapsible/components/collapsible-trigger.tsx:9` | P3 | Same redundant `cn(className)`. | Same fix. |

**Missing blank line after `Props`:**
- `packages/ui/src/collapsible/components/collapsible-content.tsx:4`
- `packages/ui/src/collapsible/components/collapsible-root.tsx:4`
- `packages/ui/src/collapsible/components/collapsible-trigger.tsx:4`

- import grouping: 3 files.

Namespace JSDoc present.

#### color-picker
2 P3.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/color-picker/components/color-picker.tsx:2` | P3 | Imports `{ useRef, useState }` as named React imports while the rest of the package uses `import * as React` / `import type * as React` and calls `React.useState`. Line 79 then uses the bare global `React.KeyboardEvent` type with no `React` import in scope. | `import * as React from "react";` and use `React.useRef` / `React.useState`. |
| `packages/ui/src/color-picker/components/color-picker.tsx:26` | P3 | Bare `interface Props { … }` not extending a base type. Acceptable for a fully-composed control (it never spreads onto a DOM node) but it means `id`, `aria-*` and `data-*` cannot reach the trigger. | Optionally `extends Omit<React.ComponentProps<typeof Button>, "value" \| "defaultValue" \| "onChange">` and forward the rest onto the `Popover.Trigger` button. |

Component JSDoc present; `index.ts` clean.

#### combobox
13 P3 (blank line), 1 P3.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/combobox/components/combobox.tsx:40` | P3 | The namespace file re-exports `useComboboxAnchor`, and `index.ts` then re-exports it *through* the namespace file rather than from the hook module. | Delete line 40; make `index.ts` do `export { Combobox } from "…/combobox.tsx"; export { useComboboxAnchor } from "#/combobox/hooks/use-combobox-anchor.ts";` — the shape `carousel/index.ts:7` already uses. |

**Missing blank line after `Props`:**
- `packages/ui/src/combobox/components/combobox-chips.tsx:4`
- `packages/ui/src/combobox/components/combobox-chips-input.tsx:4`
- `packages/ui/src/combobox/components/combobox-clear.tsx:5`
- `packages/ui/src/combobox/components/combobox-collection.tsx:3`
- `packages/ui/src/combobox/components/combobox-empty.tsx:4`
- `packages/ui/src/combobox/components/combobox-group.tsx:3`
- `packages/ui/src/combobox/components/combobox-item.tsx:9`
- `packages/ui/src/combobox/components/combobox-label.tsx:5`
- `packages/ui/src/combobox/components/combobox-list.tsx:4`
- `packages/ui/src/combobox/components/combobox-row.tsx:3`
- `packages/ui/src/combobox/components/combobox-separator.tsx:5`
- `packages/ui/src/combobox/components/combobox-trigger.tsx:5`
- `packages/ui/src/combobox/components/combobox-value.tsx:3`

- import grouping: 12 files.

Namespace JSDoc present; every part wraps a Base UI primitive with `data-slot` and correctly avoids `useRender`. `combobox-root.tsx:6-9` documents why it carries no `data-slot`.

---

#### Chunk 1 summary

**Counts**

| Severity | Count |
| --- | --- |
| P1 | 0 |
| P2 | 12 |
| P3 | 63 (38 missing-blank-line + 11 missing namespace JSDoc + 14 other) |
| — plus the cross-cutting import-grouping item: | 92 files / 17 folders |

No P1 findings at all: nothing exports `Props`, no `index.ts` leaks an individual part, there is no `forwardRef`, no `React.FC`, no `export const X = () =>` component, and no inline object props type in a signature. The public API contract is intact across all 21 folders.

**Top themes**

1. **Missing blank line after `Props` (38 sites, 8 folders).** By far the highest-volume item, exactly as §3 predicts. It clusters: all six non-root `card` parts, thirteen `combobox` parts, all six `breadcrumb` parts, ten `chat` parts, all three `collapsible` parts. Purely mechanical — a codemod or a Biome rule would close it in one pass. Two of them (`chart-donut.tsx:4`, `chart-empty.tsx:4`) are the JSDoc variant where the blank line belongs *before* the doc comment.

2. **Import grouping is inverted almost everywhere (92 files).** The convention's own reference files (`card-root.tsx`, `alert-root.tsx`) separate external from `#/` imports with a blank line, but 17 of 21 folders run them together. This smells like a formatter/convention conflict rather than 92 independent slips — resolve at the Biome-config level before editing files.

3. **`useRender` adoption is inconsistent *between siblings that share a recipe* (12 P2s).** The clearest cases are pairs: `Alert*` uses `useRender` but the structurally identical `Banner*` does not; `Badge` uses it but `ChipRoot`, which literally imports `badgeVariants`, does not; `BreadcrumbLink`/`Ellipsis` use it but `BreadcrumbPage` does not; `ChatConversationItem` uses it but `ChatMessage`/`ChatMessageGroup` do not. Aligning each pair is a small, high-value consistency win — and I deliberately left semantically load-bearing elements (`<nav>`, `<ol>`, `<li>` separators, `<input>`/`<button>` wrappers, scroll containers) alone.

4. **Namespace files are drifting past "just the namespace" (11 missing JSDoc, 4 stray re-exports).** Only 4 of 15 real namespace files carry the `/** The X parts as one namespace. */` doc. Separately, `banner.tsx:13`, `button-group.tsx:5`, `combobox.tsx:40` and `chart.tsx:28,77-90` re-export variants/hooks/types from the namespace file — in three of those cases duplicating what `index.ts` already does, and in `combobox`'s case making `index.ts` import a hook *through* the namespace file.

5. **Every `type Props = …` deviation is legitimate, but only some say so.** `calendar-root.tsx`, `chip-root.tsx` and `chat-conversation-item.tsx` each carry a comment explaining why an `interface … extends` is impossible (mapped type over a union; conflicting `color`; conflicting `title`). `badge/components/badge.tsx:9` has the identical `color` conflict and no comment, so it reads as a plain §2 violation — add the comment rather than "fix" the type.

---

### Part 2 — `command` → `dropdown-menu`

Scope: `command`, `confirm-dialog`, `context-menu`, `copyable-text`, `datatable`, `date-picker`,
`date-time-picker`, `dialog`, `direction`, `drawer`, `dropdown-menu`.

#### command

Fully conventional: every part is a thin `cmdk` wrapper with `data-slot`, non-exported `Props extends …`, a proper namespace with JSDoc. Only cosmetic issues.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/command/components/command-shortcut.tsx:5` | P3 | `{ ...props }: Props` rest-destructures only to re-spread — pure noise, repeated across the chunk. | `export function CommandShortcut(props: Props)` |

**Missing blank line after `Props`:**
- `packages/ui/src/command/components/command-empty.tsx:6`
- `packages/ui/src/command/components/command-group.tsx:6`
- `packages/ui/src/command/components/command-input.tsx:8`
- `packages/ui/src/command/components/command-item.tsx:8`
- `packages/ui/src/command/components/command-list.tsx:6`
- `packages/ui/src/command/components/command-root.tsx:6`
- `packages/ui/src/command/components/command-separator.tsx:8`
- `packages/ui/src/command/components/command-shortcut.tsx:5`

#### confirm-dialog

One composed recipe; the props interface is a bare object literal that closes the component off entirely.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/confirm-dialog/components/confirm-dialog.tsx:6` | P2 | `interface Props { … }` extends nothing and re-declares `open`/`onOpenChange` by hand, so no `className`, `id`, `aria-*` or any other `AlertDialog.Root` prop reaches the dialog. | `interface Props extends Omit<React.ComponentProps<typeof AlertDialog.Root>, "children">` and drop the duplicated `open`/`onOpenChange` members. |

#### context-menu

Textbook Base UI wrapping — `data-slot` on every primitive, no `useRender` (correct, the primitives already take `render`), namespace ordered `Root` then alphabetical with JSDoc. Only blank lines and the rest-destructure tic.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/context-menu/components/context-menu-group.tsx:4` | P3 | `{ ...props }: Props` noise; same in `context-menu-portal.tsx:4`, `context-menu-radio-group.tsx:4`, `context-menu-root.tsx:4`, `context-menu-sub.tsx:4`, `context-menu-shortcut.tsx:5`. | Take `props` directly: `({ ...props }: Props)` → `(props: Props)`. |

**Missing blank line after `Props`:**
- `packages/ui/src/context-menu/components/context-menu-group.tsx:4`
- `packages/ui/src/context-menu/components/context-menu-portal.tsx:4`
- `packages/ui/src/context-menu/components/context-menu-radio-group.tsx:4`
- `packages/ui/src/context-menu/components/context-menu-root.tsx:4`
- `packages/ui/src/context-menu/components/context-menu-separator.tsx:6`
- `packages/ui/src/context-menu/components/context-menu-shortcut.tsx:5`
- `packages/ui/src/context-menu/components/context-menu-sub-content.tsx:6`
- `packages/ui/src/context-menu/components/context-menu-sub.tsx:4`
- `packages/ui/src/context-menu/components/context-menu-trigger.tsx:5`

#### copyable-text

Single component, sound behaviour, but its props type is closed.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/copyable-text/components/copyable-text.tsx:5` | P2 | `interface Props { … }` extends nothing over a real `<button>`, so `id`, `ref`, `disabled`, `onFocus`, `data-*` and the rest are unreachable, and the hand-rolled `className` is the only escape hatch. | `interface Props extends React.ComponentProps<"button"> { value: string; label?: string; muted?: boolean; copyLabel?: string; copiedLabel?: string; }` then spread `...props` onto the button. |

#### datatable

The largest deviation in the chunk: the public parts hand-roll `className?: string` instead of extending a base type, several public parts carry no slot identifier, and the folder/file/module naming does not line up with the rest of the kit.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/datatable/components/data-table-root.tsx:12` | P2 | `Props` extends `UseDataTableOptions` only and re-declares `className?: string`; the root renders a `div` but swallows every other DOM prop (`id`, `aria-*`, `ref`). | `interface Props<TData, TValue> extends UseDataTableOptions<TData, TValue>, Omit<React.ComponentProps<"div">, "children">` and drop the manual `className`. |
| `packages/ui/src/datatable/components/data-table-density-toggle.tsx:6` | P2 | Public namespace part with a bare `interface Props { … }` + manual `className`, and no `data-slot` on the rendered trigger. | Extend the button it renders (`Omit<React.ComponentProps<typeof Button>, "onChange">`) and add `data-slot="data-table-density-toggle"`. |
| `packages/ui/src/datatable/components/data-table-export.tsx:6` | P2 | Same: bare `Props`, manual `className`, no `data-slot`. | Extend `React.ComponentProps<typeof Button>`, add `data-slot="data-table-export"`. |
| `packages/ui/src/datatable/components/data-table-view-options.tsx:6` | P2 | Same: bare `Props`, manual `className`, no `data-slot`. | Extend `React.ComponentProps<typeof Button>`, add `data-slot="data-table-view-options"`. |
| `packages/ui/src/datatable/components/data-table-empty.tsx:4` | P2 | Public namespace part (`DataTable.Empty`) with a bare `Props` and no `className`/DOM passthrough to `Empty.Root`. | `interface Props extends React.ComponentProps<typeof Empty.Root> { title?: string; description?: string }`. |
| `packages/ui/src/datatable/components/data-table-pagination.tsx:10` | P2 | Bare `Props` over a `div` that already sets `data-slot="data-table-pagination"`; no `className`/DOM passthrough at all. | Add `extends Omit<React.ComponentProps<"div">, "children">`. |
| `packages/ui/src/datatable/components/data-table-toolbar.tsx:10` | P2 | Layout wrapper rendering a raw `div`; consumers routinely want the toolbar to be a `<form>` or `<section>`, which is exactly the `render` case. | `interface Props extends useRender.ComponentProps<"div">` + `useRender({ defaultTagName: "div", props: mergeProps<"div">(…), render, state: { slot: "data-table-toolbar" } })`. |
| `packages/ui/src/datatable/components/data-table-filters.tsx:9` | P2 | Same — a filter bar is frequently a `<form>`, and it currently hard-codes `div` + `role="group"`. | Convert to `useRender` with `state: { slot: "data-table-filters" }`. |
| `packages/ui/src/datatable/components/data-table-actions.tsx:9` | P2 | Same — end-aligned action group, a natural `render` target (`<nav>`, `<form>`). | Convert to `useRender` with `state: { slot: "data-table-actions" }`. |
| `packages/ui/src/datatable/components/data-table.tsx:1` | P3 | Folder is `datatable/` but every module and the namespace file are `data-table*`; §1 wants `components/<component>.tsx` to match the folder. | Rename the folder to `data-table/` (and the `#/datatable/**` import specifiers) so folder, files and namespace agree. |
| `packages/ui/src/datatable/libs/density.ts:1` | P3 | `libs/` is unique to this component — the shared helper module is `#/lib/utils.ts`; no other folder in the chunk has a `libs/`. | Settle on one name across the package (`libs/` per-component vs `lib/` shared) and align. |
| `packages/ui/src/datatable/components/data-table-selection-column.tsx:4` | P3 | Lives in `components/` but exports no component — it is a column factory typed with `interface Options<TData>`, not `Props`. | Move to `datatable/libs/selection-column.ts`; `Options` is the right name there. |
| `packages/ui/src/datatable/components/data-table-mobile-card.tsx:18` | P3 | Renders a raw `button`/`div` with no slot identifier, unlike its sibling `data-table-mobile-list`. | Add `data-slot="data-table-mobile-card"` to both branches. |

Not flagged, and deliberately so: the internal composition parts (`data-table-body-cell`, `-body-row`, `-desktop-table`, `-head-cell`, `-header`, `-rows`, `-loading-overlay`, `-resize-handle`, `-sort-caret`, `-mobile-card-list`) use bare `interface Props<TData> { … }`, which is correct — they take table objects, not DOM props, and are not part of the namespace. `UseDataTableOptions` being exported from `hooks/use-data-table.ts` is a hook options type, not a component props type, so §2 does not apply.

**Missing blank line after `Props`:**
- `packages/ui/src/datatable/components/data-table-actions.tsx:5`
- `packages/ui/src/datatable/components/data-table-filters.tsx:5`
- `packages/ui/src/datatable/components/data-table-search.tsx:7`
- `packages/ui/src/datatable/components/data-table-toolbar.tsx:5`

#### date-picker

Namespace and parts are in good shape; the range picker escapes the namespace and one part invents a prop that collides with a DOM attribute.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/date-picker/index.ts:5` | P2 | `DateRangePicker` is exported as its own top-level component instead of joining the namespace, so the folder has two public entry points (§5: `index.ts` re-exports only the namespace). | Add `Range: DateRangePicker` to the `DatePicker` object in `date-picker.tsx` and drop the extra export line. |
| `packages/ui/src/date-picker/components/date-picker-trigger.tsx:10` | P2 | The custom `slot?: string` prop shadows the real HTML `slot` attribute already present in `React.ComponentProps<typeof Button>`, so the DOM attribute can never be set and the intent (which `data-slot` to stamp) is invisible at the call site. | Rename to `slotName` (or `dataSlot`) and keep `data-slot={slotName}`. |
| `packages/ui/src/date-picker/components/date-picker-content.tsx:4` | P2 | `interface Props { children: React.ReactNode }` extends nothing while wrapping `Popover.Content`; `className`, `align`, `side` etc. are unreachable. | `interface Props extends React.ComponentProps<typeof Popover.Content> {}` and spread `...props`. |
| `packages/ui/src/date-picker/components/date-picker-format.ts:1` | P3 | `date-picker-format.ts` and `date-picker-props.ts` are non-component modules sitting in `components/`, while `datatable` puts the same kind of module in `libs/`. | Move both to `date-picker/libs/`. |
| `packages/ui/src/date-picker/components/date-picker-hidden-input.tsx:10` | P3 | Brace-less single-line `if (!name) return null;`, whereas the sibling `date-range-picker-hidden-inputs.tsx:11` braces the identical guard. Same in `date-picker-root.tsx:49` and `:52`. | Brace every guard, matching the majority style. |

#### date-time-picker

The one folder in the chunk with no namespace at all — five components exported side by side, and the file that should hold the namespace holds a part instead.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/date-time-picker/index.ts:1` | P2 | Five separate top-level exports (`DateTimePicker`, `DateTimeRangeInput`, `NativeDateTimeInput`, `ResponsiveDateTimeInput`, `ShiftTimeRangeInput`) instead of one namespace — §5's "no individual part exported from `index.ts`". | Build a namespace: `export const DateTimePicker = { Root, Native, Responsive, Range, ShiftRange }` in a new `components/date-time-picker.tsx`, and export only it (plus `type DateTimeRange`). |
| `packages/ui/src/date-time-picker/components/date-time-picker.tsx:42` | P2 | The file named like the namespace file (§1: `components/<component>.tsx` = the namespace object, no part implementations) actually implements the popover picker. | Rename the implementation to `date-time-picker-root.tsx` and free the name for the namespace object. |
| `packages/ui/src/date-time-picker/components/shift-step-tab.tsx:1` | P2 | Bare `interface Props { … }` over a raw `<button>` with no `data-slot` and no DOM passthrough (no `className`, `disabled`, `ref`). | `interface Props extends React.ComponentProps<"button">` + `data-slot="shift-step-tab"`, spread `...props`. |
| `packages/ui/src/date-time-picker/components/date-time-option-list.tsx:32` | P2 | The `role="listbox"` container carries no slot identifier; same for `shift-time-list.tsx:39`, `shift-step-tabs.tsx:20`, `shift-picker-body.tsx:37` and the grid in `date-time-range-input.tsx:93`. | Add `data-slot="date-time-option-list"` / `"shift-time-list"` / `"shift-step-tabs"` / `"shift-picker-body"` / `"date-time-range-input"`. |
| `packages/ui/src/date-time-picker/components/date-time-values.ts:49` | P3 | `useTimeOptions` is a React hook living in `components/`; other folders keep hooks in `hooks/` (`datatable/hooks/`, `#/hooks/use-picker-state.ts`). | Move the hook to `date-time-picker/hooks/use-time-options.ts` and leave the pure formatters in `libs/`. |
| `packages/ui/src/date-time-picker/components/shift-time-range-input.tsx:19` | P3 | `export type { DateTimeRange }` is re-exported from two different modules (`date-time-range-input.tsx:12` as well) plus the source `date-time-range.ts`, giving the same public type three provenances. | Re-export it once, from the namespace/index. |

#### dialog

The cleanest compound in the chunk: every part wraps a Base UI primitive with `data-slot`, `Props` always extends the primitive's props, namespace is `Root`-first alphabetical with JSDoc. Two structural nits, then blank lines.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/dialog/components/dialog-content.tsx:4` | P2 | The part imports `DialogContentSize` from the namespace file `dialog.tsx`, which in turn imports the part — a namespace↔part import cycle, and it puts a type declaration in a file §1 reserves for the namespace object. | Move the type to `dialog/components/dialog-variants.ts` and have both `dialog.tsx` and `dialog-content.tsx` import it from there. |
| `packages/ui/src/dialog/components/dialog-header.tsx:5` | P2 | Layout wrapper rendering a hard-coded `div`; a dialog header is a natural `<header>`/`<hgroup>`, which is the §4 `render` case. Same for `dialog-footer.tsx:9` (`<footer>`). | Convert both to `useRender` + `mergeProps` with `state: { slot: "dialog-header" }` / `{ slot: "dialog-footer" }`. |
| `packages/ui/src/dialog/components/dialog.tsx:14` | P3 | No blank line between the `DialogContentSize` type declaration and the namespace JSDoc. | Insert a blank line (moot if the type moves out, above). |

**Missing blank line after `Props`:**
- `packages/ui/src/dialog/components/dialog-close.tsx:4`
- `packages/ui/src/dialog/components/dialog-content.tsx:15`
- `packages/ui/src/dialog/components/dialog-description.tsx:5`
- `packages/ui/src/dialog/components/dialog-footer.tsx:9`
- `packages/ui/src/dialog/components/dialog-header.tsx:5`
- `packages/ui/src/dialog/components/dialog-overlay.tsx:5`
- `packages/ui/src/dialog/components/dialog-portal.tsx:4`
- `packages/ui/src/dialog/components/dialog-root.tsx:4`
- `packages/ui/src/dialog/components/dialog-title.tsx:5`
- `packages/ui/src/dialog/components/dialog-trigger.tsx:4`

#### direction

Compliant. `direction.tsx` is a documented pass-through re-export of Base UI's `DirectionProvider`/`useDirection`; there are no parts to namespace, and `index.ts` exports only the provider, the hook and a type — exactly what §5 allows. No findings.

#### drawer

Conventional throughout. The known `drawer-root.tsx` deviation turns out to be justified; the only real gap is a missing slot on the portal.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/drawer/components/drawer-root.tsx:6` | — | `type Props = React.ComponentProps<typeof DrawerPrimitive.Root>` instead of `interface Props extends …`. **No change needed**: vaul's root props are a controlled/uncontrolled union, which an `interface` cannot extend, and the file says so in a comment. It is still named `Props` and still unexported, satisfying §2's real constraints. | Leave as is; keep the explanatory comment so it does not get "fixed" later. |
| `packages/ui/src/drawer/components/drawer-portal.tsx:6` | P3 | The only part in the folder with no slot identifier — every sibling (and `Dialog.Portal`, `ContextMenu.Portal`) stamps one. | `<DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />`. |
| `packages/ui/src/drawer/components/drawer-header.tsx:5` | P2 | Layout wrapper on a hard-coded `div` that would benefit from `render` (`<header>`); same for `drawer-footer.tsx:5` (`<footer>`). | Convert both to `useRender` + `mergeProps` with `state: { slot: "drawer-header" }` / `{ slot: "drawer-footer" }`. |

`drawer-handle.tsx` is intentionally left alone — it is an `aria-hidden` decorative bar, so polymorphism buys nothing.

**Missing blank line after `Props`:**
- `packages/ui/src/drawer/components/drawer-close.tsx:5`
- `packages/ui/src/drawer/components/drawer-description.tsx:7`
- `packages/ui/src/drawer/components/drawer-footer.tsx:5`
- `packages/ui/src/drawer/components/drawer-handle.tsx:5`
- `packages/ui/src/drawer/components/drawer-header.tsx:5`
- `packages/ui/src/drawer/components/drawer-overlay.tsx:6`
- `packages/ui/src/drawer/components/drawer-portal.tsx:5`
- `packages/ui/src/drawer/components/drawer-title.tsx:6`
- `packages/ui/src/drawer/components/drawer-trigger.tsx:5`

#### dropdown-menu

Clean — mirrors `context-menu` exactly, `data-slot` everywhere (including the indicator spans), correct no-`useRender` treatment of Base UI primitives, namespace ordered and documented. Blank lines only.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/src/dropdown-menu/components/dropdown-menu-group.tsx:4` | P3 | `{ ...props }: Props` noise; same in `-portal.tsx:4`, `-radio-group.tsx:4`, `-root.tsx:4`, `-sub.tsx:4`, `-trigger.tsx:4`, `-shortcut.tsx:5`. | `(props: Props)`. |

**Missing blank line after `Props`:**
- `packages/ui/src/dropdown-menu/components/dropdown-menu-group.tsx:4`
- `packages/ui/src/dropdown-menu/components/dropdown-menu-portal.tsx:4`
- `packages/ui/src/dropdown-menu/components/dropdown-menu-radio-group.tsx:4`
- `packages/ui/src/dropdown-menu/components/dropdown-menu-root.tsx:4`
- `packages/ui/src/dropdown-menu/components/dropdown-menu-separator.tsx:6`
- `packages/ui/src/dropdown-menu/components/dropdown-menu-shortcut.tsx:5`
- `packages/ui/src/dropdown-menu/components/dropdown-menu-sub-content.tsx:6`
- `packages/ui/src/dropdown-menu/components/dropdown-menu-sub.tsx:4`
- `packages/ui/src/dropdown-menu/components/dropdown-menu-trigger.tsx:4`

#### Chunk 2 summary

**Counts by severity**

| Severity | Count |
| --- | --- |
| P1 | 0 |
| P2 | 21 |
| P3 | 12 substantive + 49 `missing blank line after Props` occurrences |

No P1: nothing in this chunk exports a `Props` type, uses `forwardRef`/`React.FC`, or types props inline in a function signature. `index.ts` files are all thin, and every compound component that should have a namespace has one except `date-time-picker`.

**Themes**

1. **Bare `interface Props { … }` on public parts.** The dominant P2. `confirm-dialog`, `copyable-text`, `shift-step-tab`, `date-picker-content` and six `datatable` parts declare a closed object type — usually with a hand-rolled `className?: string` — instead of extending `React.ComponentProps<…>` or the primitive they wrap, which silently closes off `id`, `ref`, `aria-*` and event handlers. Extending the base type is a mechanical, non-breaking fix in every case.
2. **`datatable` is the outlier folder.** Folder name (`datatable`) disagrees with its module and namespace names (`data-table*`), it is the only folder with a `libs/`, it has a non-component module in `components/`, and four of its public parts carry neither a slot identifier nor a base props type.
3. **`date-time-picker` has no namespace.** Five components exported side by side from `index.ts`, and the file that §1 reserves for the namespace object (`components/date-time-picker.tsx`) holds a part implementation. This is the only §5 miss in the chunk (with `date-picker`'s stray `DateRangePicker` export a smaller instance of the same drift).
4. **`useRender` gap on layout wrappers.** Header/footer/toolbar/filters/actions regions (`dialog`, `drawer`, `datatable`) hard-code a `div` where `<header>`, `<footer>`, `<form>` or `<nav>` is the semantically right element — the exact case §4 describes. The Base UI-primitive wrappers (`context-menu`, `dropdown-menu`, `dialog`, `drawer`) correctly do *not* use `useRender` and should not be touched.
5. **Missing slot identifiers on raw containers.** Nine raw `div`/`button` containers across `date-time-picker` and `datatable` render with no `data-slot`, breaking the `*:data-[slot=…]` styling contract the rest of the kit relies on. `drawer-portal.tsx` is the sole primitive wrapper missing one.

---

### Part 3 — `email-block-editor`

Scope: `packages/ui/src/email-block-editor/**` (88 `.tsx` + 6 `.ts`), plus `index.ts`.
All findings below were confirmed by reading the file, not just by pattern match.

#### Layout & structure

**Current layout** — `email-block-editor/` is the *only* folder in the package with **no
`components/` directory**:

```
email-block-editor/
  index.ts
  email-block-editor.tsx        <- the root component, at the folder root
  block-settings-sheet.tsx      <- a part, also at the folder root
  theme.ts
  blocks/      (54 files)  block registry: <type>-block.tsx + -view.tsx + -settings.tsx + shared card pieces
  sections/    (30 files)  editor chrome: canvas, sidebar, toolbars, option rows
  sections/block-options/  (10 files)
  dnd/         (4 files)   dnd-kit wrappers
  document/    (5 files)   reducer + types + rich-text (pure, tested)
  lib/         (1 file)    use-media-query
```

For reference, every other multi-folder component in the package is `components/` + an
auxiliary folder (`button-group`, `carousel`, `chart`, `datatable`, `sidebar`,
`spreadsheet`, `image-cropper`, `landing`, … all `['components', <aux>]`).
`email-block-editor` is the single outlier.

**Recommendation — normalize, but only partially.**

1. **`sections/` → `components/`** (P2). `sections/` is exactly what `components/` is
   everywhere else: one React part per file. There is no reason for the different name,
   and it is the thing that makes the folder look alien. Rename the folder; keep
   `sections/block-options/` as `components/block-options/` (a sub-grouping of ten sibling
   parts is fine and reads well).
2. **Move the two root-level `.tsx` files into `components/`** (P2):
   `email-block-editor.tsx` → `components/email-block-editor.tsx`,
   `block-settings-sheet.tsx` → `components/block-settings-sheet.tsx`. Every other
   component in the package puts its root part under `components/`; here they sit loose
   at the folder root next to `index.ts` and `theme.ts`.
3. **Keep `blocks/`** (no change). This deviation *is* justified: `blocks/` is not a set of
   UI parts, it is a **plugin registry**. `block-definitions.tsx` documents the contract
   ("add its interface to `document/types.ts`, write one `blocks/<type>-block.tsx`
   exporting a definition, and register it below"), and the mapped type
   `{ [T in EmailEditorBlockType]: EmailBlockDefinition<…> }` makes a missing entry a
   compile error. Thirteen block triplets under `components/` would drown the twenty
   genuine chrome parts. Treat `blocks/` the way `chart/core/` or `datatable/libs/` are
   treated: a named auxiliary folder, which the package already permits.
4. **Keep `dnd/`, `document/`, `lib/`** (no change). Same rationale as `sidebar/lib/`,
   `carousel/hooks/`, `image-cropper/context/`.

**Public surface** — `index.ts` is small and mostly right, but has two problems:

- No namespace object (§5). This is defensible: `EmailBlockEditor` is a *single* controlled
  component, not a multi-part compound like `Card`/`Empty`. Nothing here is `Root` + parts
  that a consumer composes. **Do not invent an `EmailBlockEditor.*` namespace** — flagging
  this as a §5 violation would be cargo-culting. It is the one place in the package where a
  bare component export is the honest shape.
- `index.ts:6` exports `gridBlockDefinition` on its own, and nothing else from `blocks/`.
  Either the whole registry is public (`EMAIL_BLOCK_DEFINITIONS`, `EMAIL_BLOCK_TYPES`,
  `EMAIL_LEAF_BLOCK_TYPES`) or none of it is. One arbitrary block definition leaking out is
  an accident, not an API. See the table below.
- **No `Props` interface is exported anywhere in the folder** — zero P1 violations of §2's
  "never exported" rule. Good.
- Everything under `blocks/`, `sections/`, `dnd/` is internal (unreachable from `index.ts`).
  This materially changes the §2/§4 verdict: these parts do not forward `className`, do not
  accept DOM props, and cannot be styled or re-targeted by a consumer. So a bare
  `interface Props { … }` of pure data props is **correct here**, not a violation, and
  `useRender` is mostly not warranted. I have flagged only the handful where it genuinely is.

---

##### `blocks/`

| File | Sev | Issue | Fix |
| --- | --- | --- | --- |
| `blocks/block-text-input.tsx:20` | P1 | Inline object props type in the signature (§2, §7). Six props declared as `}: { value: string; … }`. | Hoist to `interface Props { value: string; onChange: (value: string) => void; ariaLabel: string; placeholder?: string; className?: string; style?: CSSProperties }` above the component. |
| `blocks/rich-text-editable.tsx:25` | P1 | Inline object props type (§2, §7). | Same: hoist to `interface Props { … }`. |
| `blocks/block-text-input.tsx:40` | P2 | `className` merged with a template literal, not `cn()` (§6): `` `w-full … ${className ?? ""}` ``. Ordering conflicts silently win instead of being resolved by tailwind-merge. | `className={cn("w-full resize-none … placeholder:opacity-40", className)}` + `import { cn } from "#/lib/utils.ts";` |
| `blocks/rich-text-editable.tsx:76-84` | P2 | Same: a template literal plus a `+ (empty ? … : "")` string concatenation building `className`. | Replace the whole expression with `cn("relative min-h-[1lh] …", className, empty && "before:pointer-events-none …")`. `cn` handles the conditional branch natively. |
| `blocks/offer-feature-settings.tsx:26` | P2 | Hand-rolled `<input>` re-implementing the `Input` primitive's classes (`h-8 w-full min-w-0 rounded-lg border border-input … focus-visible:ring-ring/50`) inside the *settings sidebar*, i.e. app chrome, not the email canvas. Guaranteed to drift from `Input`. | `<Input aria-label={…} value={feature} onChange={…} className="h-8" />`. (Contrast `list-item-row.tsx:33`, where a raw `<input>` is correct — that one lives on the canvas and must carry email typography.) |
| `blocks/divider-block.tsx:7` | P3 | `DividerBlockView` is declared inside the definition file. Every other of the thirteen blocks puts its view in `<type>-block-view.tsx` and the definition file holds only the definition object. | Extract to `blocks/divider-block-view.tsx` and import it, matching the other twelve. |
| `blocks/email-card-image.tsx:8`, `blocks/image-upload-button.tsx:11`, `blocks/table-column-settings.tsx:20`, `blocks/offer-feature-settings.tsx:9`, and the ten `*-block-settings.tsx` | P3 | No JSDoc on the exported component, while their sibling `*-block-view.tsx` files all carry one. Inconsistent within the same folder. | One-line `/** … */` above each, as `blocks/article-block-view.tsx:12` does. |

Not a violation (verified, do not flag): `blocks/paragraph-block-settings.tsx:1` and
`blocks/play-overlay.tsx:5` have no `Props` interface because they take **no props at all**.
That is correct. All twenty-two `interface Props extends EmailBlockComponentProps<…> {}`
declarations satisfy §2's "always extends something".

##### `sections/`

| File | Sev | Issue | Fix |
| --- | --- | --- | --- |
| `sections/add-block-menu.tsx:20` | P1 | Inline object props type (§2, §7). | `interface Props { onAdd: (type: EmailEditorBlockType) => void; trigger?: ReactElement; types?: ReadonlyArray<EmailEditorBlockType> }` above the component; keep the per-field JSDoc. |
| `sections/link-popover.tsx:17` | P1 | Inline object props type (§2, §7) — five props with three JSDoc comments buried in the signature. | Hoist to `interface Props { … }`. |
| `sections/preview-toggle.tsx:23` | P1 | Inline object props type (§2, §7). | `interface Props { value: EmailEditorPreview; onChange: (preview: EmailEditorPreview) => void }`. |
| `sections/block-options/alignment-option.tsx:40` | P1 | Inline object props type (§2, §7). | `interface Props { label?: string; value: EmailEditorAlignment; onChange: (alignment: EmailEditorAlignment) => void }`. |
| `sections/block-options/money-option.tsx:46` | P1 | Inline object props type (§2, §7). | Hoist to `interface Props { label: string; value: EmailEditorMoney; onChange: (money: EmailEditorMoney) => void; description?: string }`. |
| `sections/block-options/segmented-option.tsx:19` | P1 | Inline object props type (§2, §7), on a **generic** component — the nested `options` array type is the worst of the eight to read inline. | `interface Props<Value extends string \| number> { label: string; value: Value; options: ReadonlyArray<{ readonly value: Value; readonly label: string; readonly icon?: ReactNode }>; onChange: (value: Value) => void; description?: string }` then `export function SegmentedOption<Value extends string \| number>({ … }: Props<Value>)`. |
| `sections/block-toolbar.tsx:132,141,143,149` ⇄ `sections/selection-link-button.tsx:13` | P2 | **Circular import.** `block-toolbar.tsx` imports `selectedAnchorElement` from `selection-link-button.tsx:10`, while `selection-link-button.tsx:4-8` imports `applyInlineFormat`, `keepSelection`, `toolbarButtonClassName` back from `block-toolbar.tsx`. `toolbar-icon-button.tsx:2` also reaches into `block-toolbar.tsx` for `toolbarButtonClassName`. | Move the four non-component exports (`applyInlineFormat`, `keepSelection`, `INLINE_MARKS`, `toolbarButtonClassName`) and `selectedAnchorElement` into `email-block-editor/lib/inline-format.ts`. Breaks the cycle and satisfies §1 ("one part per file" — a component file should export one component). |
| `sections/block-options/money-option.tsx:30` | P2 | `formatPreviewPrice` — a pure formatting helper — is exported from an option-component file and imported by `blocks/offer-header.tsx:4` and `blocks/product-block-view.tsx:6`. A canvas block reaching into a *settings sidebar* file for a formatter is backwards. | Move `formatPreviewPrice` (and `MINOR_UNITS_PER_UNIT`) to `email-block-editor/lib/money.ts` or `theme.ts` next to `EMAIL_PREVIEW_LOCALE`. |
| `sections/block-toolbar.tsx:17` | P3 | `const useActiveInlineMarks = (): … => {…}` — arrow-function hook. §6 prefers `function` declarations. | `function useActiveInlineMarks(): ReadonlySet<string> {` (move it with the helpers above). |
| `sections/toolbar-icon-button.tsx:12`, `sections/selected-block-settings.tsx:11` | P3 | No JSDoc, unlike every sibling in `sections/`. | Add a one-line `/** … */`. |

Judgment on §4 (`useRender`) for `sections/`: **not warranted**. `ToolbarSeparator`,
`BlockOptionRow`, `BlockOptionSection`, `EditorSidebar`, `CardHeaderPlaceholder`,
`CardFooterPlaceholder` and friends are all internal, none accept `className` or DOM props,
and none is reachable from `index.ts`. Adding `useRender`/`mergeProps` here would add API
surface nobody can call. The two genuine candidates are `EmailCardShell`
(`blocks/email-card-shell.tsx:18`) and `BlockOptionSection`
(`sections/block-options/block-option-section.tsx:12`) — **only if** you later decide to
publish them so a host can supply its own card chrome. Flagging them today would be
premature; noted, not scored.

Judgment on §6 slot identifiers: there is **zero** `data-slot` / `state.slot` in all 94
files. Because the whole tree is internal and the editor ships no themeable CSS hooks, this
is a deliberate-looking gap rather than 60 individual bugs. If you want the canvas
inspectable/stylable from the host app, add `data-slot` to the ~6 canvas-visible wrappers
only (`EmailCardShell`, `GridBlockView`, `CanvasBlockRow`, `BlockToolbar`, `EditorCanvas`,
`EditorSidebar`) — one P2 item, not a sweep.

##### `dnd/`

| File | Sev | Issue | Fix |
| --- | --- | --- | --- |
| `dnd/sortable-block-container.tsx:16` | P2 | `interface Props { … className?: string; style?: React.CSSProperties; children: ReactNode }` — this one **does** wrap a DOM element (`<div ref={setNodeRef} className={className} style={style}>` at :48) and hand-rolls the two DOM props. §2: bare `interface Props { … }` is wrong when it wraps a DOM element. | `interface Props extends React.ComponentProps<"div"> { containerId: EmailEditorContainerId; blockIds: ReadonlyArray<string>; layout: "list" \| "grid" }`, then `<div ref={setNodeRef} {...props}>`. |
| `dnd/sortable-block-item.tsx:6` | P2 | Same: `className?: string` hand-declared, applied to a raw `<div>` at :26. | `interface Props extends Omit<React.ComponentProps<"div">, "children"> { blockId: string; children: (handle: SortableBlockHandle) => ReactNode }`. (`children` must stay a render prop, hence the `Omit`.) |
| `dnd/sortable-block-list.tsx` | P3 | `.tsx` extension on a file containing **no JSX** — it exports two string constants and one interface. It is also the only `.tsx` in the folder that declares no component. | Rename to `dnd/sortable-block-list.ts` and update `index.ts:7`, `block-toolbar.tsx:7`, `sortable-block-container.tsx:8-11`, `sortable-block-item.tsx:4`. |
| `dnd/sortable-block-list.tsx:4-5` | P3 | No blank line between the last `import` and the JSDoc that follows (§6 import grouping). | Insert a blank line after line 4. |

##### root (`index.ts`, `email-block-editor.tsx`, `block-settings-sheet.tsx`, `theme.ts`)

| File | Sev | Issue | Fix |
| --- | --- | --- | --- |
| `index.ts:6` | P2 | `export { gridBlockDefinition } from "…/blocks/grid-block.tsx"` — one arbitrary block definition is public while the other twelve and the registry itself are not. Either an oversight or an undocumented escape hatch. | Decide: drop the line, or export the registry properly (`EMAIL_BLOCK_DEFINITIONS`, `EMAIL_BLOCK_TYPES`, `EMAIL_LEAF_BLOCK_TYPES`) alongside the already-public `emailBlockDefinition`. |
| `email-block-editor.tsx:33` | P3 | Stale JSDoc: "Every building part (blocks, sections, dnd list, reducer) is also exported individually for custom compositions." `index.ts` exports **none** of them — only types, `emailBlockDefinition`, `gridBlockDefinition` and `EmailBlockEditor`. | Delete the sentence, or make it true (see the row above). |
| `blocks/block-definitions.tsx` | P3 | `.tsx` with no JSX (it only references `ComponentType`). Same class of issue as `sortable-block-list.tsx`, but it is imported by 30+ files, so the rename churn is large. | Optional; lower priority than the `dnd/` one. |

**Missing blank line after `Props`:**

Every single one of the 60 `interface Props` declarations in the folder is immediately
followed by a non-blank line (the component, or its JSDoc). **60/60 — a 100% violation rate**,
by far the largest single cluster in the audit. Line numbers point at the offending
non-blank line (§3: insert a blank line *above* it, before any JSDoc).

- `block-settings-sheet.tsx:15`
- `email-block-editor.tsx:26`
- `blocks/article-block-settings.tsx:9`
- `blocks/article-block-view.tsx:12`
- `blocks/button-block-settings.tsx:20`
- `blocks/button-block-view.tsx:15`
- `blocks/email-card-button.tsx:6`
- `blocks/email-card-image.tsx:8`
- `blocks/email-card-meta.tsx:7`
- `blocks/email-card-shell.tsx:12`
- `blocks/grid-block-settings.tsx:27`
- `blocks/grid-block-view.tsx:6`
- `blocks/heading-block-settings.tsx:18`
- `blocks/heading-block-view.tsx:11`
- `blocks/image-block-settings.tsx:29`
- `blocks/image-block-view.tsx:8`
- `blocks/image-drop-zone.tsx:9`
- `blocks/image-upload-button.tsx:11`
- `blocks/list-block-settings.tsx:19`
- `blocks/list-block-view.tsx:9`
- `blocks/list-item-row.tsx:16`
- `blocks/list-marker.tsx:8`
- `blocks/offer-block-settings.tsx:12`
- `blocks/offer-block-view.tsx:10`
- `blocks/offer-feature-list.tsx:7`
- `blocks/offer-feature-settings.tsx:9`
- `blocks/offer-header.tsx:11`
- `blocks/paragraph-block-view.tsx:7`
- `blocks/product-block-settings.tsx:11`
- `blocks/product-block-view.tsx:10`
- `blocks/rating-block-settings.tsx:19`
- `blocks/rating-block-view.tsx:10`
- `blocks/stat-block-settings.tsx:9`
- `blocks/stat-block-view.tsx:13`
- `blocks/table-block-settings.tsx:10`
- `blocks/table-block-view.tsx:23`
- `blocks/table-column-settings.tsx:20`
- `sections/block-settings-panel.tsx:13`
- `sections/block-toolbar.tsx:55`
- `sections/canvas-block-row-toolbar.tsx:29`
- `sections/canvas-block-row.tsx:21`
- `sections/editor-canvas.tsx:34`
- `sections/editor-sidebar.tsx:12`
- `sections/grid-add-cell.tsx:9`
- `sections/grid-block-cells.tsx:13`
- `sections/rich-text-controls.tsx:18`
- `sections/selected-block-settings.tsx:11`
- `sections/selection-link-button.tsx:26`
- `sections/structure-controls.tsx:21`
- `sections/toolbar-icon-button.tsx:12`
- `sections/block-options/block-option-row.tsx:13`
- `sections/block-options/block-option-section.tsx:7`
- `sections/block-options/link-option.tsx:11`
- `sections/block-options/select-option.tsx:12`
- `sections/block-options/text-area-option.tsx:13`
- `sections/block-options/text-option.tsx:12`
- `sections/block-options/toggle-option.tsx:11`
- `dnd/email-editor-dnd-context.tsx:78`
- `dnd/sortable-block-container.tsx:24`
- `dnd/sortable-block-item.tsx:11`

A closely related sub-pattern, same root cause, worth fixing in the same pass: the
module-level `const` above `Props` also has no blank line separating it —
`blocks/button-block-settings.tsx:18→19`, `blocks/button-block-view.tsx:13→14`,
`blocks/grid-block-settings.tsx:25→26`, `blocks/heading-block-settings.tsx:16→17`,
`blocks/image-block-settings.tsx:27→28`, `blocks/list-block-settings.tsx:17→18`,
`blocks/rating-block-settings.tsx:17→18`, `blocks/rating-block-view.tsx:8→9`,
`blocks/stat-block-view.tsx:11→12`, `blocks/table-block-view.tsx:21→22`,
`blocks/table-column-settings.tsx:15→16`, `blocks/article-block-view.tsx:10→11`,
`sections/block-toolbar.tsx:37→38`, `sections/selection-link-button.tsx:21→22`,
`dnd/sortable-block-container.tsx:15→16`.

#### email-block-editor summary

**Counts by severity**

| Sev | Count | Breakdown |
| --- | --- | --- |
| P1 | 8 | 8 inline object props types (2 in `blocks/`, 6 in `sections/`). No exported `Props`, no `forwardRef`, no `React.FC`, no part leaked from `index.ts` — those P1 classes are clean. |
| P2 | 10 | 2 template-literal `className` instead of `cn()`; 1 circular import (`block-toolbar` ⇄ `selection-link-button`); 2 misplaced helper exports; 2 `dnd/` `Props` that should extend `React.ComponentProps<"div">`; 1 hand-rolled `Input`; 1 stray `gridBlockDefinition` export; 1 layout normalization (`sections/` → `components/` + move the 2 root parts). Plus 1 optional slot-identifier item if the canvas should be host-stylable. |
| P3 | 60 + ~20 | 60 missing blank lines after `Props` (100% of declarations); ~15 missing blank lines before `Props`; 2 `.tsx`-without-JSX; 1 arrow hook; 1 stale JSDoc; ~14 missing component JSDoc. |

**Top themes**

1. **Blank line after `Props` — total, uniform absence.** 60/60. This folder alone probably
   accounts for the majority of the package's §3 violations. Purely mechanical.
2. **Inline object props types.** Eight components skip the `Props` interface entirely and
   type props inline. This is the folder's only real P1 class, and it is confined to the
   eight "generic/shared control" components (text input, rich-text surface, add menu,
   link popover, preview toggle, three option controls) — the block views and settings all
   do the right thing via `EmailBlockComponentProps`.
3. **Helpers living in component files, creating a cycle.** `block-toolbar.tsx` is a
   component *and* a utility module; `money-option.tsx` is a component *and* a formatter.
   Both are imported back by their own dependents. One `lib/` extraction fixes both.
4. **Naming, not substance, is what makes the layout look non-conformant.** `blocks/`,
   `dnd/`, `document/`, `lib/` are all legitimate auxiliary folders by package precedent.
   Only `sections/` (which is `components/` under a different name) and the two loose root
   `.tsx` files are actual deviations.
5. **`useRender`/`data-slot` largely N/A.** Unlike the rest of the package, nothing here is
   a public polymorphic primitive. Do not sweep-apply §4/§6-slots — it would add dead API.

**Suggested order of attack**

1. **Codemod the blank lines** (P3 ×75, zero risk). One script: insert a blank line before
   any `interface Props`/`type Props` that is not preceded by one, and after its closing
   brace. Do this first and in its own commit so it does not bury the real fixes.
2. **Hoist the 8 inline props types** (P1). Mechanical, one file at a time; watch
   `segmented-option.tsx` — it needs a generic `Props<Value>`.
3. **Extract `lib/inline-format.ts` and `lib/money.ts`** (P2 ×3). Breaks the
   `block-toolbar` ⇄ `selection-link-button` cycle and un-inverts the
   canvas→settings dependency. Do this before the folder rename so the rename is a pure move.
4. **Rename `sections/` → `components/`, move the two root parts in** (P2). Pure `git mv` +
   import rewrite; the `#/`-alias imports make it a find-and-replace. Leave `blocks/`,
   `dnd/`, `document/`, `lib/` alone.
5. **The small correctness items** (P2 ×5): `cn()` in `block-text-input` and
   `rich-text-editable`; `React.ComponentProps<"div">` on the two `dnd/` wrappers;
   `Input` in `offer-feature-settings`.
6. **Cleanup** (P3): `sortable-block-list.tsx` → `.ts`; the stale `email-block-editor.tsx:33`
   JSDoc; `useActiveInlineMarks` → `function`; `divider-block` view extraction; missing
   component JSDoc.
7. **Decide the `gridBlockDefinition` question** (P2) — a product/API call, not a refactor.
   Needs an owner, not a codemod.

---

### Part 4 — `empty` → `menu`

Scope: `empty, field, filter, formatted-input, gallery, globe-view, hooks, hover-card, icon, icon-picker, image-cropper, image-upload-field, input, input-group, input-otp, item, kbd, label, list, map-view, menu, lib` (paths relative to `packages/ui/src`).

---

#### empty

Verdict: structurally exemplary (namespace + JSDoc + `index.ts` all correct); every part is a raw DOM element with no `useRender`, and four of six are missing the blank line after `Props`.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `empty/components/empty-root.tsx:7`, `empty-content.tsx:4`, `empty-header.tsx:4`, `empty-title.tsx:4`, `empty-description.tsx:4`, `empty-media.tsx:44` | P2 | All six parts render raw `div`/`h3`/`p` with `data-slot`; none is a Base UI wrapper, and all are exactly the "containers, headings, text" category §4 says must be polymorphic. Consumers cannot retarget `Empty.Title` to `h2`. | Convert to `useRender` + `mergeProps`, e.g. `interface Props extends useRender.ComponentProps<"h3"> {}` → `useRender({ defaultTagName: "h3", props: mergeProps<"h3">({ className: cn(…, className) }, props), render, state: { slot: "empty-title" } })` |
| `empty/components/empty-content.tsx:1`, `empty-root.tsx:1`, `empty-title.tsx:1` … | P3 | No `import type * as React` yet `React.ComponentProps` is used (relies on the global UMD `React` namespace). Sibling folders (`item/`, `input-group/`) do `import type * as React from "react";`. | Add `import type * as React from "react";` for consistency (Biome/TS both accept the global today). |

**Missing blank line after `Props`:**
- `empty/components/empty-content.tsx:3` (the user's cited example)
- `empty/components/empty-description.tsx:3`
- `empty/components/empty-header.tsx:3`
- `empty/components/empty-title.tsx:3`

---

#### field

Verdict: namespace, JSDoc and `index.ts` all correct; same "raw DOM, no `useRender`" gap as `empty`, plus six missing blank lines.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `field/components/field-content.tsx:4`, `field-title.tsx:4`, `field-description.tsx:4`, `field-group.tsx:4`, `field-root.tsx:29` | P2 | Plain containers/text rendering raw `div`/`p` — not Base UI wrappers, no `render` escape hatch. `FieldTitle` in particular renders a `div` and can never become a heading. | Move to `useRender` + `mergeProps` with `state: { slot: "field-title" }` etc. |
| `field/components/field-set.tsx:4`, `field-legend.tsx:21`, `field-separator.tsx:8` | P3 | Semantic elements (`fieldset`, `legend`, wrapper `div` around `Separator`) — acceptable as raw JSX per §4's semantics carve-out; noted only so the `useRender` sweep does not touch them. | No change. |
| `field/components/field-set.tsx:1`, `field-label.tsx:1`, `field-content.tsx:1` | P3 | Same missing `import type * as React` as `empty/`. | Add the type-only React import. |

**Missing blank line after `Props`:**
- `field/components/field-content.tsx:3`
- `field/components/field-description.tsx:3`
- `field/components/field-group.tsx:3`
- `field/components/field-label.tsx:4`
- `field/components/field-set.tsx:3`
- `field/components/field-title.tsx:3`

---

#### filter

Verdict: the biggest structural outlier in the chunk — no namespace file at all, six components exported individually from `index.ts`, and every `Props` is a bare object interface; also the densest cluster of missing blank lines.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `filter/index.ts:1-6` | P1 | Six components (`FilterBar`, `FilterChips`, `FilterField`, `FilterForm`, `FilterPanel`, `FilterTrigger`) are exported individually; there is no `filter/components/filter.tsx` namespace file. §5 says `index.ts` re-exports only the namespace. | Add `filter/components/filter.tsx` with `export const Filter = { Root: FilterBar, Chips: FilterChips, Field: FilterField, Form: FilterForm, Panel: FilterPanel, Trigger: FilterTrigger };` + namespace JSDoc, and reduce `index.ts` to `export { Filter } from "#/filter/components/filter.tsx";` (keep the `filter-values` / `types` exports). |
| `filter/components/filter-bar.tsx:13` | P2 | `interface Props { … }` — bare object literal on a component that renders `<div data-slot="filter-bar">`. No `className`, no `...props` passthrough, so the bar cannot be spaced by its parent. | `interface Props extends React.ComponentProps<"div"> { … }` and spread `{...props}` onto the root div. |
| `filter/components/filter-form.tsx:11` | P2 | Same: bare `Props`, renders `<div data-slot="filter-form">` with a hard-coded `className` and no passthrough. | Extend `React.ComponentProps<"div">`. |
| `filter/components/filter-chips.tsx:22` | P2 | Hand-rolled `readonly className?: string` instead of extending a DOM props type; the rest of `div`'s props are unavailable. | `interface Props extends React.ComponentProps<"div"> { … }` and drop the manual `className`. |
| `filter/components/fields/filter-field-frame.tsx:6`, `filter-operator-toggle.tsx:4`, `filter-range-row.tsx:3`, `option-toggle.tsx:5`, `place-results.tsx:4`, `number-field.tsx:3`, `date-bound-field.tsx:17` and the eight `*-filter-field.tsx` | P2 | All bare `interface Props { … }` while rendering raw `div`/`button`/`fieldset`/`ul`. No `className`, no props spread — these are internal-only helpers, but they still break the "always extends" rule. | Extend the matching `React.ComponentProps<"div" \| "button" \| "fieldset">` (or `useRender.ComponentProps` for the pure layout ones like `FilterRangeRow`). |
| `filter/components/fields/filter-range-row.tsx:7`, `place-results.tsx:11`, `number-field.tsx:13`, `option-toggle.tsx:16` | P2 | Render a raw DOM element and set no `data-slot` / `state.slot` at all (§6 requires every part to carry a slot identifier). Contrast `filter-field-frame.tsx:37` and `filter-operator-toggle.tsx:27`, which do. | Add `data-slot="filter-range-row"` etc. |
| `filter/components/*` (all) | P3 | `readonly` modifiers on every prop — a `filter/`-only convention, used nowhere else in the package. | Either drop, or lift to a package-wide rule. |
| `filter/components/fields/date-bound-field.tsx:16` | P3 | No blank line between the `fromIsoDay` helper and `interface Props`. | Insert a blank line. |

**Missing blank line after `Props`:**
- `filter/components/fields/date-bound-field.tsx:25`
- `filter/components/fields/date-range-filter-field.tsx:17`
- `filter/components/fields/filter-field-frame.tsx:21`
- `filter/components/fields/filter-operator-toggle.tsx:13`
- `filter/components/fields/filter-range-row.tsx:5`
- `filter/components/fields/geo-radius-filter-field.tsx:71`
- `filter/components/fields/number-field.tsx:12`
- `filter/components/fields/number-filter-field.tsx:15`
- `filter/components/fields/number-range-filter-field.tsx:19`
- `filter/components/fields/option-toggle.tsx:9`
- `filter/components/fields/place-results.tsx:10`
- `filter/components/fields/select-filter-field.tsx:29`

---

#### formatted-input

Verdict: clean — single component, `Props` extends `Omit<React.ComponentProps<typeof Input>, …>`, blank line present, `data-slot` set.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `formatted-input/components/formatted-input.tsx:101-106` | P3 | The component file re-exports mask helpers from `lib/`, and `index.ts` re-exports them from the component file — a two-hop path for values that live in `lib/formatted-input-mask.ts`. | Export the masks from `index.ts` directly: `export { businessIdMask, … } from "#/formatted-input/lib/formatted-input-mask.ts";` |

---

#### gallery

Verdict: single-component folder; `gallery.tsx` is both namespace filename and implementation, and it holds a second component (`Lightbox`) that is only reachable through a trailing re-export.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `gallery/components/gallery.tsx:83-84` | P3 | The `<component>.tsx` file contains a part implementation and trailing `export { Lightbox } from …` re-exports, rather than being a pure namespace file (§1: "NO part implementations here"). `Lightbox` is exported from the component file but not from `index.ts`, so its public status is ambiguous. | Either make `Gallery` a namespace (`{ Root: GalleryRoot, Lightbox }` in `gallery.tsx`, implementation moved to `gallery-root.tsx`), or drop the `Lightbox` re-export if it is internal. |
| `gallery/components/gallery-lightbox.tsx:7` | P2 | Bare `interface Props { … }`; component name `Lightbox` does not match its file `gallery-lightbox.tsx` (every other folder matches). | Rename to `GalleryLightbox` and extend a DOM props type if it is to stay public. |

---

#### globe-view

Verdict: correct lazy-loading split; the `Props` JSDoc placement and one missing blank line are the only issues.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `globe-view/components/globe-view.tsx:14-20` | P3 | The component's descriptive JSDoc sits above `interface Props` instead of above `export function GlobeView` (which has its own JSDoc at `:73`). Two doc blocks, one attached to the wrong declaration. | Merge into the single JSDoc above `export function GlobeView`. |
| `globe-view/components/globe-view-implementation.tsx:44` | P3 | Missing blank line after `Props` (JSDoc follows immediately). | Blank line before the `/**`. |
| `globe-view/index.ts` | P3 | No namespace object — correct for a single-component folder; noted for contrast with `map-view/index.ts`, which additionally leaks two implementation constants. | No change. |

**Missing blank line after `Props`:**
- `globe-view/components/globe-view-implementation.tsx:44`

---

#### hooks

Verdict: no components — three hooks (`useCommandPalette`, `useIsMobile`, `usePickerState`) re-exported from `hooks/index.ts`. Nothing in §2–§5 applies.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `hooks/use-picker-state.ts:9-21` | P3 | Inline object literal as the parameter type instead of a named `interface Props`/options type. Acceptable for a hook (§2 targets components), but it is the only inline-object signature in the folder. | Optional: extract `interface Options<Value> { … }`. |

---

#### hover-card

Verdict: correct Base UI wrapper pattern (`data-slot` on the primitive, no `useRender` — as §4 prescribes); two missing blank lines.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `hover-card/components/hover-card-content.tsx:24` | P3 | The only part without a JSDoc, while `Root` and `Trigger` both have one. | Add a one-line JSDoc. |
| `hover-card/components/hover-card-root.tsx:10`, `hover-card-trigger.tsx:8` | P3 | `({ ...props }: Props)` destructure is a no-op; elsewhere the package writes `(props: Props)`. | `export function HoverCardRoot(props: Props)`. |

**Missing blank line after `Props`:**
- `hover-card/components/hover-card-root.tsx:3`
- `hover-card/components/hover-card-trigger.tsx:3`

---

#### icon

Verdict: clean — `Props extends ComponentProps<PhosphorIconComponent>`, blank line present, `data-slot="icon"` set, public types exported from `index.ts`.

No findings.

---

#### icon-picker

Verdict: single component; bare object `Props` with a hand-rolled `className` is the only real deviation.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `icon-picker/components/icon-picker.tsx:36-53` | P2 | Bare `interface Props { … }` with a manual `className?: string` instead of extending a DOM/primitive props type. | `interface Props extends Omit<React.ComponentProps<typeof Combobox.Root>, "value" \| "defaultValue" \| "onValueChange"> { … }` (or `React.ComponentProps<"div">`) and drop the manual `className`. |
| `icon-picker/components/icon-picker.tsx:55` | P3 | No JSDoc on the exported component, unlike its `icon/` sibling. | Add a short JSDoc. |

---

#### image-cropper

Verdict: namespace + JSDoc + context all correct; every part uses a bare object `Props` with a hand-rolled `className`.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `image-cropper/components/image-cropper-root.tsx:17-40` | P2 | Bare `interface Props { … }` with manual `className?: string` / `children?: React.ReactNode`; renders a `div`. | `interface Props extends React.ComponentProps<"div"> { … }` and spread `{...props}`. |
| `image-cropper/components/image-cropper-area.tsx:26-31` | P2 | Same bare-object shape with manual `className` and `"aria-label"`; renders the crop viewport `div`. | Extend `React.ComponentProps<"div">` (which already supplies `aria-label`). |
| `image-cropper/components/image-cropper-dropzone.tsx:6-12` | P2 | Same; renders `<div role="button" data-slot="image-cropper-dropzone">`. | Extend `React.ComponentProps<"div">`. |
| `image-cropper/components/image-cropper.tsx:7-13` | P3 | A free-standing `//` comment block sits between the imports and the namespace JSDoc; every other namespace file has only the `/** … */` block. | Fold the prose into the namespace JSDoc. |

---

#### image-upload-field

Verdict: the public component is correct (`Props extends Omit<React.ComponentProps<"div">, "onChange">`); the two internal helpers use bare object `Props` and are missing blank lines.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `image-upload-field/components/crop-controls.tsx:4-11` | P2 | Bare `interface Props { … }`; renders `<div data-slot="image-upload-field-crop-controls">` with no `className`/props passthrough. | Extend `React.ComponentProps<"div">`. |
| `image-upload-field/components/image-upload-cropper.tsx:7-19` | P2 | Bare `interface Props { … }`. | Extend `React.ComponentProps<"div">`. |
| `image-upload-field/components/crop-controls.tsx:18` | P3 | Component name `CropControls` does not carry the `ImageUploadField` prefix its siblings use (`ImageUploadFieldEditor`, `ImageUploadFieldView`), and the file is `crop-controls.tsx` rather than `image-upload-field-*.tsx`. | Rename to `ImageUploadFieldCropControls` / `image-upload-field-crop-controls.tsx`. |
| `image-upload-field/components/image-upload-field-editor.tsx:23`, `image-upload-field-view.tsx` | P3 | Both set `data-slot="image-upload-field"` (the same slot as the parent) and disambiguate via `data-state`. Works, but two parts share one slot name. | Consider `data-slot="image-upload-field-editor"` / `-view`. |

**Missing blank line after `Props`:**
- `image-upload-field/components/crop-controls.tsx:11`
- `image-upload-field/components/image-upload-cropper.tsx:19`

---

#### input

Verdict: clean apart from the blank line — correct Base UI wrapper with `data-slot="input"`.

**Missing blank line after `Props`:**
- `input/components/input.tsx:5`

---

#### input-group

Verdict: namespace, JSDoc, ordering and slots all correct; five of six parts are missing the blank line.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `input-group/components/input-group-text.tsx:5` | P2 | Renders a raw `<span data-slot="input-group-text">` — a text container that consumers may reasonably want as a `label`/`div`; §4's polymorphism case applies. | Move to `useRender` + `mergeProps` with `state: { slot: "input-group-text" }`. |
| `input-group/components/input-group-root.tsx:5`, `input-group-addon.tsx:40` | P3 | Raw `fieldset`/`div` chosen for semantics + `has-*` styling coupling — acceptable per §4. Noted so the sweep does not touch them. | No change. |

**Missing blank line after `Props`:**
- `input-group/components/input-group-input.tsx:5`
- `input-group/components/input-group-root.tsx:4`
- `input-group/components/input-group-text.tsx:4`
- `input-group/components/input-group-textarea.tsx:5`

---

#### input-otp

Verdict: namespace correct; one `type Props = …` alias (documented and justified), one part that drops the consumer's `className`.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `input-otp/components/input-otp-separator.tsx:5-11` | P2 | `className` is set as a literal attribute *before* `{...props}`, so a consumer `className` replaces the base classes instead of merging — violates §6's "`cn()` always wraps `className` last". | `export function InputOTPSeparator({ className, ...props }: Props)` then `className={cn("flex items-center …", className)}`. |
| `input-otp/components/input-otp-root.tsx:5-9` | P3 | `type Props = React.ComponentProps<typeof OTPInput> & { … }` rather than `interface … extends`. The comment at `:5-6` explains that `input-otp`'s props are a union an interface cannot extend — correct, and correctly documented. | No change; keep the comment. |

**Missing blank line after `Props`:**
- `input-otp/components/input-otp-group.tsx:4`
- `input-otp/components/input-otp-separator.tsx:4`

---

#### item

Verdict: namespace correct and three parts (`Root`, `Media`, `Group`) are the canonical `useRender` shape — but the other seven are raw JSX, making this the clearest internal inconsistency in the chunk; eight missing blank lines.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `item/components/item-title.tsx:5`, `item-description.tsx`, `item-content.tsx:5`, `item-header.tsx`, `item-footer.tsx`, `item-actions.tsx` | P2 | Raw `span`/`p`/`div` with `data-slot`, while `ItemRoot`/`ItemMedia`/`ItemGroup` in the same folder use `useRender` + `state.slot`. `ItemTitle` (a `span`) and `ItemDescription` (a `p`) are exactly the retargetable-text case; `List` already needs `render` on `Item.Root`/`Item.Group` (see `list/`), which proves the demand. | Convert all six to the `useRender` shape, e.g. `interface Props extends useRender.ComponentProps<"span"> {}` → `useRender({ defaultTagName: "span", props: mergeProps<"span">({ className: cn(…, className) }, props), render, state: { slot: "item-title" } })`. |
| `item/components/item-media.tsx:41`, `item-root.tsx:47` | P3 | `useRender` parts carry `state.slot` only — no `data-slot` — which is correct per §4, but note `item-media` styles off `data-slot=item-description` on descendants that *do* use `data-slot`. The mix works only because Base UI emits `data-slot` from `state.slot`. | No change; be aware when converting the raw parts. |

**Missing blank line after `Props`:**
- `item/components/item-actions.tsx:4`
- `item/components/item-content.tsx:4`
- `item/components/item-description.tsx:4`
- `item/components/item-footer.tsx:4`
- `item/components/item-group.tsx:5`
- `item/components/item-header.tsx:4`
- `item/components/item-separator.tsx:5`
- `item/components/item-title.tsx:4`

---

#### kbd

Verdict: only the missing namespace JSDoc; both parts are correct otherwise.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `kbd/components/kbd.tsx:4` | P3 | Namespace object has no JSDoc (§5). | Add `/** The Kbd parts as one namespace. */` above `export const Kbd`. |
| `kbd/components/kbd-root.tsx:20`, `kbd-group.tsx:8` | P3 | Raw `<kbd>` elements — required for semantics, correctly not polymorphic. | No change. |

---

#### label

Verdict: correct apart from the blank line.

**Missing blank line after `Props`:**
- `label/components/label.tsx:5`

---

#### list

Verdict: thin, well-designed wrapper over `Item` (uses `render` to force `ul`/`li`); missing namespace JSDoc and all three parts miss the blank line.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `list/components/list.tsx:5` | P3 | Namespace object has no JSDoc (§5). | Add `/** The List parts as one namespace. */`. |
| `list/components/list-separator.tsx:1-3` | P3 | Import grouping differs from its siblings: this file has the blank line between the external `react` import and the `#/` import (correct per §6), while `list-root.tsx:1-3` and `list-item.tsx:1-2` have none. | Normalise: blank line after external imports everywhere. |

**Missing blank line after `Props`:**
- `list/components/list-item.tsx:5`
- `list/components/list-root.tsx:6`
- `list/components/list-separator.tsx:5`

---

#### map-view

Verdict: mirrors `globe-view` structurally but its implementation file uses an inline props type in the signature and `index.ts` leaks two implementation constants.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `map-view/components/map-view-implementation.tsx:22-32` | P2 | No `interface Props` at all — the props type is written inline in the signature as `}: React.ComponentProps<typeof MapView>)`. Its direct counterpart `globe-view-implementation.tsx:44` declares `interface Props extends React.ComponentProps<typeof GlobeView> {}`. | `interface Props extends React.ComponentProps<typeof MapView> {}` above the function, then `}: Props)`. |
| `map-view/index.ts:5-8` | P3 | `DEFAULT_STYLE_URL` / `DEFAULT_DARK_STYLE_URL` are exported from the lazily-loaded implementation module, so importing them from `@voila.dev/ui` pulls the ~270 kB MapLibre chunk into the caller's graph — defeating the code-split the file's own JSDoc describes. | Move the two constants to a plain `map-view/lib/*.ts` and re-export from there. |
| `map-view/components/map-view.tsx:14-22` | P3 | Same JSDoc-above-`Props` placement as `globe-view.tsx`. | Move the doc onto `export function MapView`. |

---

#### menu

Verdict: no components — `menu/components/menu-variants.ts` is a shared cva recipe module consumed by dropdown-menu / context-menu / combobox / command, re-exported verbatim from `menu/index.ts`. §2–§5 do not apply.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `menu/index.ts:1-9` | P3 | Seven `*Variants` recipes are part of the package's public API. Intentional (cross-component sharing), but worth confirming it should be public rather than an internal `#/menu/...` import. | Confirm intent; otherwise drop from the public barrel. |

---

#### lib

Verdict: no components — `cn`, `cva`, geo and time helpers. Only deviation is arrow-function exports.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `lib/geo-circle.ts:28`, `lib/geo-circle.ts` (`circleBounds`) | P3 | `export const circlePolygon = (…) => …` — §6 mandates `export function` declarations. `lib/utils.ts:4` correctly uses `export function cn(…)`. | `export function circlePolygon(center: GeoPoint, radiusKm: number, segments = 64): CirclePolygonFeature { … }` |
| `lib/index.ts` | P3 | `lib/cva.ts` is not re-exported while `cn` and the geo/time helpers are, yet `cva` is imported package-wide via `#/lib/cva.ts`. Intentional (internal-only) but inconsistent with the barrel's coverage. | Confirm intent. |

---

#### Chunk 4 summary

**Counts by severity**

| Severity | Count |
| --- | --- |
| P1 | 1 |
| P2 | 20 |
| P3 | 28 |
| — of which missing-blank-line occurrences | 46 (across 42 files) |

**Top themes**

1. **Missing blank line after `Props` is endemic — 46 occurrences in 42 files**, concentrated in `item/` (8), `filter/components/fields/` (12), `field/` (6), `input-group/` (4) and `empty/` (4). It is purely mechanical and could be fixed in one pass; `empty/components/empty-content.tsx:3` is the canonical example.
2. **`useRender` adoption is half-finished.** `item/` is the sharpest case: `ItemRoot`, `ItemMedia` and `ItemGroup` use the canonical `useRender` + `mergeProps` + `state.slot` shape while the seven sibling parts render raw JSX with `data-slot`. `empty/` and `field/` use raw JSX throughout even though every part is a container/heading/text node — precisely §4's target category, and `list/` already proves the demand by needing `render` on `Item.Root`/`Item.Group`.
3. **Bare `interface Props { … }` clusters in the "feature" folders.** `filter/` (every component), `image-cropper/` (all three parts), `icon-picker/`, `gallery-lightbox`, and two `image-upload-field/` helpers declare object-literal props with a hand-rolled `className?: string` instead of extending a DOM or primitive props type, so DOM props and the `className` merge contract are lost.
4. **`filter/` is the one structural (P1) outlier**: no `filter/components/filter.tsx` namespace file, six components exported individually from `index.ts`. It also carries its own private conventions (`readonly` on every prop) used nowhere else.
5. **Small consistency drifts across the chunk**: missing namespace JSDoc (`kbd`, `list`), JSDoc placed above `interface Props` rather than the component (`map-view`, `globe-view`), inconsistent `import type * as React` (present in `item`/`input-group`, absent in `empty`/`field`), inconsistent blank line between external and `#/` import groups, and `input-otp-separator.tsx` setting `className` before `{...props}` so the consumer's value replaces rather than merges.

---

### Part 5 — `landing`

Audited against `CONVENTIONS.md`. Read-only; no files modified.

#### Layout & namespace structure

`landing/` uses a layout that is **internally 100% consistent but structurally different
from the rest of the package**:

```
landing/
  index.ts                      -> barrel of all namespaces + variant helpers
  lib/tones.ts
  styles/landing.css
  components/
    <name>-variants.ts          -> cva variants, FLAT, outside the component folder
    <name>.tsx                  -> single-part components (container, heading, text,
                                   section, prose-article)
    <name>.test.tsx             -> tests, FLAT, outside the component folder
    <sub>/
      index.ts                  -> BOTH the part imports AND the namespace object
      root.tsx                  -> parts, unprefixed filenames
      card-title.tsx
      context/<sub>-context.ts
```

Versus the canonical §1 layout (`card/`, `empty/`, `accordion/`): `components/<component>.tsx`
holds the namespace and `index.ts` is a one-line re-export, parts are
`components/<component>-<part>.tsx`.

**Assessment — the nesting itself is justified, the file naming and namespace placement are not.**

1. **Nesting is right.** `landing/` holds 16 independent multi-part components. Flattening
   `site-footer/column-link.tsx` to `landing/components/site-footer-column-link.tsx` would put
   ~136 sibling files in one directory. Every other top-level folder in the package *is* one
   component, so it has no equivalent pressure. `landing/` is effectively a namespace of
   components, and one folder per component inside it is the same rule applied one level down.
   **Recommendation: keep the nesting.** Treat `landing/components/<sub>/` as the moral
   equivalent of a top-level component folder.

2. **The namespace object should not live in `index.ts`.** §1/§5 want
   `<sub>/components/<sub>.tsx` (or at least `<sub>/<sub>.tsx`) to build the object and
   `<sub>/index.ts` to only re-export. Today `<sub>/index.ts` mixes 13 part imports, unrelated
   type re-exports, and the object literal (e.g. `article-tags/index.ts`, `bento-grid/index.ts`).
   That is why `article-card/index.ts:14` can smuggle `export { ArticleTags }` from a *different*
   component out through the ArticleCard barrel. **Recommendation: split each `<sub>/index.ts`
   into `<sub>/<sub>.tsx` (namespace) + `<sub>/index.ts` (re-export only).** Applying the full
   `<sub>/components/` level as well is optional and arguably over-nesting at this depth.

3. **Part filenames drop the component prefix; exported symbols keep it.** `root.tsx` exports
   `ArticleCardRoot`, `card-title.tsx` exports `NumberedCardTitle`. Elsewhere the file *is* the
   symbol (`card-root.tsx` → `CardRoot`). Since the parent folder already carries the prefix,
   `root.tsx` is unambiguous on disk but breaks "find by symbol name" and search-by-filename
   across the package (`landing` has 16 files literally named `root.tsx`). **Recommendation: keep
   `root.tsx` (renaming 136 files buys little) but codify it explicitly** — this is the one place
   the flat `<component>-<part>.tsx` rule does not apply, and the spec should say so rather than
   leaving `landing/` looking like a violation.

4. **Namespace key order is compose order, not alphabetical.** All 16 namespaces do
   `Root` first then composition order (`Root, Frame, Image, ImageFallback, Content, …`), and each
   carries a `/** Compose: … */` JSDoc that the order mirrors. This is *better* than the §5
   alphabetical rule for components this deep, and it is applied without exception.
   **Recommendation: amend §5 to allow compose order when the JSDoc documents the tree.** Not
   flagged per-file below.

5. **Variants and tests sit outside their folder.** `feature-grid-variants.ts` /
   `feature-grid.test.tsx` are siblings of `feature-grid/`, not inside it. Inconsistent with the
   nesting decision and it forces `landing/index.ts` to export the same helpers via two paths.

6. **Namespace completeness: clean.** A mechanical diff of `export function` symbols per folder
   against the keys of each namespace object found **zero** orphan parts and **zero** missing
   keys across all 16 namespaces, and every namespace has a JSDoc. No P1 findings anywhere in
   `landing/`: no exported `Props`, no `forwardRef`, no `React.FC`, no `export const X = () =>`,
   no inline object props types, no individual part reachable from `landing/index.ts`.

---

##### Cross-cutting (whole folder)

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| all 16 `<sub>/index.ts` | P2 | Namespace object is built inside `index.ts` (§1/§5 want a dedicated namespace module; `index.ts` should re-export only). | Move the object + part imports to `<sub>/<sub>.tsx`; leave `<sub>/index.ts` as `export { ArticleCard } from "#/landing/components/article-card/article-card.tsx";`. |
| `landing/index.ts:1-4` | P2 | `ArticleTags` is exported *from* `article-card/index.ts`, which re-exports it at `article-card/index.ts:14`. `ArticleTags` is its own component with its own folder and namespace. | Export it from its own module: `export { ArticleTags } from "#/landing/components/article-tags/index.ts";` and delete `article-card/index.ts:14`. |
| `container.tsx:27-31`, `heading.tsx:39-44`, `text.tsx:38-45`, `section.tsx:37-42` | P3 | Component file re-exports its own `*-variants.ts` symbols, and `landing/index.ts:12-16,38-43,60-72,83-90` exports the *same* symbols directly from the variants module — two public paths to one symbol. | Drop the trailing `export { … } from "…-variants.ts"` block from the component files; `landing/index.ts` is already the single barrel. |
| `components/*-variants.ts` (8 files), `components/*.test.tsx` (5 files) | P3 | Variant modules and tests are flat siblings of the folder they belong to (`feature-grid-variants.ts` next to `feature-grid/`). | Move to `feature-grid/feature-grid-variants.ts` and `feature-grid/feature-grid.test.tsx` so the folder is self-contained. |
| ~25 files in `landing/` | P3 | No blank line between the external-package import group and the `#/` group (§6). | Repo-wide pattern (present in ~70 other component folders — Biome `organizeImports` is collapsing the groups). **Fix at the Biome config level, not per file.** Not itemised below. |
| `section-intro/root.tsx:5` | P3 | Lone stray blank line *inside* the `#/` import group — the only file in `landing/` that does this. | Delete line 5. |

##### article-card

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `article-card/title.tsx:6` | P2 | Hard-codes `<h3>`; a card title's heading level depends on the page outline and cannot be re-targeted. `heading.tsx` in the same folder is the canonical `useRender` heading. | `interface Props extends useRender.ComponentProps<"h3"> {}` + `useRender({ defaultTagName: "h3", …, state: { slot: "article-card-title" } })`. |
| `article-card/tags.tsx:5-7` | P2 | Sets no slot of its own — it renders `<ArticleTags.Root>`, so the DOM only carries `data-slot="article-tags"` and `ArticleCard.Tags` is not targetable. | Pass a slot through, or drop the part and document `ArticleTags.Root` directly under `ArticleCard`. |
| `article-card/image.tsx:3-24` | P3 | `Props extends React.ComponentProps<"img">` but the returned root is a `<div>`; the wrapper div and the trailing gradient div are unstyleable from outside. | Acceptable (props do land on the `img`), but consider `React.ComponentProps<"img"> & { containerClassName?: string }` or moving the frame into `frame.tsx`. |

##### bento-grid

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `bento-grid/featured-title.tsx:6` | P2 | Hard-coded `<h3>`, not re-targetable (see article-card/title.tsx). | `useRender` + `useRender.ComponentProps<"h3">`. |
| `bento-grid/item-title.tsx:6` | P2 | Same. | Same. |

##### comparison-section

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `comparison-section/root.tsx:24-41` | P2 | No slot: the part renders `<ComparisonToneContext.Provider><Section …>` and inherits `data-slot="landing-section"`, so `ComparisonSection.Root` is not targetable. | `<Section … data-slot="comparison-section">` (Section spreads props onto the rendered element). |
| `comparison-section/panel-title.tsx:15` | P3 | A panel *title* renders `<p>`. Semantically a heading; also not polymorphic. | Either `useRender` with `defaultTagName: "p"` so consumers can pass `render={<h3 />}`, or route through `Heading`. |

##### contact-cards

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `contact-cards/card-title.tsx:5-9` | P2 | No own slot — delegates to `Heading` (`data-slot="landing-heading"`), so `ContactCards.CardTitle` cannot be styled or asserted on. | Add `data-slot="contact-card-title"` to the `<Heading …>` call. |
| `contact-cards/card-description.tsx:5-9` | P2 | Same, delegates to `Text` (`data-slot="landing-text"`). | Add `data-slot="contact-card-description"`. |

##### cta-banner

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `cta-banner/title.tsx:5-13` | P2 | No own slot (delegates to `Heading`). | `data-slot="cta-banner-title"` on the `<Heading>`. |
| `cta-banner/description.tsx:5-8` | P2 | No own slot (delegates to `Text`). | `data-slot="cta-banner-description"`. |

##### eyebrow

No pattern findings beyond the blank-line list. `eyebrow/root.tsx` correctly pairs a context
provider with a slotted `<div>`; `dot`/`icon`/`label` all set slots and extend `"span"`.

##### feature-grid

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `feature-grid/card-title.tsx:6` | P2 | Hard-coded `<h3>`. | `useRender` + `useRender.ComponentProps<"h3">`. |

##### landing-hero

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `landing-hero/root.tsx:26-37` | P2 | No own slot — inherits `data-slot="landing-section"` from `Section`. Also hard-wires an inner `<Container>` + layout `<div>` that consumers cannot reach. | `data-slot="landing-hero"` on the `<Section>`; consider exposing the layout div as a part. |
| `landing-hero/title.tsx:5-7` | P2 | No own slot (delegates to `Heading`). | `data-slot="landing-hero-title"`. |
| `landing-hero/lead.tsx:5-12` | P2 | No own slot (delegates to `Text`). | `data-slot="landing-hero-lead"`. |

##### logo-marquee

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `logo-marquee/root.tsx:10-18` | P3 | Hard-wires an inner `<Container>` around `children`; unlike `article-card/root.tsx` (same folder) it is not polymorphic. | Low priority — `Root` is a fixed band by design. `item.tsx` already uses `useRender` correctly. |

##### numbered-cards

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `numbered-cards/card-title.tsx:6` | P2 | Hard-coded `<h3>`. | `useRender` + `useRender.ComponentProps<"h3">`. |

##### page-header

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `page-header/root.tsx:20-29` | P2 | No own slot — inherits `data-slot="landing-section"`. | `data-slot="page-header"` on the `<Section>`. |
| `page-header/title.tsx:5-7` | P2 | No own slot (delegates to `Heading`). | `data-slot="page-header-title"`. |
| `page-header/lead.tsx:5-12` | P2 | No own slot (delegates to `Text`). | `data-slot="page-header-lead"`. |

##### section-intro

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `section-intro/title.tsx:5-13` | P2 | No own slot (delegates to `Heading`). | `data-slot="section-intro-title"`. |
| `section-intro/description.tsx:4-6` | P2 | No own slot (delegates to `Text`). Also the only part in `landing/` that takes bare `props` with no destructure — no `cn()` merge point. | `data-slot="section-intro-description"`; destructure `className` and `cn()` it for consistency. |

##### site-footer

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `site-footer/column-title.tsx:6` | P2 | Hard-coded `<h3>` — footer column headings are the most likely to want a different level (or a `<p>`) per site. | `useRender` + `useRender.ComponentProps<"h3">`, `state: { slot: "site-footer-column-title" }`. |
| `site-footer/column-list.tsx:6` | P3 | Renders a fixed `<ul>`; `column-link.tsx` and `social-link.tsx` in the same folder already use `useRender`, so the list container is the odd one out. | `useRender` with `defaultTagName: "ul"` so `render={<ol />}` / `<nav>` is possible. |

##### site-header

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `site-header/bar.tsx:4-6` | P3 | `"aria-label"?: string;` re-declares a member already present in `React.ComponentProps<"nav">`; the interface body should be `{}`. | `interface Props extends React.ComponentProps<"nav"> {}` and keep the `= "Main"` default in the destructure. |
| `site-header/bar.tsx:14-24` | P3 | Hard-wires an outer `<Container>` that consumers cannot size, while `Container` itself takes a `size` prop (cf. `page-header/root.tsx:5` which *does* expose `containerSize`). | Add `containerSize?: React.ComponentProps<typeof Container>["size"]`, matching `PageHeaderRoot`. |
| `site-header/nav-list.tsx:6` | P3 | Fixed `<ul>` while `nav-item.tsx`/`mobile-nav-item.tsx` are `useRender`. | Same fix as `site-footer/column-list.tsx`. |

##### stats-row

No pattern findings beyond the blank-line list; all five parts set slots and extend DOM types.

##### step-tracks

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `step-tracks/header-title.tsx:6` | P2 | Hard-coded `<h3>`. | `useRender` + `useRender.ComponentProps<"h3">`. |
| `step-tracks/body-title.tsx:6` | P2 | Hard-coded `<h4>`. | `useRender` + `useRender.ComponentProps<"h4">`. |
| `step-tracks/body-title.tsx:7`, `body-description.tsx`, `body.tsx` | P3 | Slot names say `step-tracks-step-*` but the parts are named `Body*` (`StepTracksBodyTitle` → `data-slot="step-tracks-step-title"`). Namespace key, filename and slot disagree. | Rename the slots to `step-tracks-body-title` / `-description` / `-body`, or rename the parts. |

##### testimonial-grid

No pattern findings beyond the blank-line list. `avatar.tsx` and `quote-icon.tsx` both extend
correctly and set slots; `item.tsx`/`author.tsx` use `figure`/`figcaption` appropriately.

##### article-tags

No pattern findings beyond the blank-line list — but see the `landing/index.ts` export-path issue
in the cross-cutting table.

---

**Missing blank line after `Props`:** (§3 — 109 of 136 part files, i.e. **80% of the folder**)

- `landing/components/container.tsx:10`
- `landing/components/prose-article.tsx:6`
- `landing/components/section.tsx:10`
- `landing/components/text.tsx:10`
- `landing/components/article-card/arrow.tsx:5`
- `landing/components/article-card/content.tsx:4`
- `landing/components/article-card/description.tsx:4`
- `landing/components/article-card/frame.tsx:4`
- `landing/components/article-card/image-fallback.tsx:4`
- `landing/components/article-card/meta-item.tsx:4`
- `landing/components/article-card/meta-items.tsx:4`
- `landing/components/article-card/meta.tsx:4`
- `landing/components/article-card/root.tsx:6`
- `landing/components/article-card/tags.tsx:5`
- `landing/components/article-card/title.tsx:4`
- `landing/components/article-tags/root.tsx:4`
- `landing/components/article-tags/tag.tsx:4`
- `landing/components/bento-grid/featured-content.tsx:4`
- `landing/components/bento-grid/featured-description.tsx:4`
- `landing/components/bento-grid/featured-icon.tsx:4`
- `landing/components/bento-grid/featured-item.tsx:8`
- `landing/components/bento-grid/featured-label.tsx:4`
- `landing/components/bento-grid/featured-title.tsx:4`
- `landing/components/bento-grid/item-body.tsx:2`
- `landing/components/bento-grid/item-description.tsx:4`
- `landing/components/bento-grid/item-icon.tsx:4`
- `landing/components/bento-grid/item-layout.tsx:4`
- `landing/components/bento-grid/item-title.tsx:4`
- `landing/components/bento-grid/root.tsx:4`
- `landing/components/comparison-section/content.tsx:4`
- `landing/components/comparison-section/media.tsx:4`
- `landing/components/comparison-section/panel-list.tsx:4`
- `landing/components/comparison-section/panel-title.tsx:10`
- `landing/components/comparison-section/panels.tsx:4`
- `landing/components/comparison-section/tag-list.tsx:4`
- `landing/components/comparison-section/tag.tsx:4`
- `landing/components/contact-cards/card-description.tsx:5`
- `landing/components/contact-cards/card-title.tsx:5`
- `landing/components/contact-cards/card.tsx:4`
- `landing/components/contact-cards/root.tsx:4`
- `landing/components/cta-banner/actions.tsx:4`
- `landing/components/cta-banner/description.tsx:5`
- `landing/components/cta-banner/title.tsx:5`
- `landing/components/eyebrow/icon.tsx:7`
- `landing/components/eyebrow/label.tsx:7`
- `landing/components/feature-grid/card-description.tsx:4`
- `landing/components/feature-grid/card-title.tsx:4`
- `landing/components/landing-hero/actions.tsx:4`
- `landing/components/landing-hero/content.tsx:4`
- `landing/components/landing-hero/lead.tsx:5`
- `landing/components/landing-hero/media.tsx:4`
- `landing/components/landing-hero/title.tsx:5`
- `landing/components/logo-marquee/item.tsx:6`
- `landing/components/logo-marquee/root.tsx:5`
- `landing/components/logo-marquee/static-track.tsx:4`
- `landing/components/logo-marquee/title.tsx:4`
- `landing/components/logo-marquee/viewport.tsx:4`
- `landing/components/numbered-cards/card-description.tsx:4`
- `landing/components/numbered-cards/card-header.tsx:4`
- `landing/components/numbered-cards/card-icon.tsx:7`
- `landing/components/numbered-cards/card-label.tsx:4`
- `landing/components/numbered-cards/card-title.tsx:4`
- `landing/components/numbered-cards/card.tsx:4`
- `landing/components/page-header/lead.tsx:5`
- `landing/components/page-header/title.tsx:5`
- `landing/components/section-intro/description.tsx:4`
- `landing/components/section-intro/title.tsx:5`
- `landing/components/site-footer/bottom-text.tsx:4`
- `landing/components/site-footer/bottom.tsx:4`
- `landing/components/site-footer/brand-description.tsx:4`
- `landing/components/site-footer/brand.tsx:4`
- `landing/components/site-footer/column-link.tsx:6`
- `landing/components/site-footer/column-list.tsx:4`
- `landing/components/site-footer/column-title.tsx:4`
- `landing/components/site-footer/column.tsx:2`
- `landing/components/site-footer/columns.tsx:4`
- `landing/components/site-footer/root.tsx:5`
- `landing/components/site-footer/social-links.tsx:4`
- `landing/components/site-header/actions.tsx:4`
- `landing/components/site-header/brand.tsx:6`
- `landing/components/site-header/mobile-actions.tsx:4`
- `landing/components/site-header/mobile-menu.tsx:7`
- `landing/components/site-header/mobile-nav-item.tsx:6`
- `landing/components/site-header/nav-item.tsx:6`
- `landing/components/site-header/nav-list.tsx:4`
- `landing/components/site-header/nav.tsx:4`
- `landing/components/stats-row/divider.tsx:4`
- `landing/components/stats-row/item.tsx:2`
- `landing/components/stats-row/label.tsx:4`
- `landing/components/stats-row/value.tsx:4`
- `landing/components/step-tracks/body-description.tsx:4`
- `landing/components/step-tracks/body-title.tsx:4`
- `landing/components/step-tracks/body.tsx:7`
- `landing/components/step-tracks/header-icon.tsx:7`
- `landing/components/step-tracks/header-subtitle.tsx:4`
- `landing/components/step-tracks/header-text.tsx:2`
- `landing/components/step-tracks/header-title.tsx:7`
- `landing/components/step-tracks/header.tsx:4`
- `landing/components/step-tracks/root.tsx:4`
- `landing/components/step-tracks/step.tsx:4`
- `landing/components/step-tracks/steps.tsx:7`
- `landing/components/testimonial-grid/author-name.tsx:4`
- `landing/components/testimonial-grid/author-role.tsx:4`
- `landing/components/testimonial-grid/author.tsx:4`
- `landing/components/testimonial-grid/footer.tsx:4`
- `landing/components/testimonial-grid/item.tsx:4`
- `landing/components/testimonial-grid/quote-icon.tsx:5`
- `landing/components/testimonial-grid/quote.tsx:4`
- `landing/components/testimonial-grid/root.tsx:4`

Note: this is the *dominant* style in `landing/` (109 vs 27), so the folder is self-consistent —
it just disagrees with §3. Whichever way it is resolved, it should be resolved mechanically.

---

#### landing summary

**Counts**

| Severity | Count |
| --- | --- |
| P1 | **0** |
| P2 | **24** (1 folder-wide structural + 23 file-level) |
| P3 | **119** (109 blank-line + 10 other) |

P2 breakdown: 14 × missing slot identifier, 8 × heading part should use `useRender`,
1 × namespace-in-`index.ts` (affects all 16 subfolders), 1 × `ArticleTags` exported from the
wrong module.

**Top themes**

1. **Blank line after `Props` (109 files, P3).** By far the largest single number, and purely
   mechanical. `landing/` is the origin of this drift for the whole package.
2. **Slot identity is lost whenever a part delegates to `Heading`/`Text`/`Section` (14 parts,
   P2).** `PageHeader.Title`, `CtaBanner.Title`, `LandingHero.Root`, `ComparisonSection.Root`
   etc. all render with the *base* component's slot, so consumer CSS and tests cannot target
   the specific part. This is the most functionally significant finding in the chunk.
3. **Two competing approaches to titles.** `contact-cards` / `cta-banner` / `page-header` /
   `section-intro` / `landing-hero` route titles through the polymorphic `Heading`; `article-card` /
   `bento-grid` / `feature-grid` / `numbered-cards` / `step-tracks` / `site-footer` hard-code
   `<h3>`/`<h4>` with no `render` escape hatch (8 parts, P2). Marketing pages care about heading
   outline more than anything else in the package — this should be unified.
4. **Namespace object lives in `index.ts` (structural, P2).** Consistent across all 16 subfolders
   and the direct cause of the `ArticleTags` leak.
5. **`useRender` adoption is good where it matters** — `container`, `section`, `heading`, `text`,
   `prose-article`, `article-card/root`, all four header/footer link parts and `logo-marquee/item`
   are canonical. Very few genuine gaps beyond the heading parts; deliberately *not* flagging the
   ~90 plain layout `div`/`p` parts.

**Suggested order of attack**

1. **Mechanical sweep, one commit:** blank line after `Props` (109 files) + the stray blank line
   in `section-intro/root.tsx:5` + `site-header/bar.tsx:4-6` redundant `aria-label`. Zero
   behaviour change; also settle the Biome import-group question package-wide here.
2. **Add the 14 missing slots.** Small, additive, unblocks styling/testing. Do this before any
   restructuring so tests can pin behaviour.
3. **Convert the 8 hard-coded heading parts to `useRender`.** Type-level change to
   `useRender.ComponentProps<"h3">`; the existing `heading.tsx`/`section-title.tsx` are the model.
4. **Fix the `ArticleTags` export path** in `landing/index.ts` and `article-card/index.ts:14`
   (one-line, but a public-API correction — do it in its own commit).
5. **Restructure `<sub>/index.ts` → `<sub>/<sub>.tsx` + thin `index.ts`,** and move
   `*-variants.ts` / `*.test.tsx` into their folders. Largest diff, purely mechanical, do last.
6. **Amend `CONVENTIONS.md`** to bless the two deliberate `landing/` deviations: nested
   sub-component folders with unprefixed part filenames, and compose-order namespace keys.

---

### Part 6 — `menubar` → `sheet`

Root: `/Users/emilien/Documents/ui/packages/ui/src`. All paths below are relative to that root.
Every finding was confirmed by reading the file.

---

#### menubar

**Verdict:** structurally clean — a consistent thin wrapper over `DropdownMenu`; the only issue is the missing blank line after `Props` in 15 of 16 parts.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `menubar/components/menubar-checkbox-item.tsx:10` | P3 | `className={className}` passed raw — the rest of the kit always routes through `cn()` | `className={cn(className)}` or drop the prop and let `{...props}` carry it |

**Missing blank line after `Props`:**
- `menubar/components/menubar-checkbox-item.tsx:6`
- `menubar/components/menubar-content.tsx:6`
- `menubar/components/menubar-group.tsx:5`
- `menubar/components/menubar-item.tsx:5`
- `menubar/components/menubar-menu.tsx:5`
- `menubar/components/menubar-portal.tsx:5`
- `menubar/components/menubar-radio-group.tsx:5`
- `menubar/components/menubar-radio-item.tsx:5`
- `menubar/components/menubar-root.tsx:5`
- `menubar/components/menubar-separator.tsx:6`
- `menubar/components/menubar-shortcut.tsx:5`
- `menubar/components/menubar-sub-content.tsx:6`
- `menubar/components/menubar-sub-trigger.tsx:5`
- `menubar/components/menubar-sub.tsx:5`
- `menubar/components/menubar-trigger.tsx:6`

---

#### money-input

**Verdict:** single-component folder, conventions respected, but `className` is repurposed for the wrapper in a way the extended `Props` type contradicts.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `money-input/components/money-input.tsx:5` | P2 | `Props extends Omit<React.ComponentProps<typeof InputGroup.Input>, …>` yet the declared `className?: string` is applied to `InputGroup.Root`, not the input. Every other wrapper-plus-control in the kit (`native-select-root.tsx:12`, `native-date-field.tsx:14`) uses `wrapperClassName` for the outer div and `className` for the control. | Rename to `wrapperClassName` for `InputGroup.Root` and let the inherited `className` reach `InputGroup.Input`, matching `NativeSelectRoot` |
| `money-input/components/money-input.tsx` | P3 | The folder has no namespace object; `money-input.tsx` is a part implementation. Acceptable for a single-component folder (same as `radius-map`), but §1 reserves `<component>.tsx` for the namespace. | Leave as-is or document the single-component exception |

---

#### native-date-picker

**Verdict:** the worst folder in this chunk — no namespace object, three parts exported individually from `index.ts`, and three components with inline prop types and no `Props` interface.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `native-date-picker/index.ts:1-3` | P1 | Exports three parts directly; no namespace. §5 requires `index.ts` to re-export only the namespace. | Build `NativeDatePicker = { Date, DateTime, Time }` (or keep three components but move the namespace into `components/native-date-picker.tsx`) and export only that |
| `native-date-picker/components/native-date-picker.tsx:5-10` | P1 | Inline props type in the signature, no `Props` interface: `props: Omit<React.ComponentProps<typeof NativeDateField>, "type" \| "slot" \| "icon">` | `interface Props extends Omit<React.ComponentProps<typeof NativeDateField>, "type" \| "slot" \| "icon"> {}` then `export function NativeDatePicker(props: Props)` |
| `native-date-picker/components/native-date-time-picker.tsx:5-10` | P1 | Same inline props type | Same fix |
| `native-date-picker/components/native-time-picker.tsx:5-10` | P1 | Same inline props type | Same fix |
| `native-date-picker/components/native-date-picker.tsx:1` | P2 | `<component>.tsx` holds a part implementation instead of the namespace object (§1) | Rename the implementation to `native-date-picker-date.tsx` and make `native-date-picker.tsx` the namespace |
| `native-date-picker/components/native-date-field.tsx:6` | P3 | `slot: string` is a required *public* prop used to build `data-slot`; it is an internal detail leaking into a type consumers can reach via `React.ComponentProps<typeof NativeDateField>` | Keep the shared field internal (it already is — not in the namespace); no change needed if the namespace fix above lands |

---

#### native-select

**Verdict:** clean; the `wrapperClassName` split is the reference for the rest of the kit.

**Missing blank line after `Props`:**
- `native-select/components/native-select-optgroup.tsx:5`
- `native-select/components/native-select-option.tsx:5`

---

#### navigation-menu

**Verdict:** consistent Base UI wrapper; only blank-line issues plus one part with no slot.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `navigation-menu/components/navigation-menu-positioner.tsx:15` | P2 | No `data-slot` on the Positioner, Popup or Viewport — the only part in the folder without a slot identifier (§6) | Add `data-slot="navigation-menu-positioner"` / `-popup` / `-viewport` |
| `navigation-menu/components/navigation-menu.tsx:22` | P3 | The `navigationMenuTriggerStyle` re-export sits *after* the namespace here, but `segmented-control.tsx:4` puts the equivalent re-export *before* it | Pick one position (end of file) and apply to both |

**Missing blank line after `Props`:**
- `navigation-menu/components/navigation-menu-content.tsx:5`
- `navigation-menu/components/navigation-menu-indicator.tsx:5`
- `navigation-menu/components/navigation-menu-item.tsx:5`
- `navigation-menu/components/navigation-menu-link.tsx:5`
- `navigation-menu/components/navigation-menu-list.tsx:5`
- `navigation-menu/components/navigation-menu-positioner.tsx:5`
- `navigation-menu/components/navigation-menu-trigger.tsx:7`

---

#### pagination

**Verdict:** good `Props` hygiene; the four plain-DOM parts are the clearest `useRender` gap in this chunk.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `pagination/components/pagination-root.tsx:5` | P2 | Renders a raw `<nav>`; a consumer wanting the pagination inside an existing landmark cannot retarget it | `interface Props extends useRender.ComponentProps<"nav"> {}` + `useRender({ defaultTagName: "nav", props: mergeProps<"nav">({ className: cn(…, className), "aria-label": "Pagination" }, props), render, state: { slot: "pagination" } })` |
| `pagination/components/pagination-content.tsx:5` | P2 | Raw `<ul>` list container — a canonical `useRender` case (§4 "layout wrappers, list items") | Same shape with `defaultTagName: "ul"`, `state: { slot: "pagination-content" }` |
| `pagination/components/pagination-item.tsx:4` | P2 | Raw `<li>` | `defaultTagName: "li"`, `state: { slot: "pagination-item" }` |
| `pagination/components/pagination-ellipsis.tsx:6` | P3 | Raw `<span>`; decorative, so polymorphism is marginal — flag only for folder consistency once the three above move | Optional: `defaultTagName: "span"` |

**Missing blank line after `Props`:**
- `pagination/components/pagination-content.tsx:5`
- `pagination/components/pagination-ellipsis.tsx:6`
- `pagination/components/pagination-item.tsx:4`
- `pagination/components/pagination-root.tsx:5`

---

#### popover

**Verdict:** clean Base UI wrapper; one plain-`div` part and blank lines.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `popover/components/popover-header.tsx:6` | P2 | Raw `<div>` layout wrapper with no `render` escape hatch, unlike `Section.Root` | `interface Props extends useRender.ComponentProps<"div"> {}` + `useRender({ defaultTagName: "div", props: mergeProps<"div">({ className: cn("flex flex-col gap-0.5", className) }, props), render, state: { slot: "popover-header" } })` |

**Missing blank line after `Props`:**
- `popover/components/popover-close.tsx:4`
- `popover/components/popover-description.tsx:6`
- `popover/components/popover-header.tsx:6`
- `popover/components/popover-root.tsx:4`
- `popover/components/popover-title.tsx:6`
- `popover/components/popover-trigger.tsx:4`

---

#### profile-header

**Verdict:** conventions respected end to end — `Props` extends, blank lines present, every element slotted, namespace with JSDoc. No findings.

---

#### progress

**Verdict:** clean; blank lines only.

**Missing blank line after `Props`:**
- `progress/components/progress-label.tsx:6`
- `progress/components/progress-value.tsx:6`

---

#### radio-group

**Verdict:** clean; one blank line.

**Missing blank line after `Props`:**
- `radio-group/components/radio-group-item.tsx:6`

---

#### radius-map

**Verdict:** single-component folder that diverges from the kit's prop conventions — bare `Props`, `readonly` modifiers used nowhere else, no rest spread.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `radius-map/components/radius-map.tsx:16` | P2 | `interface Props { … }` extends nothing and swallows all DOM props — a consumer cannot pass `id`, `aria-*` or `data-*` to the map | `interface Props extends Omit<React.ComponentProps<typeof MapView>, "center" \| "zoom" \| "onReady"> { … }` and spread `{...props}` onto `MapView` |
| `radius-map/components/radius-map.tsx:17-23` | P3 | `readonly` on every member — no other `Props` in the package uses it | Drop `readonly` for consistency |
| `radius-map/components/radius-map.tsx:1` | P3 | No `data-slot` / `state.slot` anywhere in the component (§6) | Pass `data-slot="radius-map"` to `MapView` |

---

#### rating

**Verdict:** parts are well-formed, but `ReviewItem` is a second component smuggled through the `Rating` namespace file and `index.ts`.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `rating/index.ts:1-5` and `rating/components/rating.tsx:13` | P2 | `ReviewItem` is exported directly from the namespace file and from `index.ts` alongside the `Rating` namespace — §5 says `index.ts` re-exports only the namespace | Either move `ReviewItem` into its own `review-item/` folder with its own `index.ts`, or fold it in as `Rating.ReviewItem` |
| `rating/components/rating-input.tsx:55` | P3 | The star `<button>` has `data-slot` but the hidden `<input>` at line 81 has none | Add `data-slot="rating-input-value"` |

---

#### resizable

**Verdict:** clean wrapper over `react-resizable-panels`; namespace has no `Root`.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `resizable/components/resizable.tsx:8-12` | P3 | Namespace has no `Root` key — §5 wants `Root` first. `PanelGroup` is the de facto root. | Add `Root: ResizablePanelGroup` first (keep `PanelGroup` as an alias for compatibility) |
| `resizable/components/resizable-panel-group.tsx:19` | P3 | `className={cn(className)}` — `cn()` wrapping nothing | `className={className}` or add the base classes the comment says are unnecessary |

**Missing blank line after `Props`:**
- `resizable/components/resizable-panel-group.tsx:6` (JSDoc follows immediately)
- `resizable/components/resizable-panel.tsx:4`

---

#### responsive-dialog

**Verdict:** the most coherent of the three composites — every part branches on the shared context and the bridging decisions are documented; only cosmetic issues.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `responsive-dialog/components/responsive-dialog-content.tsx:7` | P3 | Bare `interface Props { … }` (no `extends`). Defensible for a composite that must reconcile two prop sets, but it silently drops `id`/`aria-*`/`data-*`. | Consider `extends Pick<React.ComponentProps<"div">, "id" \| "role"> `or document the closed contract |
| `responsive-dialog/components/responsive-dialog-root.tsx:7` | P3 | Same bare `Props` — same call, shared with `ResponsiveSheetRoot` (identical shape, so at least consistent) | Extract the shared shape into one type both roots use |

**Missing blank line after `Props`:**
- `responsive-dialog/components/responsive-dialog-body.tsx:6` (JSDoc follows immediately)
- `responsive-dialog/components/responsive-dialog-description.tsx:7`
- `responsive-dialog/components/responsive-dialog-header.tsx:7`
- `responsive-dialog/components/responsive-dialog-title.tsx:7`

---

#### responsive-select

**Verdict:** delegation is consistent (every part is a one-line pass-through to `Select.*`, with `Root` doing the mobile projection), but `Root` declares its `Props` *after* the component and the namespace key order is not alphabetical.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `responsive-select/components/responsive-select-root.tsx:137` | P3 | `interface Props` is declared **below** `ResponsiveSelectRoot` (line 39) — the only file in the chunk that does this; §3's blank-line rule presumes `Props` precedes the component | Move the interface above line 39, blank line, then the component |
| `responsive-select/components/responsive-select-root.tsx:137` | P3 | Bare `interface Props { … }` — coherent with the other composite roots but not with the delegating parts, which all `extends React.ComponentProps<typeof Select.X>` | Acceptable; document why the root's contract is closed (mobile projection reads props, so unknown props cannot be honoured) |
| `responsive-select/components/responsive-select.tsx:19-27` | P3 | Namespace order is `Root, Trigger, Value, Content, Group, Label, Item` — §5 wants alphabetical after `Root` | Reorder to `Root, Content, Group, Item, Label, Trigger, Value` |
| `responsive-select/components/native-options-from-content.tsx:13` | P3 | Bare `interface Props { children: React.ReactNode }` for an internal helper | `extends React.ComponentProps<typeof React.Fragment>` is wrong here; simplest is to leave it but note it is internal (not in the namespace) — no consumer impact |

**Missing blank line after `Props`:**
- `responsive-select/components/native-options-from-content.tsx:16`
- `responsive-select/components/responsive-select-content.tsx:5`
- `responsive-select/components/responsive-select-group.tsx:5`
- `responsive-select/components/responsive-select-item.tsx:5`
- `responsive-select/components/responsive-select-label.tsx:5`
- `responsive-select/components/responsive-select-value.tsx:5`

---

#### responsive-sheet

**Verdict:** delegates correctly and mirrors `responsive-dialog` almost line for line, but the two composites' public surfaces have drifted apart — and three files reference `React.ComponentProps` without importing React.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `responsive-sheet/components/responsive-sheet.tsx:16-25` | P2 | No `Close` part, while `ResponsiveDialog` exposes one (`responsive-dialog.tsx:23`). A consumer closing a responsive sheet from inside has no part to use. | Add `responsive-sheet-close.tsx` mirroring `responsive-dialog-close.tsx` and register `Close: ResponsiveSheetClose` |
| `responsive-sheet/components/responsive-sheet-content.tsx:6-13` | P2 | Props diverge from `ResponsiveDialogContent` (`responsive-dialog-content.tsx:7-22`): missing `overlayClassName` and `autoFocus`. Same composite pattern, different contract. | Add both props and forward them the same way the dialog half does |
| `responsive-sheet/components/responsive-sheet-footer.tsx:5` | P2 | No `closeLabel` prop, unlike `ResponsiveDialogFooter` (`responsive-dialog-footer.tsx:8`), so the mobile half cannot render the auto close button | Mirror the dialog footer's `closeLabel` handling |
| `responsive-sheet/components/responsive-sheet-body.tsx:3` | P3 | Uses `React.ComponentProps<"div">` with **no** `import type * as React from "react"` — relies on the ambient global React namespace | Add `import type * as React from "react";` |
| `responsive-sheet/components/responsive-sheet-footer.tsx:5` | P3 | Same missing React import | Same fix |
| `responsive-sheet/components/responsive-sheet-header.tsx:6` | P3 | Same missing React import | Same fix |

**Missing blank line after `Props`:**
- `responsive-sheet/components/responsive-sheet-body.tsx:4` (JSDoc follows immediately)
- `responsive-sheet/components/responsive-sheet-description.tsx:7`
- `responsive-sheet/components/responsive-sheet-footer.tsx:6`
- `responsive-sheet/components/responsive-sheet-header.tsx:7`
- `responsive-sheet/components/responsive-sheet-title.tsx:7`

---

#### scroll-area

**Verdict:** clean, but the part name does not match its file/namespace key.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `scroll-area/components/scroll-area-bar.tsx:6` | P3 | Function is `ScrollBar` while the file is `scroll-area-bar.tsx` and the namespace key is `Bar` — every other folder names the part `<Component><Part>` | Rename to `ScrollAreaBar` |

**Missing blank line after `Props`:**
- `scroll-area/components/scroll-area-bar.tsx:6`
- `scroll-area/components/scroll-area-root.tsx:7`

---

#### section

**Verdict:** the reference for `useRender` in `Root`/`Title`, but its four sibling parts are raw JSX — and even `Root`/`Title` are missing the blank line the conventions doc quotes them for.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `section/components/section-heading.tsx:4` | P2 | Raw `<div>` while `SectionRoot`/`SectionTitle` in the same folder use `useRender` — the heading group is the most likely candidate for `<hgroup>` | `interface Props extends useRender.ComponentProps<"div"> {}` + `useRender({ defaultTagName: "div", props: mergeProps<"div">({ className: cn("flex min-w-0 flex-col gap-1", className) }, props), render, state: { slot: "section-heading" } })` |
| `section/components/section-description.tsx:4` | P2 | Raw `<p>`; a description that needs to be a `<div>` (wrapping a list) cannot be retargeted | Same shape with `defaultTagName: "p"`, `state: { slot: "section-description" }` |
| `section/components/section-header.tsx:4` | P2 | Raw `<div>` layout wrapper | Same shape, `state: { slot: "section-header" }` |
| `section/components/section-actions.tsx:4` | P2 | Raw `<div>` layout wrapper | Same shape, `state: { slot: "section-actions" }` |
| `section/components/section-actions.tsx:3` | P3 | `React.ComponentProps<"div">` with no React import (ambient global) | Add `import type * as React from "react";` |
| `section/components/section-description.tsx:3` | P3 | Same missing React import | Same fix |
| `section/components/section-header.tsx:3` | P3 | Same missing React import | Same fix |
| `section/components/section-heading.tsx:3` | P3 | Same missing React import | Same fix |

**Missing blank line after `Props`:**
- `section/components/section-actions.tsx:4`
- `section/components/section-description.tsx:4`
- `section/components/section-header.tsx:4`
- `section/components/section-heading.tsx:4`
- `section/components/section-root.tsx:7` (JSDoc follows immediately)
- `section/components/section-title.tsx:7` (JSDoc follows immediately — this is the exact snippet §3 shows as *correct*)

---

#### segmented-control

**Verdict:** clean; one namespace-file layout nit.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `segmented-control/components/segmented-control.tsx:4` | P3 | The `segmentedControlVariants` re-export sits between the imports and the namespace JSDoc; `navigation-menu.tsx` puts the equivalent at the end of the file | Move it below the namespace declaration to match |

**Missing blank line after `Props`:**
- `segmented-control/components/segmented-control-item.tsx:7`

---

#### select

**Verdict:** clean and well-typed (including the generic `SelectRoot`); blank lines only.

**Missing blank line after `Props`:**
- `select/components/select-group.tsx:5`
- `select/components/select-item.tsx:6`
- `select/components/select-label.tsx:5`
- `select/components/select-scroll-down-button.tsx:6`
- `select/components/select-scroll-up-button.tsx:6`
- `select/components/select-separator.tsx:5`
- `select/components/select-value.tsx:5`

---

#### separator

**Verdict:** the only folder in the chunk with no `components/` sub-part convention applied to its own name — `separator.tsx` is the implementation, not a namespace — plus a bare internal `Props`.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `separator/components/separator.tsx:5` | P3 | `<component>.tsx` holds the implementation instead of a namespace object (§1). Acceptable single-component exception (same as `money-input`, `radius-map`) but it is the third distinct treatment of that filename slot in this chunk. | Either adopt `Separator.Root` + namespace, or document the single-component exception once |
| `separator/components/separator-line.tsx:4` | P3 | `interface Props { orientation: … }` extends nothing and the component never spreads props, so `className` cannot reach the `<span>` | `interface Props extends React.ComponentProps<"span"> { orientation: … }` and spread `{...props}` |

**Missing blank line after `Props`:**
- `separator/components/separator.tsx:6`
- `separator/components/separator-line.tsx:7`

---

#### sheet

**Verdict:** consistent Base UI wrapper; missing namespace JSDoc, two plain-`div` parts, and the most blank-line misses after `menubar`.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `sheet/components/sheet.tsx:14` | P3 | Namespace object has no JSDoc — every other namespace in this chunk has one | Add `/** The Sheet parts as one namespace. */` above `export const Sheet` |
| `sheet/components/sheet-header.tsx:5` | P2 | Raw `<div>` layout wrapper with no `render` escape hatch | `interface Props extends useRender.ComponentProps<"div"> {}` + `useRender({ defaultTagName: "div", props: mergeProps<"div">({ className: cn("flex flex-col gap-0.5 p-4", className) }, props), render, state: { slot: "sheet-header" } })` |
| `sheet/components/sheet-footer.tsx:5` | P2 | Raw `<div>` layout wrapper | Same shape, `state: { slot: "sheet-footer" }` |

**Missing blank line after `Props`:**
- `sheet/components/sheet-close.tsx:4`
- `sheet/components/sheet-description.tsx:5`
- `sheet/components/sheet-footer.tsx:5`
- `sheet/components/sheet-header.tsx:5`
- `sheet/components/sheet-overlay.tsx:5`
- `sheet/components/sheet-portal.tsx:4`
- `sheet/components/sheet-root.tsx:4`
- `sheet/components/sheet-title.tsx:5`
- `sheet/components/sheet-trigger.tsx:4`

---

#### Cross-cutting (whole chunk)

| Scope | Severity | Issue | Fix |
| --- | --- | --- | --- |
| 85 of 101 files in the chunk | P3 | §6 asks for a blank line between external packages and `#/` imports. Only 16 files have it (`popover/*`, `progress/*`, `radio-group/*`, `resizable/*`, `scroll-area/*`, `section/section-root.tsx`, `section/section-title.tsx`); the other 85 have none. The dominant style contradicts the spec. | Pick one and enforce with Biome's `organizeImports`. The majority (no blank line) is what Biome produces by default — updating §6 is likely cheaper than reformatting 85 files. |
| 7 files (`section/*`, `responsive-sheet/*`) | P3 | `React.ComponentProps` used without `import type * as React from "react"` | Add the import; every other file in the chunk has it |

---

#### Chunk 6 summary

**Counts by severity**

| Severity | Count |
| --- | --- |
| P1 | 5 |
| P2 | 17 |
| P3 | 27 (+81 missing-blank-line occurrences, listed per folder) |

Files audited: 101 non-test/non-stories `.tsx` + 22 `index.ts` across 22 folders.

**Top themes**

1. **Missing blank line after `Props` is near-universal — 81 occurrences across 17 of 22 folders.** `menubar` (15), `sheet` (9), `navigation-menu` (7), `select` (7), `popover` (6), `responsive-select` (6), `section` (6) lead. Notably `section/components/section-title.tsx:7` — the file §3 quotes as the *correct* example — violates the rule itself, so the spec's exemplar needs fixing alongside the code.
2. **`native-date-picker` is the one folder that breaks the public API contract.** No namespace object, three parts exported directly from `index.ts`, and all three picker components use inline prop types with no `Props` interface. It accounts for 4 of the 5 P1s.
3. **`useRender` adoption stopped at `Section.Root`/`Section.Title`.** Eleven plain-DOM layout parts still render raw JSX with `data-slot`: all four remaining `section/` parts (inconsistent inside the reference folder itself), `pagination` root/content/item, `sheet` header/footer, `popover-header`. These are exactly the "containers, layout wrappers, list items" §4 names.
4. **The three `responsive-*` composites delegate consistently but their public surfaces have drifted.** `ResponsiveSheet` lacks `Close`, `overlayClassName`, `autoFocus` and footer `closeLabel` that `ResponsiveDialog` has, despite being line-for-line the same pattern. `ResponsiveSelectRoot` additionally declares its `Props` *below* the component — unique in the chunk.
5. **The `<component>.tsx` filename slot has four different meanings.** Namespace object (most folders), part implementation (`native-date-picker`), single-component implementation (`money-input`, `radius-map`, `separator`). Single-component folders need an explicit rule in §1 so the exception stops reading as drift.

---

### Part 7 — `shortcut` → `user-avatar`, and the package exports map

Scope: `shortcut, sidebar, skeleton, slider, sonner, spinner, spreadsheet, stat-card, stepper, sticky-action-bar, styles, switch, table, tabs, textarea, time-picker, toggle, toggle-group, tooltip, translation-input, user-avatar` + the package `exports` surface.

All paths are relative to `/Users/emilien/Documents/ui/packages/ui/src`.

---

#### shortcut

Verdict: clean — correct `Props`, `data-slot`, JSDoc, blank line; only the import grouping is off.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `shortcut/components/shortcut.tsx:1` | P3 | External (`react`) and `#/` imports are in one block; §6 and the reference files (`card/components/card-root.tsx`) put a blank line between them | Insert a blank line after `import type * as React from "react";` |
| `shortcut/index.ts:1` | P3 | Single-part component with no namespace file — consistent with `Skeleton`/`Textarea`, no action needed beyond noting the split convention | — |

#### sidebar

Verdict: the reference folder for `useRender` (5 parts do it right), but the other ~12 raw-JSX layout/list parts were never migrated, and `useSidebar` is unreachable from the package subpath.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `sidebar/index.ts:1` | P2 | `useSidebar` is re-exported by `sidebar/components/sidebar.tsx:25` but **not** by `index.ts`, so `@voila.dev/ui/sidebar` does not expose it. `SidebarProvider` is useless to a consumer that cannot read the state | Add `export { useSidebar } from "#/sidebar/context/sidebar-context.tsx";` to `sidebar/index.ts` (or re-export the whole namespace file) |
| `sidebar/context/sidebar-context.tsx` | P3 | File contains no JSX but uses the `.tsx` extension; sibling contexts elsewhere (`toggle-group/context/toggle-group-context.ts`, `spreadsheet/context/spreadsheet-context.ts`) are `.ts` | Rename to `sidebar-context.ts` and update the 6 importers |
| `sidebar/components/sidebar-content.tsx:5` | P2 | Layout wrapper renders a raw `<div>`; §4 names "layout wrappers" as `useRender` candidates, and the folder already uses it for `GroupLabel`/`GroupAction`/`MenuAction`/`MenuButton`/`MenuSubButton` | `interface Props extends useRender.ComponentProps<"div"> {}` + `useRender({ defaultTagName: "div", props: mergeProps<"div">({ className: cn(…, className) }, props), render, state: { slot: "sidebar-content" } })` |
| `sidebar/components/sidebar-header.tsx:5` | P2 | Same — raw `<div>` layout wrapper, no `render` | As above with `slot: "sidebar-header"` |
| `sidebar/components/sidebar-footer.tsx:5` | P2 | Same — raw `<div>` layout wrapper | As above with `slot: "sidebar-footer"` |
| `sidebar/components/sidebar-group.tsx:5` | P2 | Same — raw `<div>` layout wrapper | As above with `slot: "sidebar-group"` |
| `sidebar/components/sidebar-group-content.tsx:5` | P2 | Same — raw `<div>` layout wrapper | As above with `slot: "sidebar-group-content"` |
| `sidebar/components/sidebar-inset.tsx:5` | P2 | Renders a raw `<main>`; polymorphism is genuinely useful here (a consumer may want `<div>` or `<section>` when `<main>` is already taken by the app shell) | `useRender.ComponentProps<"main">` + `defaultTagName: "main"` |
| `sidebar/components/sidebar-menu.tsx:5` | P2 | Raw `<ul>` list container | `useRender.ComponentProps<"ul">`, `slot: "sidebar-menu"` |
| `sidebar/components/sidebar-menu-item.tsx:5` | P2 | Raw `<li>` — §4 explicitly names list items | `useRender.ComponentProps<"li">`, `slot: "sidebar-menu-item"` |
| `sidebar/components/sidebar-menu-sub.tsx:5` | P2 | Raw `<ul>` | `useRender.ComponentProps<"ul">`, `slot: "sidebar-menu-sub"` |
| `sidebar/components/sidebar-menu-sub-item.tsx:5` | P2 | Raw `<li>` | `useRender.ComponentProps<"li">`, `slot: "sidebar-menu-sub-item"` |
| `sidebar/components/sidebar-menu-badge.tsx:5` | P2 | Raw `<div>` text/badge element | `useRender.ComponentProps<"div">`, `slot: "sidebar-menu-badge"` |
| `sidebar/components/sidebar-group-label.tsx:6`, `sidebar/components/sidebar-menu-button.tsx:10`, `sidebar/components/sidebar-menu-action.tsx:6`, `sidebar/components/sidebar-menu-sub-button.tsx:6` | P3 | `Props` extends BOTH `useRender.ComponentProps<T>` and `React.ComponentProps<T>`; the former already includes the latter, so the second clause is redundant noise | Drop the `React.ComponentProps<…>` clause: `interface Props extends useRender.ComponentProps<"div"> {}` |
| `sidebar/components/sidebar-rail.tsx:6` | P3 | Raw `<button>` with a hard-wired `onClick`; not polymorphic by design (acceptable per §4), but the `data-sidebar="rail"` legacy attribute duplicates `data-slot` | Optional: drop `data-sidebar` now that `data-slot` is the styling hook (same for `sidebar-trigger.tsx:17`, `sidebar-menu-skeleton.tsx:28`, `sidebar-root.tsx:48`) |
| `sidebar/components/sidebar-root.tsx:74` | P3 | The outermost desktop `<div>` carries `data-slot="sidebar"` and the inner container carries `data-slot="sidebar-container"`, while the `collapsible="none"` and mobile branches put `data-slot="sidebar"` on a *different* node — three shapes for the same slot name | Keep `data-slot="sidebar"` on exactly one node per branch (the node that receives `className`/`...props`) |
| `sidebar/components/sidebar-menu-button.tsx:49` | P3 | Reassigns the `tooltip` parameter (`tooltip = { children: tooltip }`) instead of a local | `const tooltipProps = typeof tooltip === "string" ? { children: tooltip } : tooltip;` |
| `sidebar/components/sidebar.tsx:54` | P3 | Namespace omits `Root`-adjacent `useSidebar` from `index.ts` (see above); key ordering itself is correct (`Root` first, then alphabetical) | — |

#### skeleton

Verdict: correct shape; only the blank line is missing.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `skeleton/components/skeleton.tsx:5` | P3 | No blank line before the JSDoc that precedes the component (§3) | Blank line between `interface Props … {}` and `/** … */` |

#### slider

Verdict: clean Base-UI wrapper; blank lines missing, namespace JSDoc present.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `slider/components/slider-root.tsx:5` | P3 | Module-level helper `resolveThumbValues` sits between the imports and `Props`; every other folder puts `Props` first | Move `Props` above the helper, or the helper into `slider/lib/` |

#### sonner

Verdict: intentionally a thin third-party re-export; two deviations from the house style.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `sonner/components/sonner.tsx:36` | P2 | `export function Toaster(props: ToasterProps)` — no local `Props` interface, and the props type is **exported** (line 11), which §2 forbids | `interface Props extends ToasterProps {}` and drop `export type { ToasterProps }`; consumers reach it via `React.ComponentProps<typeof Toaster>` |
| `sonner/components/sonner.tsx:40` | P2 | The rendered `<Sonner>` carries no `data-slot` (only `className="toaster group"`) | Add `data-slot="toaster"` |
| `sonner/components/sonner.tsx:64` | P3 | `export { toast } from "sonner";` sits at the bottom of the file, after the component; every other folder groups re-exports directly under the imports | Move above the component |

#### spinner

Verdict: correct; two cosmetic items.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `spinner/components/spinner.tsx:4` | P3 | Uses `React.ComponentProps` with no `react` import (relies on the UMD global) while sibling files import `import type * as React from "react"` — pick one | Add `import type * as React from "react";` (also `stat-card-root.tsx:4`, `stat-card-chart.tsx:3`, `stat-card-label.tsx:3`, `stat-card-value.tsx:3`, `stat-card-header.tsx:3`, `stat-card-delta.tsx:10`) |
| `spinner/components/spinner.tsx:1` | P3 | No blank line between the external import and `#/lib/utils.ts` | Add it |

#### spreadsheet

Verdict: the largest folder and the most internally consistent one — every public part extends a DOM props type and sets `data-slot`; the deviations are the internal composition helpers and one stray export.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `spreadsheet/index.ts:1` | P2 | `NestedTableInput` is exported as a standalone component from the `spreadsheet` subpath but is not a member of the `Spreadsheet` namespace — the only folder in this chunk that ships a second top-level component | Either add it to the namespace (`Spreadsheet.NestedInput`) or promote it to its own `nested-table-input/` folder with its own subpath export |
| `spreadsheet/components/spreadsheet-mobile-list.tsx:3` | P3 | Bare `interface Props { … }` on a part that renders a `<div>`/`<ul>` and accepts no DOM props — the wrapper is unstyleable from the outside | `interface Props extends React.ComponentProps<"div"> { … }` and spread `...props` onto the wrapper |
| `spreadsheet/components/spreadsheet-resize-handle.tsx:5` | P3 | Bare `interface Props` wrapping a `<div>`; no `className` passthrough | Extend `React.ComponentProps<"div">` and `cn(…, className)` |
| `spreadsheet/components/spreadsheet-virtual-spacer.tsx:1` | P3 | Bare `interface Props` wrapping a `<tr>` | Extend `React.ComponentProps<"tr">` |
| `spreadsheet/components/spreadsheet-desktop-table.tsx:11`, `spreadsheet-image-preview.tsx:3`, `spreadsheet-sort-caret.tsx:8`, `spreadsheet-skeleton.tsx:5`, `spreadsheet-drop-line-indicator.tsx:3`, `spreadsheet-virtual-rows.tsx:9` | — | Bare `interface Props` is **correct** here: these are internal composition components whose props are data, not DOM attributes (§2 only forbids it "when it wraps a DOM element") | No action |
| `spreadsheet/components/spreadsheet-cell-image.tsx:59` | P2 | Emits `data-slot="spreadsheet-cell"` — the same slot as `SpreadsheetCell` — so CSS/tests cannot distinguish an image cell from a control cell | Use `data-slot="spreadsheet-cell-image"` (the sticky-first-column rules in `spreadsheet-styles.ts` target `td[data-slot]` generically, so they keep working) |
| `spreadsheet/components/spreadsheet-add-row.tsx:22` | P3 | `data-slot="spreadsheet-add-row"` is on the wrapping `<tr>` while `className`/`...props` go to the inner `<button>` — the slot and the styleable node are different elements (documented in the JSDoc, but inconsistent with every other part) | Consider `data-slot="spreadsheet-add-row"` on the button and `spreadsheet-add-row-row` on the `tr` |
| `spreadsheet/components/spreadsheet-desktop.tsx:76` | P3 | `SpreadsheetDesktop` and `SpreadsheetDesktopTable` are internal, not in the namespace, yet named like parts | Fine as-is; consider a `lib/`-style subfolder or an `internal-` prefix for clarity |
| `spreadsheet/components/spreadsheet.tsx:28` | P3 | Namespace keys after `Root` follow DOM order (`Columns, Column, Header, Head, Body, Row, …`), not alphabetical as §5 describes; the JSDoc justifies it | Leave, or note the deliberate exception in the conventions doc |
| `spreadsheet/components/spreadsheet-head.tsx:74` | P3 | `{...props}` then `{...reorder.headProps}` — consumer props can be silently overwritten by internal ones | Use `mergeProps` (already a dependency) so `onKeyDown`/`onPointerDown` compose instead of clobber |

#### stat-card

Verdict: clean parts and namespace; only blank lines and the missing React import.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `stat-card/components/stat-card-header.tsx:4`, `stat-card-label.tsx:4`, `stat-card-value.tsx:4` | P2 | Pure layout/text wrappers rendering raw `<div>`s — `Label`/`Value` in particular are text elements a consumer may want as `<dt>`/`<dd>` or a heading | Migrate to `useRender` + `state: { slot: "stat-card-label" }` (mirror `section/components/section-title.tsx`) |

#### stepper

Verdict: solid; contexts use the wrong file extension and the text parts are not polymorphic.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `stepper/context/stepper-context.tsx`, `stepper/context/stepper-item-context.tsx` | P3 | No JSX in either file, yet both are `.tsx` | Rename to `.ts` and update importers |
| `stepper/components/stepper-title.tsx:6`, `stepper-description.tsx:6` | P2 | Render raw `<div>`s for what is semantically a step heading and its description; §4 names headings/text as `useRender` candidates | `useRender.ComponentProps<"div">` + `render` so a consumer can pass `render={<h3 />}` |
| `stepper/components/stepper-item.tsx:14` | P3 | No JSDoc on the part while its siblings (`Indicator`, `Separator`, `Root`) all have one | Add a one-line JSDoc |

#### sticky-action-bar

Verdict: clean — correct `Props`, blank line, `data-slot`, documented default.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `sticky-action-bar/components/sticky-action-bar.tsx:1` | P3 | External/`#/` imports not separated by a blank line | Add it |
| `sticky-action-bar/components/sticky-action-bar.tsx:16` | P3 | Destructures `children` only to re-render it inside the `<div>`; every other single-element part relies on `{...props}` | Drop `children` from the destructure and let it ride in `...props` |

#### styles

Verdict: CSS only — no `.tsx` in scope. Wired into `exports` through the `./styles/*.css` pattern; see the package section.

#### switch

Verdict: clean. Correct `Props extends SwitchPrimitive.Root.Props`, blank line, `data-slot` on both root and thumb, default variant in the destructure. No findings.

#### table

Verdict: eight tidy parts, but the namespace has no JSDoc and none of the parts is polymorphic.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `table/components/table.tsx:10` | P3 | Namespace object has no JSDoc (§5) | Add `/** The Table parts as one namespace. */` |
| `table/components/table-root.tsx:11` | P3 | The wrapping `<div data-slot="table-container">` accepts only `containerClassName` — no ref, no props passthrough, so a consumer cannot attach a scroll listener to it | Consider a `containerProps` prop, or document the limitation |

#### tabs

Verdict: correct Base-UI wrappers; namespace JSDoc missing.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `tabs/components/tabs.tsx:6` | P3 | Namespace object has no JSDoc (§5) | Add `/** The Tabs parts as one namespace. */` |

#### textarea

Verdict: clean apart from the blank line and import grouping.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `textarea/components/textarea.tsx:1` | P3 | External/`#/` imports not separated by a blank line | Add it |

#### time-picker

Verdict: the weakest folder in the chunk — a hand-rolled 25-key props object that re-declares DOM props instead of extending anything, and props destructured in the body rather than the signature.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `time-picker/components/time-picker.tsx:16` | P2 | `interface Props { … }` extends nothing while re-declaring `className`, `id`, `aria-invalid`, `aria-label` by hand — §2 requires extending a base type | `interface Props extends Omit<React.ComponentProps<typeof Button>, "value" \| "defaultValue" \| "onChange"> { … }`, dropping the hand-written DOM keys |
| `time-picker/components/time-picker.tsx:48` | P3 | `export function TimePicker(props: Props)` then a 20-line destructure in the body; §6/the whole codebase destructure in the signature with defaults inline | Move the destructure (defaults included) into the parameter list |
| `time-picker/components/time-picker-option.tsx:4` | P2 | Renders a `Button` with no `data-slot`; §6 requires every part to carry a slot identifier | Add `data-slot="time-picker-option"` |
| `time-picker/components/time-picker-option.tsx:8` | P3 | Passes a ref through a custom `selectedOptionRef` prop — React 19 treats `ref` as a normal prop, so the indirection is unnecessary | Rename to `ref` and let it flow to the `Button` |
| `time-picker/components/time-picker-hidden-input.tsx:6` | P3 | `HiddenTimeInput` breaks the `<Component><Part>` naming used by every other file in the folder | Rename to `TimePickerHiddenInput` |
| `time-picker/index.ts:1` | P3 | Single-component folder with no namespace file even though it has 3 components — acceptable (only `TimePicker` is public) but worth a comment | — |

#### toggle

Verdict: clean. Correct `Props` composition with `VariantProps`, `data-slot`, defaults in the destructure, `toggleVariants` exported deliberately. No findings.

#### toggle-group

Verdict: correct parts; namespace JSDoc missing and one nested-provider oddity.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `toggle-group/components/toggle-group.tsx:4` | P3 | Namespace object has no JSDoc (§5) | Add `/** The ToggleGroup parts as one namespace. */` |
| `toggle-group/components/toggle-group-root.tsx:38` | P3 | The context provider is rendered *inside* the primitive and its value is a fresh object literal on every render | Hoist to `React.useMemo` and wrap the primitive rather than its children |

#### tooltip

Verdict: correct Base-UI wrappers; namespace JSDoc missing.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `tooltip/components/tooltip.tsx:6` | P3 | Namespace object has no JSDoc (§5) | Add `/** The Tooltip parts as one namespace. */` |
| `tooltip/components/tooltip-content.tsx:24` | P3 | The `Positioner` and `Arrow` carry no `data-slot`, so only the popup is targetable | Add `data-slot="tooltip-positioner"` / `"tooltip-arrow"` |
| `tooltip/components/tooltip-trigger.tsx:5` | P3 | `({ ...props }: Props)` — the destructure is a no-op | `(props: Props)` |

#### translation-input

Verdict: good docs and a correctly-extending root; the locale select is the weak spot.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `translation-input/components/translation-input-locale-select.tsx:4` | P3 | Bare `interface Props { … }` on a part that renders a `<select>`, with no `className`/DOM passthrough | `interface Props extends Omit<React.ComponentProps<"select">, "value" \| "onChange"> { … }` |
| `translation-input/components/translation-input-locale-select.tsx:32` | P3 | `cn("…")` with a single argument and no `className` merged last (§6) | `cn("…", className)` once `className` is accepted |
| `translation-input/components/translation-input.tsx:8` | P3 | `export type { TranslationValue }` is re-exported from both the component file and `index.ts` — two paths to the same type | Keep only the `index.ts` re-export |

#### user-avatar

Verdict: clean single component; the folder name for the helper is off-pattern.

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `user-avatar/libs/get-initials.ts` | P3 | Helper folder is `libs/` while every other folder in the chunk uses `lib/` (`sidebar/lib`, `time-picker/lib`, `translation-input/lib`) | Rename `user-avatar/libs/` → `user-avatar/lib/` |
| `user-avatar/index.ts:2` | P3 | Exports the `getInitials` helper alongside the component; defensible as a genuinely-public util, but no other folder ships a bare string helper | Confirm it is intentional, otherwise drop it |
| `user-avatar/components/user-avatar.tsx:39` | P3 | The inner name/description `<span>`s are not overridable and the middle `<div>` has no slot | Add `data-slot="user-avatar-body"` for stylability |

---

**Missing blank line after `Props`:**

- sidebar: `sidebar/components/sidebar-content.tsx:4`, `sidebar-footer.tsx:4`, `sidebar-group.tsx:4`, `sidebar-group-content.tsx:4`, `sidebar-header.tsx:4`, `sidebar-input.tsx:5`, `sidebar-inset.tsx:4`, `sidebar-menu.tsx:4`, `sidebar-menu-badge.tsx:4`, `sidebar-menu-item.tsx:4`, `sidebar-menu-sub.tsx:4`, `sidebar-menu-sub-item.tsx:4`, `sidebar-rail.tsx:5`, `sidebar-separator.tsx:5`, `sidebar-trigger.tsx:6`
- skeleton: `skeleton/components/skeleton.tsx:5`
- slider: `slider/components/slider-root.tsx:16`, `slider/components/slider-value.tsx:5`
- spinner: `spinner/components/spinner.tsx:4`
- spreadsheet: `spreadsheet/components/spreadsheet-body.tsx:4`, `spreadsheet-cell-text.tsx:5`, `spreadsheet-columns.tsx:3`, `spreadsheet-header.tsx:5`, `spreadsheet-mobile-add-row.tsx:5`, `spreadsheet-row-actions.tsx:4`
- stat-card: `stat-card/components/stat-card-chart.tsx:3`, `stat-card-header.tsx:3`, `stat-card-label.tsx:3`, `stat-card-root.tsx:4`, `stat-card-value.tsx:3`
- stepper: `stepper/components/stepper-description.tsx:5`, `stepper-indicator.tsx:7`, `stepper-separator.tsx:6`, `stepper-title.tsx:5`
- table: `table/components/table-body.tsx:5`, `table-caption.tsx:5`, `table-cell.tsx:5`, `table-footer.tsx:5`, `table-head.tsx:5`, `table-header.tsx:5`, `table-row.tsx:5`
- tabs: `tabs/components/tabs-content.tsx:5`, `tabs-root.tsx:5`, `tabs-trigger.tsx:5`
- textarea: `textarea/components/textarea.tsx:4`

45 occurrences (all P3). Note the canonical example itself — `empty/components/empty-content.tsx:3` — also lacks it, so a Biome/`biome check` rule or a codemod is the only realistic fix.

---

#### Package exports surface

Audited `/Users/emilien/Documents/ui/packages/ui/package.json` (`exports`, lines 43–145) against the on-disk folders.

Mechanical result — **the flat subpath map is fully consistent**:

- 96 subpath entries; every one resolves to a file that exists on disk.
- Every directory under `src/` that has an `index.ts` (**93** of them) has a matching `exports` entry. No folder is missing.
- Every component subpath is `"./<folder>": "./src/<folder>/index.ts"` — name and path agree in all cases. The only intentional aliases are `"./utils" → "./src/lib/index.ts"`, `"./cva" → "./src/lib/cva.ts"` and `"./hooks" → "./src/hooks/index.ts"`.
- `styles/` is the only index-less directory and is served by the `"./styles/*.css"` pattern (`*` matches across `/`, so `themes/default.css` and `tokens/colors.css` both resolve).

| File | Severity | Issue | Fix |
| --- | --- | --- | --- |
| `packages/ui/package.json:97` | P3 | `"./landing.css": "./src/landing/styles/landing.css"` is a bespoke CSS entry while every other stylesheet goes through `"./styles/*.css"` — two conventions for shipping CSS | Either move the file under `src/styles/` or add a generic `"./*/styles/*.css"` pattern |
| `packages/ui/package.json:43` | P3 | No `"./package.json": "./package.json"` entry; some tooling (bundler resolution, `npm ls`, Tailwind source scanning) reads it and will hit an `ERR_PACKAGE_PATH_NOT_EXPORTED` | Add the entry |
| `packages/ui/package.json:43` | P3 | No `"."` root export — deliberate ("subpath exports only, tree-shakeable by construction"), but nothing tells a consumer that; a bare `import … from "@voila.dev/ui"` fails with an opaque error | Optionally map `"."` to a module that throws a helpful message, or document it in the README |
| `packages/ui/package.json:43` | P3 | Entries point at `./src/**/*.ts(x)` (source), yet `files` and `build` also ship `dist` — no `types`/`import` conditions, so the published package always compiles TS from source in the consumer's build | Confirm intentional; otherwise add `{ "types": …, "import": "./dist/…" }` conditions |
| `spreadsheet/index.ts:1` | P2 | The only in-scope subpath exporting a **second** top-level component (`NestedTableInput`) beyond its namespace + types (repeat of the spreadsheet finding above) | Fold into the namespace or give it its own folder + subpath |
| `sidebar/index.ts:1` | P2 | The only in-scope subpath whose namespace file exports a public hook (`useSidebar`) that `index.ts` fails to forward (repeat of the sidebar finding above) | Re-export `useSidebar` |

Everything else — `shortcut`, `skeleton`, `slider`, `sonner`, `spinner`, `stat-card`, `stepper`, `sticky-action-bar`, `switch`, `table`, `tabs`, `textarea`, `time-picker`, `toggle`, `toggle-group`, `tooltip`, `translation-input`, `user-avatar` — exports exactly its namespace (or single component) plus, where relevant, its `cva` variants and genuinely-public types. Consistent.

---

#### Chunk 7 summary

**Counts by severity**

| Severity | Count |
| --- | --- |
| P1 | 0 |
| P2 | 22 |
| P3 | 79 (of which 45 are the missing blank line) |
| **Total** | **101** |

**Top themes**

1. **`useRender` migration is half-done in `sidebar/` and untouched in `table`/`stat-card`/`stepper`.** Sidebar already ships 5 correct `useRender` parts, so the remaining 11 raw-JSX layout/list wrappers (`Content`, `Header`, `Footer`, `Group`, `GroupContent`, `Inset`, `Menu`, `MenuItem`, `MenuSub`, `MenuSubItem`, `MenuBadge`) read as an unfinished pass rather than a deliberate exception. Same story for `StatCard.Label/Value/Header` and `Stepper.Title/Description`. This is the single largest P2 cluster (18 of 22).
2. **The missing blank line after `Props` is endemic — 45 files, and the reference file itself violates it.** It is not worth hand-fixing; it needs a lint rule or a codemod.
3. **`sonner/` and `time-picker/` are the two folders that never got the treatment.** `sonner` exports its props type (the one §2 hard rule broken anywhere in the chunk) and has no `data-slot`; `time-picker` hand-rolls a 25-key `Props` that extends nothing and destructures in the body.
4. **The package `exports` map is in excellent shape** — 93/93 folders wired, zero missing, zero broken paths, zero name/path mismatches. The only real API gaps are inside two `index.ts` files: `sidebar` drops `useSidebar`, `spreadsheet` ships a stray `NestedTableInput`.
5. **Small structural drift accumulating across folders**: `.tsx` extensions on JSX-free context files (`sidebar`, `stepper`), `libs/` vs `lib/` (`user-avatar`), namespace JSDoc missing on 4 of 9 namespaces (`table`, `tabs`, `toggle-group`, `tooltip`), and inconsistent import grouping / `import type * as React` presence. Each is trivial alone; together they are what makes the package read as several codebases.
