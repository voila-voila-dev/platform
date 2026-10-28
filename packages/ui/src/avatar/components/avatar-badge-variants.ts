import { cva } from "#/lib/cva.ts";

export const avatarBadgeVariants = cva({
	base: "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background select-none group-data-[size=sm]/avatar:size-2 group-data-[size=default]/avatar:size-2.5 group-data-[size=lg]/avatar:size-3 group-data-[size=sm]/avatar:[&>svg]:hidden group-data-[size=default]/avatar:[&>svg]:size-2 group-data-[size=lg]/avatar:[&>svg]:size-2",
	variants: {
		/**
		 * Presence dot: `online` reads success, `busy` destructive, `offline`
		 * muted. Colour is the only difference between them, so give the badge a
		 * label or `title` — a screen reader gets nothing from the hue.
		 */
		status: {
			online: "bg-success text-success-foreground",
			offline: "bg-muted-foreground text-muted",
			busy: "bg-destructive text-destructive-foreground",
		},
	},
});
