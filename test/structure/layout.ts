// Where a file sits, read from its path relative to `src/`:
//
//   index.ts, core/**              the core
//   <module>/                      a module: a brick, or a subdomain nested in one
//     index.ts, <layer>/**         its domain
//     http/**                      its HttpApi contract
//     adapters/<name>/**           one implementation of its ports
//     <submodule>/                 any other folder, with the same shape
//
// A module's domain and contract are what a browser may import; an adapter is
// whatever its technology needs.

export const LAYER_FOLDERS: ReadonlySet<string> = new Set([
	"aggregates",
	"constants",
	"entities",
	"errors",
	"events",
	"lib",
	"payloads",
	"services",
	"use-cases",
	"value-objects",
]);

export type Part =
	| { readonly kind: "domain" }
	| { readonly kind: "http" }
	| { readonly kind: "adapter"; readonly name: string };

export interface Location {
	/** `undefined` for the core, else the module's folder: `link-tracking/click`. */
	readonly module: string | undefined;
	readonly part: Part;
}

const DOMAIN: Part = { kind: "domain" };

export function locate(path: string): Location {
	const folders = path.split("/").slice(0, -1);
	if (folders.length === 0 || folders[0] === "core")
		return { module: undefined, part: DOMAIN };
	const module: Array<string> = [];
	for (const [index, folder] of folders.entries()) {
		if (module.length > 0 && LAYER_FOLDERS.has(folder)) break;
		if (module.length > 0 && folder === "http")
			return { module: module.join("/"), part: { kind: "http" } };
		if (module.length > 0 && folder === "adapters")
			return {
				module: module.join("/"),
				part: { kind: "adapter", name: folders[index + 1] ?? "" },
			};
		module.push(folder);
	}
	return { module: module.join("/"), part: DOMAIN };
}

/** The subpath a file is exported as, when it is an entry point: `./link-tracking/click/drizzle`. */
export function exportKeyOf(path: string): string | undefined {
	const { module, part } = locate(path);
	if (module === undefined) return path === "index.ts" ? "." : undefined;
	switch (part.kind) {
		case "domain":
			return path === `${module}/index.ts` ? `./${module}` : undefined;
		case "http":
			return path === `${module}/http/index.ts`
				? `./${module}/http`
				: undefined;
		case "adapter":
			return path === `${module}/adapters/${part.name}/index.ts`
				? `./${module}/${part.name}`
				: undefined;
	}
}

export function describe({ module, part }: Location): string {
	if (module === undefined) return "core";
	if (part.kind === "adapter") return `${module} (${part.name} adapter)`;
	if (part.kind === "http") return `${module} (http)`;
	return module;
}
