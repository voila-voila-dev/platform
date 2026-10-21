---
"@voila.dev/platform": patch
---

`xlsxImportReader` loads exceljs on its first read, so a `BulkImport` declared in code a browser bundle shares no longer pulls exceljs into that bundle.
