import type * as React from "react";
import { ConfirmDialog } from "#/confirm-dialog/components/confirm-dialog.tsx";

interface Props {
	/** The pending external URL; `null` keeps the dialog closed. */
	url: string | null;
	onClose: () => void;
	title: React.ReactNode;
	/** Warning copy shown above the URL, e.g. "Do you trust this link?". */
	description?: React.ReactNode;
	confirmLabel: React.ReactNode;
	cancelLabel: React.ReactNode;
}

export function ChatExternalLinkDialog({
	url,
	onClose,
	title,
	description,
	confirmLabel,
	cancelLabel,
}: Props) {
	return (
		<ConfirmDialog
			open={url !== null}
			onOpenChange={(open) => {
				if (!open) {
					onClose();
				}
			}}
			title={title}
			description={
				<>
					{description}
					<span
						data-slot="chat-external-link-url"
						className="mt-2 block break-all rounded-md bg-muted px-2 py-1 font-mono text-foreground text-xs"
					>
						{url}
					</span>
				</>
			}
			confirmLabel={confirmLabel}
			cancelLabel={cancelLabel}
			onConfirm={() => {
				if (url !== null) {
					window.open(url, "_blank", "noopener,noreferrer");
				}
				return undefined;
			}}
		/>
	);
}
