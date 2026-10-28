# @voila.dev/ui-platform

Business pages on [`@voila.dev/ui`](../ui) and
[`@voila.dev/ui-landing`](../ui-landing), written for any product: they take
values already in the reader's language and decide only how they look.

| Subpath | |
| --- | --- |
| `@voila.dev/ui-platform/job-posting` | `JobPostingPage`: the title and employer, a gallery slot, the facts, the requirements, the job, the hiring steps and the way to apply beside. |

## Install

```sh
bun add @voila.dev/ui @voila.dev/ui-landing @voila.dev/ui-platform
```

```css
@import "@voila.dev/ui-landing/styles/landing.css";
@import "@voila.dev/ui-platform/styles/sources.css";
```

Peers: `react@19`, `react-dom@19`, `tailwindcss@4`, and
`@plugin "@tailwindcss/typography"` for the description.
