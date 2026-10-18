# @voila.dev/platform

The technical bricks of a B2B platform on Effect, in one package with one subpath per module.

```ts
import { UserId } from "@voila.dev/platform"; // the core
import { TrackedLink } from "@voila.dev/platform/link-tracking/link";
import { drizzleTrackedLinkRepositoryLayer } from "@voila.dev/platform/link-tracking/link/drizzle";
```

## Layout

The core sits at the root. Everything else is a **module**: a brick, or a subdomain nested inside one. Every module has the same shape, at any depth:

```
src/
  index.ts                     @voila.dev/platform: the core, re-exporting src/core
  core/                        what every module builds on, and nothing else
  <module>/
    index.ts                   /<module>: its domain, ports and use cases
    aggregates/ entities/ value-objects/ services/ use-cases/
    errors/ events/ payloads/ constants/ lib/
    http/index.ts              /<module>/http: its HttpApi contract
    adapters/<name>/index.ts   /<module>/<name>: one implementation of its ports
    <submodule>/               any other folder: a module with the same shape
```

For example:

```
src/link-tracking/
  index.ts                     /link-tracking (re-exports link and click)
  link/                        /link-tracking/link
    http/                      /link-tracking/link/http
    adapters/memory/           /link-tracking/link/memory
    adapters/drizzle/          /link-tracking/link/drizzle
    adapters/http-server/      /link-tracking/link/http-server
  click/                       /link-tracking/click
    adapters/memory/           /link-tracking/click/memory
    adapters/drizzle/          /link-tracking/click/drizzle
src/email/
  adapters/resend/             /email/resend
  adapters/ses/                /email/ses
```

## Rules

`test/structure.test.ts` checks these rules on every run:

- **Files import each other through `#`** (`#link-tracking/link/aggregates/tracked-link`), never through a relative path. The `#` imports carry no extension, so the same import reads `src/*.ts` in the repository and `dist/*.js` once published.
- **The core imports no module.**
- **A module's domain and contract** may end up in a browser bundle. They never import an adapter, `node:*`, `bun`, or an adapter library.
- **An adapter** imports the domain of its own module and the core. It may also import the domain of a module its module depends on. It never imports another adapter.
- **A dependency between two modules is declared** in `MODULE_DEPENDENCIES`. A module re-exporting its own submodules is the only exception. A declared dependency that no import uses any more is reported.
- **Every package the code imports is a peer dependency.** A library that only some adapter needs (drizzle-orm, resend…) is optional in `peerDependenciesMeta`.
- **`exports` lists exactly the entry points the folders define**, each with its source and the matching built files. No two entry points may claim the same subpath, such as an adapter named like a submodule.

Two rules hold between modules:

- **No foreign key between two modules.** A module refers to another module's aggregate by its typed id (`UserId`, `TrackedLinkId`): the column gets an index, but no `references()`. Consistency comes from events (`UserDeleted` → each module cleans up) and from archiving instead of deleting. Inside a module, foreign keys are fine.
- **Shared id types live in the core; tables do not.** `UserId` and `OrganizationId` are branded types in `@voila.dev/platform`. Only the identity module knows its tables.

The package is `sideEffects: false`: no module may run anything when it is loaded.

## Workflow

```sh
bun install
bun run ci   # biome, tsc, tests, build
```

## Publishing

In the repository, `exports` and `imports` point at `src/*.ts`, so nothing needs building to run or test. `publishConfig.exports` and `publishConfig.imports` hold the same entries pointing at `dist/*.js`, which is how Effect lays out its package. pnpm swaps those fields on publish, but Bun and npm do not, so `scripts/publish-manifest` does it:

- `prepack` builds, keeps `package.json` aside, and writes the published form.
- `postpack` puts the repository's `package.json` back.

`bun pm pack` and `bun publish` both run these two hooks. The structure test checks that `publishConfig` mirrors `exports` and `imports`.
