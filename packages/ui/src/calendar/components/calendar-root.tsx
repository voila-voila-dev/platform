import {
	CaretDownIcon,
	CaretLeftIcon,
	CaretRightIcon,
} from "@phosphor-icons/react";
import type * as React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import type { Button } from "#/button/components/button.tsx";
import { buttonVariants } from "#/button/components/button-variants.ts";
import { CalendarDayButton } from "#/calendar/components/calendar-day-button.tsx";
import { weekStartFromLocale } from "#/calendar/lib/calendar-week-start.ts";
import { cn } from "#/lib/utils.ts";

// DayPicker's props are a union over `mode` (single | range | multiple); omitting a
// key must distribute so each member keeps its own `selected`/`onSelect` shape.
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
	? Omit<T, K>
	: never;

// Alias, not `interface … extends`: `DistributiveOmit` maps over react-day-picker's
// union of mode props, and an interface cannot extend a mapped type.
type Props = DistributiveOmit<
	React.ComponentProps<typeof DayPicker>,
	"locale"
> & {
	navButtonVariant?: React.ComponentProps<typeof Button>["variant"];
	/** BCP-47 locale (e.g. "fr-FR") applied to the month, weekday, and day labels. */
	locale?: string;
};

export function CalendarRoot({
	className,
	classNames,
	showOutsideDays = true,
	captionLayout = "label",
	navButtonVariant = "ghost",
	locale,
	weekStartsOn,
	formatters,
	components,
	...props
}: Props) {
	const defaultClassNames = getDefaultClassNames();

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn(
				"group/calendar bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
				String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
				String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
				className,
			)}
			captionLayout={captionLayout}
			weekStartsOn={weekStartsOn ?? weekStartFromLocale(locale)}
			formatters={{
				// Localize every visible label through the native Intl formatters so the
				// calendar carries no date-fns locale object.
				formatCaption: (date) =>
					new Intl.DateTimeFormat(locale, {
						month: "long",
						year: "numeric",
					}).format(date),
				formatMonthDropdown: (date) =>
					new Intl.DateTimeFormat(locale, { month: "short" }).format(date),
				formatYearDropdown: (date) =>
					new Intl.DateTimeFormat(locale, { year: "numeric" }).format(date),
				formatWeekdayName: (date) =>
					new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date),
				...formatters,
			}}
			classNames={{
				root: cn("w-fit", defaultClassNames.root),
				months: cn(
					"relative flex flex-col gap-4 md:flex-row",
					defaultClassNames.months,
				),
				month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
				nav: cn(
					"absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
					defaultClassNames.nav,
				),
				button_previous: cn(
					buttonVariants({ variant: navButtonVariant }),
					"size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
					defaultClassNames.button_previous,
				),
				button_next: cn(
					buttonVariants({ variant: navButtonVariant }),
					"size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
					defaultClassNames.button_next,
				),
				month_caption: cn(
					"flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
					defaultClassNames.month_caption,
				),
				dropdowns: cn(
					"flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
					defaultClassNames.dropdowns,
				),
				dropdown_root: cn(
					"relative rounded-(--cell-radius)",
					defaultClassNames.dropdown_root,
				),
				dropdown: cn(
					"absolute inset-0 bg-popover opacity-0",
					defaultClassNames.dropdown,
				),
				caption_label: cn(
					"font-medium select-none",
					captionLayout === "label"
						? "text-sm"
						: "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
					defaultClassNames.caption_label,
				),
				month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
				weekdays: cn("flex", defaultClassNames.weekdays),
				// text-[0.8rem]: shared with Button `sm` (button-variants.ts); keep in sync.
				weekday: cn(
					"flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none",
					defaultClassNames.weekday,
				),
				week: cn("mt-2 flex w-full", defaultClassNames.week),
				week_number_header: cn(
					"w-(--cell-size) select-none",
					defaultClassNames.week_number_header,
				),
				week_number: cn(
					"text-[0.8rem] text-muted-foreground select-none",
					defaultClassNames.week_number,
				),
				day: cn(
					"group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
					props.showWeekNumber
						? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
						: "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
					defaultClassNames.day,
				),
				range_start: cn(
					"relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted",
					defaultClassNames.range_start,
				),
				range_middle: cn("rounded-none", defaultClassNames.range_middle),
				range_end: cn(
					"relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted",
					defaultClassNames.range_end,
				),
				today: cn(
					"rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none",
					defaultClassNames.today,
				),
				outside: cn(
					"text-muted-foreground aria-selected:text-muted-foreground",
					defaultClassNames.outside,
				),
				disabled: cn(
					"text-muted-foreground opacity-50",
					defaultClassNames.disabled,
				),
				hidden: cn("invisible", defaultClassNames.hidden),
				...classNames,
			}}
			components={{
				Root: ({ className, rootRef, ...props }) => {
					return (
						<div
							data-slot="calendar"
							ref={rootRef}
							className={className}
							{...props}
						/>
					);
				},
				Chevron: ({ className, orientation, ...props }) => {
					if (orientation === "left") {
						return (
							<CaretLeftIcon className={cn("size-4", className)} {...props} />
						);
					}

					if (orientation === "right") {
						return (
							<CaretRightIcon className={cn("size-4", className)} {...props} />
						);
					}

					return (
						<CaretDownIcon className={cn("size-4", className)} {...props} />
					);
				},
				DayButton: ({ ...props }) => (
					<CalendarDayButton locale={locale} {...props} />
				),
				WeekNumber: ({ children, ...props }) => {
					return (
						<td {...props}>
							<div className="flex size-(--cell-size) items-center justify-center text-center">
								{children}
							</div>
						</td>
					);
				},
				...components,
			}}
			{...props}
		/>
	);
}
