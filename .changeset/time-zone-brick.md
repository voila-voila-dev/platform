---
"@voila.dev/platform": minor
---

Add the `time-zone` brick: `TimeZone` (the IANA zones Bun and Node can construct, plus `UTC`, listed in `TIME_ZONES`) and `TimeZoneResolverService.resolve(coordinates)`, which returns the zone a point lies in, `None` for a zone outside `TIME_ZONES`, or a `TimeZoneResolverError`; `/time-zone/tz-lookup` (`tzLookupTimeZoneResolver`, offline, on the optional `tz-lookup` peer) and `/time-zone/memory` (`stubTimeZoneResolver`).
