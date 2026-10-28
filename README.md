# platform

The voila.dev platform packages.

| Package | |
|---|---|
| [`@voila.dev/platform`](packages/platform) | The technical bricks of a B2B platform on Effect |
| [`@voila.dev/ui`](packages/ui) | React components with no business in them |
| [`@voila.dev/chart`](packages/chart) | Charts for `@voila.dev/ui` |
| [`@voila.dev/motion`](packages/motion) | The motion primitives `@voila.dev/ui` and `@voila.dev/chart` animate with |

`@voila.dev/ui`, `@voila.dev/chart` and `@voila.dev/motion` always share one version.

`apps/` holds the sites deployed from `main`: the docs at [ui.voila.dev](https://ui.voila.dev), the Storybook at [storybook.ui.voila.dev](https://storybook.ui.voila.dev) and emoji.voila.dev. `packages/ui-branding` and `packages/typescript-config` are private to them. `scripts/` holds the private tools the packages use.

```sh
bun install
bunx playwright install chromium   # once, for the ui browser tests
bun run ci                          # biome, types, docs checks, tests and build
bun run docs:dev                    # or storybook:dev
```
