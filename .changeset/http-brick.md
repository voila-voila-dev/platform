---
"@voila.dev/platform": minor
---

`/http`: the outbound HTTP brick from tries.care. `HttpService.send(HttpRequest)` answers an `HttpResponse` (`isSuccess`, `text`, `ensureSuccess()`, `json(schema)`) or fails with `HttpError` (`blocked`, `network`, `timeout`, `interrupted`). `/http/memory` has `scriptedHttp`; `/http/bun` has `guardedHttp({ userAgent?, resolve?, fetch?, lookupTimeoutMs? })`, which only reaches public addresses: a GET follows up to three redirects, each one checked, and other methods go over https on 443 to the address that was checked.
