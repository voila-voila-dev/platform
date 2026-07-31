import * as React from "react";
import { AlertDialog } from "#/alert-dialog/components/alert-dialog.tsx";
import { Button } from "#/button/components/button.tsx";
import type { ButtonVariant } from "#/button/components/button-variants.ts";

interface Props
	extends Omit<
		React.ComponentProps<typeof AlertDialog.Root>,
		"children" | "onOpenChange"
	> {
	/**
	 * Element rendered as the dialog trigger, carrying its own label, e.g.
	 * `<Button variant="destructive">Delete</Button>`. Omit it to drive the
	 * dialog through `open`/`onOpenChange` instead.
	 */
	trigger?: React.ReactElement<Record<string, unknown>>;
	/**
	 * Called when the dialog opens or closes. Narrower than Base UI's
	 * `(open, eventDetails)`, because the dialog also closes itself around
	 * `onConfirm`, where there is no originating event.
	 */
	onOpenChange?: (open: boolean) => void;
	/** The question, as a heading. Name the consequence, not the control. */
	title: React.ReactNode;
	/** What will happen, in a sentence. The place to say what cannot be undone. */
	description?: React.ReactNode;
	/** Icon slot rendered in `AlertDialog.Media` beside the title. */
	media?: React.ReactNode;
	/** Width of the panel. `sm` suits a one-line confirmation. */
	size?: "default" | "sm";
	// English defaults to match the kit's other built-in labels; pass localized
	// strings from the app (e.g. paraglide messages).
	/** Text of the confirm button. Name the action — "Delete project", not "OK". */
	confirmLabel?: React.ReactNode;
	/** Text of the dismiss button. */
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
}

export function ConfirmDialog({
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
	...props
}: Props) {
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
		<AlertDialog.Root {...props} open={open} onOpenChange={handleOpenChange}>
			{trigger ? <AlertDialog.Trigger render={trigger} /> : null}
			<AlertDialog.Content size={size}>
				<AlertDialog.Header>
					{media ? <AlertDialog.Media>{media}</AlertDialog.Media> : null}
					<AlertDialog.Title>{title}</AlertDialog.Title>
					{description ? (
						<AlertDialog.Description>{description}</AlertDialog.Description>
					) : null}
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel disabled={pending} onClick={onCancel}>
						{cancelLabel}
					</AlertDialog.Cancel>
					<Button
						data-slot="confirm-dialog-confirm"
						variant={variant}
						loading={pending}
						onClick={handleConfirm}
					>
						{confirmLabel}
					</Button>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	);
}
