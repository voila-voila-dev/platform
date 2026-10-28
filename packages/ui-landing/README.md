# @voila.dev/ui-landing

Marketing pages on [`@voila.dev/ui`](../ui): a hero, sections, feature and
bento grids, comparisons, testimonials, a site header and footer, and the
readers that print an article written in the `@voila.dev/ui` content editor.
Every word comes in through props.

- **Docs:** [ui.voila.dev/ui-landing](https://ui.voila.dev/ui-landing/quick-start/)

## Install

```sh
bun add @voila.dev/ui @voila.dev/ui-landing
```

```css
@import "@voila.dev/ui/styles/globals.css";
@import "@voila.dev/ui/styles/themes/default.css";
@import "@voila.dev/ui-landing/styles/landing.css";
@import "@voila.dev/ui-landing/styles/article.css"; /* with the article readers */
```

`landing.css` declares this package's Tailwind sources, so there is no
`@source` path to write. The tones (`brand`, `highlight`) are the theme's.

## Subpaths

| Subpath | |
| --- | --- |
| `@voila.dev/ui-landing` | The sections, `SiteHeader`, `SiteFooter`, `useScrollLock`. |
| `@voila.dev/ui-landing/article` | `withArticleReaders`: heading anchors, scrolling tables, figures, callouts, charts and calculators for an article's body. |

Peers: `react@19`, `react-dom@19`, `tailwindcss@4`. `ProseArticle` also needs
`@plugin "@tailwindcss/typography"`.
