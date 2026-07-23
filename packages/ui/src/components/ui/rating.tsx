import { StarIcon } from "@phosphor-icons/react";
import * as React from "react";
import { UserAvatar } from "#/components/ui/user-avatar.tsx";
import { cn } from "#/lib/utils.ts";

const MAX_STARS = 5;

type RatingSize = "sm" | "default" | "lg";

// `size` coordinates the star and count children off the root's `data-size`.
const starSizeClasses =
	"size-4 group-data-[size=lg]/rating:size-5 group-data-[size=sm]/rating:size-3.5";

/**
 * Read-only star display. `value` (0–5) controls how many stars fill with the
 * amber `--warning` token; the rest stay muted. Pass `count` to append the
 * number of reviews (e.g. "(128)").
 */
function Rating({
	value,
	count,
	size = "default",
	max = MAX_STARS,
	className,
	...props
}: Omit<React.ComponentProps<"div">, "children"> & {
	value: number;
	count?: number;
	size?: RatingSize;
	max?: number;
}) {
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

/**
 * Interactive star picker. Controlled via `value` / `onChange`; hovering
 * previews the would-be selection. Keyboard accessible through a radiogroup of
 * star buttons.
 */
function RatingInput({
	value,
	onChange,
	size = "default",
	max = MAX_STARS,
	disabled = false,
	name,
	className,
	...props
}: Omit<React.ComponentProps<"div">, "onChange"> & {
	value: number;
	onChange: (value: number) => void;
	size?: RatingSize;
	max?: number;
	disabled?: boolean;
	name?: string;
}) {
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
				<input type="hidden" name={name} value={value} />
			) : null}
		</div>
	);
}

/**
 * One review entry: the reviewer's avatar + name, their star rating, the date
 * and the review body. Composes `UserAvatar` and `Rating`.
 */
function ReviewItem({
	authorName,
	authorAvatarSrc,
	rating,
	date,
	children,
	className,
	...props
}: React.ComponentProps<"div"> & {
	authorName: string;
	authorAvatarSrc?: string;
	rating: number;
	/** Pre-formatted date string (the kit stays locale-agnostic). */
	date?: React.ReactNode;
}) {
	return (
		<div
			data-slot="review-item"
			className={cn("flex flex-col gap-2", className)}
			{...props}
		>
			<div className="flex items-start justify-between gap-3">
				<UserAvatar
					name={authorName}
					src={authorAvatarSrc}
					description={<Rating value={rating} size="sm" />}
				/>
				{date ? (
					<span
						data-slot="review-item-date"
						className="shrink-0 text-xs text-muted-foreground"
					>
						{date}
					</span>
				) : null}
			</div>
			{children ? (
				<p
					data-slot="review-item-body"
					className="text-sm/relaxed text-foreground"
				>
					{children}
				</p>
			) : null}
		</div>
	);
}

export { Rating, RatingInput, type RatingSize, ReviewItem };
