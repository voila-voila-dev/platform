---
"@voila.dev/platform": minor
---

Every port is now named `<Thing>Service`: `IdGeneratorService`, `SecureRandomService`, `KeyValueCacheService`, `FileStorageService`, `FileDownloadsService`, `FileTokensService`, `LocationProviderService`, `RateLimiterService`, `ReadonlyDatabaseService`, `ScreenshotService` (was `Screenshots`), `SearchEngineService` and `SpreadsheetService` (was `SpreadsheetRenderer`). Their files follow (`services/rate-limiter-service.ts`…). Repositories, references and adapters keep their names.
