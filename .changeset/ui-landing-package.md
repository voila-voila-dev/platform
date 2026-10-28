---
"@voila.dev/ui": major
"@voila.dev/ui-landing": major
"@voila.dev/ui-platform": major
---

The landing components leave `@voila.dev/ui` for their own package, and the business pages get one.

- `@voila.dev/ui/landing` is now `@voila.dev/ui-landing`, and `@voila.dev/ui/styles/landing.css` is `@voila.dev/ui-landing/styles/landing.css`, which also declares the package's Tailwind sources.
- `SiteHeader.Root` takes `collapseBelow` (`md` or `xl`) and a controlled `open` / `onOpenChange`. The open mobile menu is a full-screen overlay that freezes the page through the new `useScrollLock`, and following one of its links closes it.
- `@voila.dev/ui-landing/article` prints an article written in the content editor: heading anchors, scrolling tables, figures that zoom, callouts (`summary`, `info`, `tip`, `warning`, `danger`), charts in the reader's locale and host-drawn calculators. Its styles are in `styles/article.css`.
- `@voila.dev/ui-platform/job-posting` is a job posting page that takes its words and facts as props.
