import { WarningCircleIcon, XIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";
import { Spinner } from "#/spinner/components/spinner.tsx";

/**
 * The tray of pending uploads above the composer's input row (its `above`
 * slot). Purely presentational: the app owns the upload lifecycle and feeds
 * each chip its status; the tray only lays the chips out and wraps them.
 */
export function ChatComposerAttachments({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="chat-composer-attachments"
			className={cn("flex flex-wrap gap-2", className)}
			{...props}
		/>
	);
}

interface ChatComposerAttachmentProps
	extends Omit<React.ComponentProps<"div">, "title"> {
	/**
	 * Where the upload stands. `uploading` veils the preview with a spinner
	 * (and the percent when `progress` is given), `error` with a warning; the
	 * default `ready` shows the preview alone.
	 */
	status?: "uploading" | "ready" | "error";
	/** Upload progress, 0..1 — shown as a percent under the spinner. */
	progress?: number;
	onRemove?: () => void;
	/** Accessible name of the remove button (the kit hardcodes no copy). */
	removeLabel: string;
	/** What went wrong, announced with the chip for screen readers. */
	error?: React.ReactNode;
	/** The preview: an `<img>`, an icon, whatever stands for the file. */
	children?: React.ReactNode;
}

/** One pending upload: a square chip with a preview, a status veil, and a
 * remove button that stays reachable in every state. */
export function ChatComposerAttachment({
	status = "ready",
	progress,
	onRemove,
	removeLabel,
	error,
	className,
	children,
	...props
}: ChatComposerAttachmentProps) {
	return (
		<div
			data-slot="chat-composer-attachment"
			data-status={status}
			className={cn(
				"relative size-16 overflow-hidden rounded-md border bg-muted",
				className,
			)}
			{...props}
		>
			{children}
			<ChatComposerAttachmentVeil
				status={status}
				progress={progress}
				error={error}
			/>
			{onRemove !== undefined ? (
				<button
					type="button"
					aria-label={removeLabel}
					onClick={onRemove}
					className="absolute top-0.5 right-0.5 rounded-full bg-background/80 p-0.5 text-foreground shadow-sm"
				>
					<XIcon className="size-3.5" />
				</button>
			) : null}
		</div>
	);
}

function ChatComposerAttachmentVeil({
	status,
	progress,
	error,
}: {
	status: "uploading" | "ready" | "error";
	progress: number | undefined;
	error: React.ReactNode;
}) {
	if (status === "uploading") {
		return (
			<div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-background/60">
				<Spinner className="size-4" />
				{progress !== undefined ? (
					<span className="text-[10px] text-muted-foreground tabular-nums">
						{Math.round(Math.min(Math.max(progress, 0), 1) * 100)}%
					</span>
				) : null}
			</div>
		);
	}
	if (status === "error") {
		return (
			<div className="absolute inset-0 flex items-center justify-center bg-destructive/20 text-destructive">
				<WarningCircleIcon className="size-5" />
				{error !== undefined && error !== null ? (
					<span className="sr-only">{error}</span>
				) : null}
			</div>
		);
	}
	return null;
}
