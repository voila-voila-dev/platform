import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import {
	type BadgeColor,
	badgeColorBackgroundClass,
	badgeColorForegroundClass,
	badgeColors,
} from "#/components/badge-variants.ts";
import { Button } from "#/components/button.tsx";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/popover.tsx";
import { cn } from "#/lib/utils.ts";

const GRID_COLUMNS = 5;

/** Human-friendly label for a palette name: "blue" → "Blue". */
const formatColorName = (name: string): string =>
	name.charAt(0).toUpperCase() + name.slice(1);

const ARROW_KEY_OFFSETS: Record<string, number> = {
	ArrowLeft: -1,
	ArrowRight: 1,
	ArrowUp: -GRID_COLUMNS,
	ArrowDown: GRID_COLUMNS,
};

/**
 * Select-like trigger opening a swatch radiogroup over the catalog palette.
 * Swatch classes come from the static maps in badge-variants.ts so the palette never
 * relies on runtime class composition.
 */
function ColorPicker({
	value: controlledValue,
	defaultValue = null,
	onValueChange,
	placeholder = "Select a color",
	clearLabel = "Clear selection",
	clearable = false,
	name,
	disabled = false,
	className,
	contentClassName,
}: {
	/** Controlled selection; omit to let the picker manage its own state. */
	value?: BadgeColor | null;
	/** Initial selection for uncontrolled usage. */
	defaultValue?: BadgeColor | null;
	onValueChange?: (color: BadgeColor | null) => void;
	placeholder?: string;
	clearLabel?: string;
	/** Offer a clear affordance that reports `null`. */
	clearable?: boolean;
	/** When set, renders a hidden input so plain form posts include the color. */
	name?: string;
	disabled?: boolean;
	className?: string;
	contentClassName?: string;
}) {
	const [open, setOpen] = useState(false);
	const [uncontrolledValue, setUncontrolledValue] = useState<BadgeColor | null>(
		defaultValue,
	);
	const gridRef = useRef<HTMLDivElement>(null);

	const isControlled = controlledValue !== undefined;
	const value = isControlled ? controlledValue : uncontrolledValue;

	// Roving tabindex: a radiogroup exposes a single tab stop — the selected
	// swatch, or the first one while nothing is selected.
	const tabbableColor = value ?? badgeColors[0];

	const selectColor = (next: BadgeColor | null) => {
		if (!isControlled) setUncontrolledValue(next);
		onValueChange?.(next);
		setOpen(false);
	};

	const handleGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		const offset = ARROW_KEY_OFFSETS[event.key];
		if (offset === undefined) return;
		const swatches = gridRef.current?.querySelectorAll<HTMLButtonElement>(
			"[data-slot=color-picker-swatch]",
		);
		if (swatches === undefined || swatches.length === 0) return;
		const currentIndex = Array.prototype.indexOf.call(
			swatches,
			document.activeElement,
		);
		if (currentIndex === -1) return;
		event.preventDefault();
		const nextIndex = Math.min(
			Math.max(currentIndex + offset, 0),
			swatches.length - 1,
		);
		swatches[nextIndex]?.focus();
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				render={(props) => (
					<Button
						{...props}
						type="button"
						variant="outline"
						disabled={disabled}
						data-slot="color-picker-trigger"
						className={cn(
							"w-full justify-between gap-2 font-normal",
							className,
						)}
					>
						<span className="flex min-w-0 items-center gap-2">
							{value ? (
								<span
									aria-hidden
									className={cn(
										"size-4 shrink-0 rounded-full",
										badgeColorBackgroundClass[value],
									)}
								/>
							) : null}
							<span
								className={cn("truncate", !value && "text-muted-foreground")}
							>
								{value ? formatColorName(value) : placeholder}
							</span>
						</span>
						<CaretDownIcon className="size-4 shrink-0 text-muted-foreground" />
					</Button>
				)}
			/>
			{name !== undefined && (
				<input type="hidden" name={name} value={value ?? ""} />
			)}
			<PopoverContent align="start" className={cn("w-auto", contentClassName)}>
				<div
					ref={gridRef}
					role="radiogroup"
					aria-label={placeholder}
					data-slot="color-picker-grid"
					className="grid grid-cols-5 gap-1.5 p-0.5"
					onKeyDown={handleGridKeyDown}
				>
					{badgeColors.map((color) => (
						<button
							key={color}
							type="button"
							role="radio"
							aria-checked={value === color}
							tabIndex={color === tabbableColor ? 0 : -1}
							data-slot="color-picker-swatch"
							title={formatColorName(color)}
							aria-label={formatColorName(color)}
							onClick={() => selectColor(color)}
							className={cn(
								"flex size-6 items-center justify-center rounded-full ring-ring ring-offset-2 ring-offset-popover outline-none transition-transform hover:scale-110 focus-visible:ring-2 motion-reduce:transform-none",
								badgeColorBackgroundClass[color],
								value === color && "ring-2",
							)}
						>
							{value === color ? (
								<CheckIcon
									aria-hidden
									weight="bold"
									className={cn("size-3.5", badgeColorForegroundClass[color])}
								/>
							) : null}
						</button>
					))}
				</div>
				{clearable && value != null && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						data-slot="color-picker-clear"
						onClick={() => selectColor(null)}
					>
						{clearLabel}
					</Button>
				)}
			</PopoverContent>
		</Popover>
	);
}

export { ColorPicker };
