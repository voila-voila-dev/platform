import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import * as React from "react";
import { cn } from "#/lib/utils.ts";

/**
 * A monospace value that copies itself when clicked — for the identifiers,
 * addresses and phone numbers that are meant to be carried to another screen.
 * The copied value can differ from the rendered label (a truncated id copies
 * in full), and `stopPropagation` keeps a copy click from also triggering an
 * enclosing clickable row.
 */
function CopyableText({
	value,
	label = value,
	className,
	muted = false,
	copyLabel = "Copy",
	copiedLabel = "Copied",
}: {
	/** The text written to the clipboard. */
	value: string;
	/** What's rendered, when it differs from the copied value (e.g. a short id). */
	label?: string;
	className?: string;
	/** Render the label in muted secondary text. */
	muted?: boolean;
	copyLabel?: string;
	copiedLabel?: string;
}) {
	const [copied, setCopied] = React.useState(false);

	const copy = () => {
		void navigator.clipboard?.writeText(value).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		});
	};

	return (
		<button
			type="button"
			data-slot="copyable-text"
			aria-label={copied ? copiedLabel : copyLabel}
			title={copied ? copiedLabel : copyLabel}
			className={cn(
				"group inline-flex max-w-full cursor-pointer items-center gap-1.5 rounded-sm text-left font-mono focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
				muted && "text-muted-foreground",
				className,
			)}
			onClick={(event) => {
				event.stopPropagation();
				copy();
			}}
		>
			<span className="truncate">{label}</span>
			{copied ? (
				<CheckIcon className="shrink-0 text-success" weight="bold" />
			) : (
				<CopyIcon className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
			)}
		</button>
	);
}

export { CopyableText };
