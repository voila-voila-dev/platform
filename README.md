# @voila.dev/platform

The technical bricks of a B2B platform on Effect, in one package with one subpath per brick.

```ts
import {} from "@voila.dev/platform"; // the core
```

## Layout

```
src/
  index.ts          @voila.dev/platform: re-exports src/core
  core/             what every brick builds on, and nothing else
  <brick>/          @voila.dev/platform/<brick>
    drizzle/        @voila.dev/platform/<brick>/drizzle (server only)
    http/           @voila.dev/platform/<brick>/http (the HttpApi contract)
      server/       @voila.dev/platform/<brick>/http/server (the handlers)
test/
  structure.test.ts the dependency rules
```

`test/structure.test.ts` enforces three rules:

- The core imports no brick. A brick may import another brick only when the dependency is listed in `ALLOWED_BRICK_DEPENDENCIES`.
- Code outside `drizzle/` and `server/` may end up in a browser bundle, so it never imports `drizzle-orm`, `node:*`, `bun` or a server-only file.
- Every entry in `exports` points to a source file that exists, and to the matching built files in `dist/`.

The package is `sideEffects: false`: no module may run anything when it is loaded. Libraries used by an adapter (drizzle-orm…) are optional peer dependencies.

## Workflow

```sh
bun install
bun run ci   # biome, tsc, bun test, build
```
