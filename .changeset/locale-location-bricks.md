---
"@voila.dev/platform": minor
---

New `locale` and `location` bricks. `locale` has the ISO `Locale` and `Language` lists and `SupportedLocales.make` for the locales an app renders. `location` has addresses, coordinates, country codes, the `LocationProvider` port with `locateAddress` and `resolveAddressCoordinates`, and `SupportedCountries.make` for an app's markets. `AddressFormatter` writes an address the way its country's post does, for every country (formats from Google libaddressinput), and takes an app's own format per country. Adapters: `/location/ban` (Base Adresse Nationale), `/location/here` (HERE), `/location/memory`, and `routedLocationProvider` to chain them.
