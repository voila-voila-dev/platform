import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props {
	hint: React.ReactNode;
	length: number;
	maxLength: number | undefined;
	overLimit: boolean;
}

/** The composer's optional hint + character counter row. */
export function ChatComposerFooter({
	hint,
	length,
	maxLength,
	overLimit,
}: Props) {
	const hasHint = hint !== undefined && hint !== null;
	if (!hasHint && maxLength === undefined) {
		return null;
	}
	return (
		<div className="flex items-center justify-between gap-2">
			{hasHint ? (
				<span
					data-slot="chat-composer-hint"
					className="min-w-0 truncate text-xs text-muted-foreground"
				>
					{hint}
				</span>
			) : null}
			{maxLength !== undefined ? (
				<span
					data-slot="chat-composer-counter"
					className={cn(
						"ml-auto shrink-0 text-xs tabular-nums",
						overLimit ? "text-destructive" : "text-muted-foreground",
					)}
				>
					{length}/{maxLength}
				</span>
			) : null}
		</div>
	);
}
