# platform

The voila.dev platform packages.

| Package | |
|---|---|
| [`@voila.dev/platform`](packages/platform) | The technical bricks of a B2B platform on Effect |

`scripts/` holds the private tools the packages use (`publish-manifest`, `country-data`).

```sh
bun install
bun run ci   # biome, types, tests and build across the workspace
```
