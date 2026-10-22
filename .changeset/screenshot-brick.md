---
"@voila.dev/platform": minor
---

Add the `screenshot` brick: `Screenshots.capture({ url, width, height })` renders a page in a fresh, signed-out browser and returns its viewport as a `Screenshot` PNG of exactly that size, or a `ScreenshotError`; `/screenshot/bun` (`bunWebViewScreenshots`, one `Bun.WebView` per capture, WebKit on macOS and Chromium elsewhere, `settle` and `timeout` options) and `/screenshot/memory` (`stubScreenshots`).
