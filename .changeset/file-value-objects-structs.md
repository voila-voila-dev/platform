---
"@voila.dev/platform": minor
---

`FileLink`, `FileStat`, `FileUpload` and `FileLinkLifetimes` are `Schema.Struct`s instead of `Schema.Class`es: their values are plain objects. Build them with `FileLink.make({...})` instead of `new FileLink({...})`, and check them with `Schema.is(FileLink)` instead of `instanceof`.
