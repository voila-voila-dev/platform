import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends Omit<React.ComponentProps<"input">, "type" | "size"> {
	type: "date" | "time" | "datetime-local";
	/** Base for the part's `data-slot` attributes; not the DOM `slot`. */
	slotName: string;
	icon: React.ReactNode;
	size?: "sm" | "default";
	/**
	 * Classes for the wrapper `<div>` that hosts the leading icon. Use this for
	 * layout and width (e.g. `w-full`, `w-48`); `className` styles the inner
	 * `<input>` itself, matching the rest of the kit's form controls.
	 */
	wrapperClassName?: string;
}

/**
 * Shared chrome for the native date/time/datetime-local inputs: the kit's
 * Input field styling plus a leading icon (mirroring DatePicker's trigger)
 * and click-anywhere-to-open via `showPicker()`. The WebKit indicator is
 * hidden — the whole field is the affordance, like the composed DatePicker.
 */
export function NativeDateField({
	type,
	slotName,
	icon,
	className,
	wrapperClassName,
	size = "default",
	onClick,
	...props
}: Props) {
	return (
		<div
			className={cn(
				"group/native-date-picker relative w-fit has-[input:disabled]:opacity-50",
				wrapperClassName,
			)}
			data-slot={`${slotName}-wrapper`}
			data-size={size}
		>
			<span
				className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground select-none [&_svg]:size-4"
				aria-hidden="true"
				data-slot={`${slotName}-icon`}
			>
				{icon}
			</span>
			<input
				type={type}
				data-slot={slotName}
				data-size={size}
				// `text-base` then `md:text-sm` is the same iOS zoom guard as Input.
				className={cn(
					"h-8 w-full min-w-0 rounded-lg border border-input bg-transparent py-1 pr-2.5 pl-8 text-base transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),12px)] data-[size=sm]:py-0.5 md:text-sm dark:scheme-dark dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&::-webkit-calendar-picker-indicator]:hidden",
					className,
				)}
				onClick={(event) => {
					onClick?.(event);
					if (event.defaultPrevented) return;
					const input = event.currentTarget;
					// Chrome/Edge/Firefox/Safari 16+; throws outside a user gesture.
					if (typeof input.showPicker === "function") {
						try {
							input.showPicker();
						} catch {
							// Unsupported context (e.g. cross-origin iframe) — the field
							// still works through its native segment editing.
						}
					}
				}}
				{...props}
			/>
		</div>
	);
}
