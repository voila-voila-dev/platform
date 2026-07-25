import * as React from "react";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	type AlertDialogContentSize,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "#/components/alert-dialog.tsx";
import { Button, type ButtonVariant } from "#/components/button.tsx";

type ConfirmDialogProps = {
	/**
	 * Element rendered as the dialog trigger, carrying its own label, e.g.
	 * `<Button variant="destructive">Delete</Button>`. Omit it to drive the
	 * dialog through `open`/`onOpenChange` instead.
	 */
	trigger?: React.ReactElement<Record<string, unknown>>;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	title: React.ReactNode;
	description?: React.ReactNode;
	/** Icon slot rendered in `AlertDialogMedia` beside the title. */
	media?: React.ReactNode;
	size?: AlertDialogContentSize;
	// English defaults to match the kit's other built-in labels; pass localized
	// strings from the app (e.g. paraglide messages).
	confirmLabel?: React.ReactNode;
	cancelLabel?: React.ReactNode;
	/** Confirm button variant - use `destructive` for irreversible actions. */
	variant?: ButtonVariant;
	/**
	 * Confirm handler. When it returns a promise the dialog enters a pending
	 * state (spinner on the confirm button, cancel disabled, dismissal blocked)
	 * and closes once it resolves. On rejection the dialog stays open so the
	 * user can retry - surface the failure inside `onConfirm` (e.g. a toast),
	 * the dialog does not report it.
	 */
	onConfirm?: () => undefined | Promise<unknown>;
	/** Called when the cancel button is clicked (not on Escape/backdrop). */
	onCancel?: () => void;
};

function ConfirmDialog({
	trigger,
	open: controlledOpen,
	onOpenChange,
	title,
	description,
	media,
	size,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	variant = "default",
	onConfirm,
	onCancel,
}: ConfirmDialogProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
	const [pending, setPending] = React.useState(false);
	const open = controlledOpen ?? uncontrolledOpen;

	const setOpen = (nextOpen: boolean) => {
		if (controlledOpen === undefined) {
			setUncontrolledOpen(nextOpen);
		}
		onOpenChange?.(nextOpen);
	};

	const handleOpenChange = (nextOpen: boolean) => {
		if (pending) {
			return;
		}
		setOpen(nextOpen);
	};

	const handleConfirm = async () => {
		if (onConfirm === undefined) {
			setOpen(false);
			return;
		}
		setPending(true);
		try {
			await onConfirm();
		} catch {
			return;
		} finally {
			setPending(false);
		}
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={handleOpenChange}>
			{trigger ? <AlertDialogTrigger render={trigger} /> : null}
			<AlertDialogContent size={size}>
				<AlertDialogHeader>
					{media ? <AlertDialogMedia>{media}</AlertDialogMedia> : null}
					<AlertDialogTitle>{title}</AlertDialogTitle>
					{description ? (
						<AlertDialogDescription>{description}</AlertDialogDescription>
					) : null}
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={pending} onClick={onCancel}>
						{cancelLabel}
					</AlertDialogCancel>
					<Button
						data-slot="confirm-dialog-confirm"
						variant={variant}
						loading={pending}
						onClick={handleConfirm}
					>
						{confirmLabel}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export { ConfirmDialog, type ConfirmDialogProps };
