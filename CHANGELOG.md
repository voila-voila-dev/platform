# @voila.dev/platform

## 0.3.1

### Patch Changes

- [#5](https://github.com/voila-voila-dev/platform/pull/5) [`a9ca3f4`](https://github.com/voila-voila-dev/platform/commit/a9ca3f4e677061054031c304ceb097111161df3d) Thanks [@emilienbidet](https://github.com/emilienbidet)! - bulk-import reads files as spreadsheets actually write them: Excel's Windows-1252 CSV, XLSX dates as ISO 8601 instead of the server's locale, and lines of bare separators dropped instead of becoming empty rows.
  
  Its literals are lowercase, like the rest of the package: draft statuses (`reviewing`, `importing`, `imported`), row issues (`missingColumn`, `required`, `invalidValue`, `duplicate`) and file rejections (`tooLarge`, `tooManyRows`, `empty`, `unreadable`, `unsupportedFormat`).

## 0.3.0

### Minor Changes

- [#3](https://github.com/voila-voila-dev/platform/pull/3) [`99751c5`](https://github.com/voila-voila-dev/platform/commit/99751c50e0f8464780a883f201bf278ea670c739) Thanks [@emilienbidet](https://github.com/emilienbidet)! - Add `bulk-import`: a file (CSV, JSON, or XLSX through `/bulk-import/xlsx`) read into a draft validated against the target's columns, reviewed and fixed cell by cell, then imported batch by batch by the application. Formats, schemas and limits are the application's to provide.
