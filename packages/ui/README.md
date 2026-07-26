# @voila.dev/ui

React components in one package, `@voila.dev/ui`. Use them as a dependency or
make them your own — including the hard ones: email editor, spreadsheet,
charts, maps.

Every module is its own subpath export (`@voila.dev/ui/button`,
`@voila.dev/ui/chart`, …) and the published output is per-file ESM, so
you only ever bundle what you import. The `src/` `.tsx` files ship alongside
`dist/`, so your editor and your AI agent both land on real source when they
open a component.

- **Docs:** [ui.voila.dev](https://ui.voila.dev)
- **Storybook:** [storybook.ui.voila.dev](https://storybook.ui.voila.dev)
- **npm:** [`@voila.dev`](https://www.npmjs.com/org/voila.dev)

## Install

```sh
bun add @voila.dev/ui
```

```css
/* your globals.css */
@import "tailwindcss";
@import "@voila.dev/ui/styles/globals.css";
@import "@voila.dev/ui/styles/themes/default.css";
```

Two imports, two jobs: `globals.css` brings the token contract (what a colour is
called), a theme brings the values (what it is). Swap the second line for
`indigo`, `iris`, `sand`, `emerald` or `olive` — or your own file — and the
whole system follows.

The package declares its own Tailwind sources relative to itself, so there is
no `@source` path to write and no difference between a workspace symlink and a
real `node_modules` install.

Peers: `react@19`, `react-dom@19`, `tailwindcss@4`. Some domains need an extra
(optional) peer — install it only if you use them: `maplibre-gl` for `map/*`,
`@tanstack/react-table` for `datatable`, `@tanstack/react-virtual` for
`spreadsheet/*`, `@dnd-kit/*` for `email-block-editor`.

## What's inside

One package, one version — each domain behind its own subpath:

| Subpath | |
| --- | --- |
| `@voila.dev/ui/<component>` | 85 components, one convention. The floor everything else stands on. |
| `@voila.dev/ui/styles/themes/*.css` | Your whole brand in one CSS file. Six ship; change it, everything follows. |
| `@voila.dev/ui/email-block-editor` | The email template editor that lives in your app, not someone else's SaaS. |
| `@voila.dev/ui/spreadsheet` | An editable, virtualized grid your users will mistake for a native app. |
| `@voila.dev/ui/datatable` | Sorting, pinning, CSV export — the table you keep rebuilding, finished. |
| `@voila.dev/ui/chart` | Charts with zero charting library. SVG you can read, scales included. |
| `@voila.dev/ui/map-view`, `@voila.dev/ui/globe-view`, `@voila.dev/ui/radius-map` | Maps and a globe on free vector tiles. No API key, no bundle tax. |
| `@voila.dev/ui/filter` | Composable filters that survive real product requirements — including geo. |
| `@voila.dev/ui/landing` | Your marketing site, from the same system as your product. |
| `@voila.dev/ui/icon` | Icons by name, safe by default — store a string, render an icon. |

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
bun run test           # vitest
bun run check-types    # tsc
bun run lint           # biome
```

The apps consume the package through a workspace link straight into `src/`, so
editing a component hot-reloads in both the Storybook and the docs site with no
rebuild.

### Layout

```
apps/
  storybook.ui.voila.dev   # the component Storybook
  ui.voila.dev             # the docs site (TanStack Start)
packages/
  ui                       # the published package: components + one folder per
                           # domain (chart, map, filter, spreadsheet, …)
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
- **Merges to `main`** publish `@voila.dev/ui` to public npm at
  `0.0.<run number>` and redeploy both sites to production.

Secrets required: `NPM_TOKEN`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

## Licence

MIT.
