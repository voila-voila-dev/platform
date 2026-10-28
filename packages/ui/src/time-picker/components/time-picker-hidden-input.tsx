import type * as React from "react";

interface Props extends Omit<React.ComponentProps<"input">, "value"> {
	value: string | null | undefined;
}

export function TimePickerHiddenInput({ name, value, ...props }: Props) {
	if (!name) return null;
	return <input type="hidden" name={name} value={value ?? ""} {...props} />;
}
