import type * as React from "react";

export function isSubmitKey(
	keyEvent: React.KeyboardEvent<HTMLTextAreaElement>,
	submitOnEnter: boolean,
): boolean {
	if (keyEvent.key !== "Enter" || keyEvent.nativeEvent.isComposing) {
		return false;
	}
	const withModifier = keyEvent.metaKey || keyEvent.ctrlKey;
	const plainEnterSends = submitOnEnter && !keyEvent.shiftKey;
	return withModifier || plainEnterSends;
}
