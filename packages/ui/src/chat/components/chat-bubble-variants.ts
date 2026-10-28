import { cva, type VariantProps } from "#/lib/cva.ts";

export const chatBubbleVariants = cva({
	base: "group/bubble relative flex w-fit min-w-0 max-w-[85%] flex-col gap-1 data-[align=end]:self-end data-[variant=ghost]:max-w-full group-data-[align=end]/message:self-end sm:max-w-[75%]",
	variants: {
		variant: {
			default:
				"*:data-[slot=chat-bubble-content]:bg-primary *:data-[slot=chat-bubble-content]:text-primary-foreground [&>[data-slot=chat-bubble-content]:is(button,a):hover]:bg-primary/80",
			secondary:
				"*:data-[slot=chat-bubble-content]:bg-secondary *:data-[slot=chat-bubble-content]:text-secondary-foreground [&>[data-slot=chat-bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
			muted:
				"*:data-[slot=chat-bubble-content]:bg-muted [&>[data-slot=chat-bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]",
			tinted:
				"*:data-[slot=chat-bubble-content]:bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)] *:data-[slot=chat-bubble-content]:text-foreground dark:*:data-[slot=chat-bubble-content]:bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)] [&>[data-slot=chat-bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.88_calc(c*0.5)_h)] dark:[&>[data-slot=chat-bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.35_calc(c*0.5)_h)]",
			outline:
				"*:data-[slot=chat-bubble-content]:border-border *:data-[slot=chat-bubble-content]:bg-background [&>[data-slot=chat-bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=chat-bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=chat-bubble-content]:is(button,a):hover]:bg-input/30",
			ghost:
				"border-none *:data-[slot=chat-bubble-content]:rounded-none *:data-[slot=chat-bubble-content]:bg-transparent *:data-[slot=chat-bubble-content]:p-0 [&>[data-slot=chat-bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=chat-bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=chat-bubble-content]:is(button,a):hover]:bg-muted/50",
			destructive:
				"*:data-[slot=chat-bubble-content]:bg-destructive/10 *:data-[slot=chat-bubble-content]:text-destructive dark:*:data-[slot=chat-bubble-content]:bg-destructive/20 [&>[data-slot=chat-bubble-content]:is(button,a):hover]:bg-destructive/20 dark:[&>[data-slot=chat-bubble-content]:is(button,a):hover]:bg-destructive/30",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export type ChatBubbleVariants = VariantProps<typeof chatBubbleVariants>;
