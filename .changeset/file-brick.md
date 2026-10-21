---
"@voila.dev/platform": minor
---

Add the `file` brick: `Files.make({ kinds })` declares the application's kinds of files (prefix, visibility, upload rule, image widths) and hands typed keys and upload links; `FileStorage`, `FileDownloads` and `FileTokens` ports with `FileRef`, `ImageRef` and `FileLinkLifetime`; `/file/bun` (`bunS3FileStorage`, `hmacFileTokens`), `/file/http-server` (`serveSecureFile`) and `/file/memory` (`inMemoryFiles`).
