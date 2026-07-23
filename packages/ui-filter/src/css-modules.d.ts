// Side-effect CSS imports (e.g. maplibre-gl's stylesheet) carry no type
// declarations; the app bundlers get this from `vite/client`, but this package
// typechecks standalone, so declare the module shape here.
declare module "*.css" {}
