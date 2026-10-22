---
"@voila.dev/platform": patch
---

`ContentType` decodes a raw header (`Text/CSV; charset=utf-8` becomes `text/csv`), so `FileRef`s stored with parameters or uppercase types still decode. `ContentType.make` and `Schema.is` stay strict.
