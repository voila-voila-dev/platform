---
"@voila.dev/platform": patch
---

`pgReadonlyDatabase` logs only the message of a lost idle connection: the pg error holds the client, and the connection password with it.
