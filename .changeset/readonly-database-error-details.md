---
"@voila.dev/platform": patch
---

`pgReadonlyDatabase` describes a failed statement with the Postgres `code`, `detail`, `hint`, `position`, `table`, `column` and `constraint` after its message, so the reader can fix its SQL. Only those fields are read from the pg error.
