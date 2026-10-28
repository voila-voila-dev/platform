import * as React from "react";

/**
 * The controlled/uncontrolled plumbing shared by every popover picker
 * (date, date range, date-time, time): an optionally controlled value —
 * `undefined` means uncontrolled, `null` a controlled empty selection — and an
 * optionally controlled open state whose setter always notifies `onOpenChange`.
 */
export function usePickerState<Value>({
	value: controlledValue,
	defaultValue,
	open: controlledOpen,
	defaultOpen,
	onOpenChange,
}: {
	value?: Value | null;
	defaultValue?: Value;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
}): {
	isControlled: boolean;
	value: Value | null | undefined;
	setUncontrolledValue: (value: Value | undefined) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
} {
	const isControlled = controlledValue !== undefined;
	const [uncontrolledValue, setUncontrolledValue] = React.useState<
		Value | undefined
	>(defaultValue);
	const value = isControlled ? controlledValue : uncontrolledValue;

	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
		defaultOpen ?? false,
	);
	const open = controlledOpen ?? uncontrolledOpen;
	const setOpen = (next: boolean) => {
		setUncontrolledOpen(next);
		onOpenChange?.(next);
	};

	return { isControlled, value, setUncontrolledValue, open, setOpen };
}
