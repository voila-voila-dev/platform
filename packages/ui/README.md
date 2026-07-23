# @voila.dev/ui

A React component system that ships as **source**. No `dist/`, no build step —
you install the `.tsx` files and your bundler compiles them alongside your own
code.

- **Docs:** [ui.voila.dev](https://ui.voila.dev)
- **Storybook:** [storybook.ui.voila.dev](https://storybook.ui.voila.dev)
- **npm:** [`@voila.dev`](https://www.npmjs.com/org/voila.dev)

## Install

```sh
bun add @voila.dev/ui @voila.dev/ui-tokens
```

```css
/* your globals.css */
@import "tailwindcss";
@import "@voila.dev/ui/styles/globals.css";
```

Each package declares its own Tailwind sources relative to itself, so there is
no `@source` path to write and no difference between a workspace symlink and a
real `node_modules` install. Add-ons export the same file:
`@import "@voila.dev/ui-chart/styles.css";`.

Peers: `react@19`, `react-dom@19`, `tailwindcss@4`.

## Packages

| Package | What it is |
| --- | --- |
| `@voila.dev/ui` | The core: ~80 components, from `Button` to `Sidebar`. |
| `@voila.dev/ui-tokens` | The design tokens, as plain CSS custom properties. |
| `@voila.dev/ui-chart` | Composable SVG charts, no charting library underneath. |
| `@voila.dev/ui-datatable` | A full-featured read-only table: sorting, resizing, pinning, export. |
| `@voila.dev/ui-spreadsheet` | `Spreadsheet`, a virtualized keyboard-driven editable grid. |
| `@voila.dev/ui-map` | A lazy-loaded MapLibre GL map view. |
| `@voila.dev/ui-filter` | A filter toolbar and pager for list pages. |
| `@voila.dev/ui-landing` | Marketing sections: heroes, feature grids, testimonials, footers. |
| `@voila.dev/ui-email-block-editor` | A drag-and-drop block editor for marketing emails. |

All publish in lockstep at one shared version, so cross-package versions always
line up.

`packages/ui-branding` holds the voila.dev brand identity and is deliberately
**not published** — build your own instead, see
[Your branding package](https://ui.voila.dev/start/branding/).

## Theming

Every colour, radius and font is a CSS custom property. Override the handful you
care about and the whole system follows; no component is forked.

```css
:root {
	--primary: oklch(0.55 0.21 145);
	--radius: 0.5rem;
}
.dark {
	--primary: oklch(0.72 0.18 145);
}
```

Full token map: [Theming and tokens](https://ui.voila.dev/start/theming/).

## Working on this repo

```sh
bun install
bun run dev            # Storybook (:4003) + docs site (:4004)
bun run test           # vitest, every package
bun run check-types    # tsc, every package
bun run lint           # biome
```

The apps consume the packages through workspace links, so editing a component
hot-reloads in both the Storybook and the docs site with no rebuild.

### Layout

```
apps/
  storybook.ui.voila.dev   # the component Storybook
  ui.voila.dev             # the docs site (Astro + Starlight)
packages/
  ui, ui-tokens, ui-chart, ui-map, ui-datatable, ui-spreadsheet,
  ui-filter, ui-landing, ui-email-block-editor
  ui-branding              # private: the voila.dev brand
  typescript-config        # private: shared tsconfig bases
```

Node and Bun are pinned through `engines` in the root `package.json`, which
[proto](https://moonrepo.dev/proto) reads. Pinning Node matters: on Node 25 the
built-in Web Storage shadows jsdom's, and the tests that touch `localStorage`
break in a way that looks like a bug in the component.

### CI

- **Pull requests** run lint, type-check and tests, then deploy both sites to
  isolated per-PR Cloudflare Workers and post the links. Closing the PR tears
  them down.
- **Merges to `main`** publish every package to public npm at
  `0.0.<run number>` and redeploy both sites to production.

Secrets required: `NPM_TOKEN`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

## Licence

MIT.
