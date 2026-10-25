---
"@voila.dev/platform": patch
---

`ScreenshotRequest` is a `Schema.Struct` value object (`ScreenshotRequest.make({ url, width, height })`) instead of a plain interface, so an application can decode a capture request at its boundary.
