import { cva } from "#/lib/cva.ts";

/**
 * Shared menu recipe consumed by dropdown-menu, context-menu, menubar (via
 * dropdown-menu), combobox and command, so their popups and items stay
 * visually identical instead of each restating — and drifting from — the same
 * class strings.
 *
 * The underlying primitives expose their active/disabled state differently:
 * Base UI menus focus the item (`:focus`), Base UI combobox highlights it
 * (`data-highlighted`), and cmdk selects it (`data-selected="true"`). cmdk
 * also always renders `data-disabled="true"|"false"` while Base UI only adds
 * a bare `data-disabled` when actually disabled. Item-level recipes therefore
 * style every state selector at once — only the one matching the rendering
 * primitive ever activates — and gate disabled styles behind
 * `not-data-[disabled=false]` so cmdk's enabled items are unaffected.
 */

const menuItemBase =
	"group/menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-inset:pl-7 data-disabled:not-data-[disabled=false]:pointer-events-none data-disabled:not-data-[disabled=false]:opacity-50 focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus:*:[svg]:text-accent-foreground data-highlighted:*:[svg]:text-accent-foreground data-[selected=true]:*:[svg]:text-accent-foreground";

/** Popup container for floating menus (dropdown, context, combobox). */
export const menuContentVariants = cva({
	base: "z-50 max-h-(--available-height) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95",
});

/**
 * Menu row. `indicator: "end"` reserves right-side space (`pr-8`) for the
 * kit-consistent end-aligned check/dot indicator on selectable rows.
 */
export const menuItemVariants = cva({
	base: menuItemBase,
	variants: {
		variant: {
			default: "",
			destructive:
				"text-destructive *:[svg]:text-destructive focus:bg-destructive/10 focus:text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive data-[selected=true]:bg-destructive/10 data-[selected=true]:text-destructive dark:focus:bg-destructive/20 dark:data-highlighted:bg-destructive/20 dark:data-[selected=true]:bg-destructive/20",
		},
		indicator: {
			none: "",
			end: "pr-8",
		},
	},
	defaultVariants: {
		variant: "default",
		indicator: "none",
	},
});

/** Submenu trigger: a menu row that also lights up while its popup is open. */
export const menuSubTriggerVariants = cva({
	base: `${menuItemBase} data-popup-open:bg-accent data-popup-open:text-accent-foreground`,
});

/** End-aligned wrapper for the check/dot indicator of selectable rows. */
export const menuIndicatorVariants = cva({
	base: "pointer-events-none absolute right-2 flex size-4 items-center justify-center",
});

export const menuLabelVariants = cva({
	base: "px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7",
});

export const menuSeparatorVariants = cva({
	base: "-mx-1 my-1 h-px bg-border",
});

/** Right-aligned shortcut hint; recolors with the active menu row. */
export const menuShortcutVariants = cva({
	base: "ml-auto text-xs tracking-widest text-muted-foreground group-focus/menu-item:text-accent-foreground group-data-highlighted/menu-item:text-accent-foreground group-data-[selected=true]/menu-item:text-accent-foreground",
});
