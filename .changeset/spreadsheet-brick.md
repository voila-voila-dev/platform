---
"@voila.dev/platform": minor
---

Add the spreadsheet brick: `/spreadsheet` describes a styled workbook (`SpreadsheetDocument`, its sheets, rows, cells and images, `cell`/`mergedCell`/`cellStyle`) and writes CSV that Excel opens as is (`serializeCsv`); `SpreadsheetRenderer` turns a document into a file, with `/spreadsheet/xlsx` (`xlsxSpreadsheetRenderer`, on exceljs) and `/spreadsheet/memory` (`stubSpreadsheetRenderer`).
