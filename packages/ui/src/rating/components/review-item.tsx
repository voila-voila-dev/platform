import type * as React from "react";
import { cn } from "#/lib/utils.ts";
import { RatingRoot } from "#/rating/components/rating-root.tsx";
import { UserAvatar } from "#/user-avatar/components/user-avatar.tsx";

interface Props extends React.ComponentProps<"div"> {
	authorName: string;
	authorAvatarSrc?: string;
	rating: number;
	/** Pre-formatted date string (the kit stays locale-agnostic). */
	date?: React.ReactNode;
}

/**
 * One review entry: the reviewer's avatar + name, their star rating, the date
 * and the review body. Composes `UserAvatar` and `Rating`.
 */
export function ReviewItem({
	authorName,
	authorAvatarSrc,
	rating,
	date,
	children,
	className,
	...props
}: Props) {
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
					description={<RatingRoot value={rating} size="sm" />}
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
