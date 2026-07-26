/** Row height. `compact` fits about a third more rows on a screen. */
export type DataTableDensity = "comfortable" | "compact";

/** Cell padding overrides applied to the table for each density. */
export const DENSITY_CELL_CLASS: Record<DataTableDensity, string> = {
	comfortable: "",
	compact: "[&_td]:py-1 [&_th]:py-1 [&_td]:text-[0.8rem]",
};
