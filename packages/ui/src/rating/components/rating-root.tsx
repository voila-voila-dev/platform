import { StarIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";
import {
	MAX_STARS,
	type RatingSize,
	starSizeClasses,
} from "#/rating/components/rating-stars.ts";

interface Props extends Omit<React.ComponentProps<"div">, "children"> {
	value: number;
	count?: number;
	size?: RatingSize;
	max?: number;
}

/**
 * Read-only star display. `value` (0–5) controls how many stars fill with the
 * amber `--warning` token; the rest stay muted. Pass `count` to append the
 * number of reviews (e.g. "(128)").
 */
export function RatingRoot({
	value,
	count,
	size = "default",
	max = MAX_STARS,
	className,
	...props
}: Props) {
	const clamped = Math.max(0, Math.min(max, value));
	const rounded = Math.round(clamped);

	return (
		<div
			data-slot="rating"
			data-size={size}
			role="img"
			aria-label={`${clamped} out of ${max} stars`}
			className={cn("group/rating inline-flex items-center gap-1", className)}
			{...props}
		>
			<span className="inline-flex items-center" aria-hidden>
				{Array.from({ length: max }, (_unused, index) => {
					const filled = index < rounded;
					return (
						<StarIcon
							key={index}
							weight={filled ? "fill" : "regular"}
							data-slot="rating-star"
							data-filled={filled || undefined}
							className={cn(
								starSizeClasses,
								filled ? "text-warning" : "text-muted-foreground/40",
							)}
						/>
					);
				})}
			</span>
			{count !== undefined ? (
				<span
					data-slot="rating-count"
					className="text-sm text-muted-foreground tabular-nums group-data-[size=lg]/rating:text-base group-data-[size=sm]/rating:text-xs"
				>
					({count})
				</span>
			) : null}
		</div>
	);
}
