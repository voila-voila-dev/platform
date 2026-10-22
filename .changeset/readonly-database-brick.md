---
"@voila.dev/platform": minor
---

Add the `readonly-database` brick: the `ReadonlyDatabase` port, `guardQuery` (one read-only statement over a table allowlist, withheld columns, a row cap) and `maskRows` for personal data columns, with `/readonly-database/pg` (`pgReadonlyDatabase`, on `pg`, an optional peer dependency) and `/readonly-database/memory` (`stubReadonlyDatabase`, `unavailableReadonlyDatabase`).
