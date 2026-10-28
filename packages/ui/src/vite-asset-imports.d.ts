// Vite's `?worker&url` import gives back the URL of a bundled worker entry;
// the app bundlers type it through `vite/client`, but this package typechecks
// standalone, so declare the module shape here.
declare module "*?worker&url" {
	const url: string;
	export default url;
}
