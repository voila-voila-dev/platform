import { StarIcon } from "@phosphor-icons/react";
import * as React from "react";
import { cn } from "#/lib/utils.ts";
import {
	MAX_STARS,
	type RatingSize,
	starSizeClasses,
} from "#/rating/components/rating-stars.ts";

interface Props extends Omit<React.ComponentProps<"div">, "onChange"> {
	value: number;
	onChange: (value: number) => void;
	size?: RatingSize;
	max?: number;
	disabled?: boolean;
	name?: string;
}

/**
 * Interactive star picker. Controlled via `value` / `onChange`; hovering
 * previews the would-be selection. Keyboard accessible through a radiogroup of
 * star buttons.
 */
export function RatingInput({
	value,
	onChange,
	size = "default",
	max = MAX_STARS,
	disabled = false,
	name,
	className,
	...props
}: Props) {
	const [hovered, setHovered] = React.useState<number | null>(null);
	const active = hovered ?? value;

	return (
		<div
			data-slot="rating-input"
			data-size={size}
			role="radiogroup"
			aria-label="Rating"
			className={cn(
				"group/rating inline-flex items-center gap-0.5",
				disabled && "pointer-events-none opacity-50",
				className,
			)}
			onMouseLeave={() => setHovered(null)}
			{...props}
		>
			{Array.from({ length: max }, (_unused, index) => {
				const starValue = index + 1;
				const filled = starValue <= active;
				return (
					<button
						key={index}
						type="button"
						role="radio"
						aria-checked={starValue === value}
						aria-label={`${starValue} star${starValue === 1 ? "" : "s"}`}
						disabled={disabled}
						data-slot="rating-input-star"
						data-filled={filled || undefined}
						className="touch-manipulation rounded-sm p-0.5 outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring/50 not-disabled:hover:scale-110"
						onMouseEnter={() => setHovered(starValue)}
						onFocus={() => setHovered(starValue)}
						onBlur={() => setHovered(null)}
						onClick={() => onChange(starValue)}
					>
						<StarIcon
							weight={filled ? "fill" : "regular"}
							className={cn(
								starSizeClasses,
								filled ? "text-warning" : "text-muted-foreground/40",
							)}
						/>
					</button>
				);
			})}
			{name !== undefined ? (
				<input
					data-slot="rating-input-value"
					type="hidden"
					name={name}
					value={value}
				/>
			) : null}
		</div>
	);
}
